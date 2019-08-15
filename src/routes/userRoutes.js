const express = require('express');
const mongoose = require('mongoose');
const axios = require("axios");

const router = express.Router();
const User = mongoose.model('User');

const configs = require("../configs/configs").configs;
const constants = require("../constants/message_constants").constants;


router.get('/user/all', (req, res) => {
    User.find().then((users) => {
      res.send(users);
    }).catch(() => { res.send('Sorry! Something went wrong.'); });
});

// User login api 
router.post('/user/login', (req, res) => { 

    // Find user with requested email 
    User.findOne({ email : req.body.email }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                message : constants.USER_NOT_FOUND
            }); 
        } 
        else { 
            if (user.validPassword(req.body.password)) { 
                return res.status(201).send({
                    message : constants.USER_LOGGED_IN
                }) 
            } 
            else { 
                return res.status(400).send({ 
                    message : constants.WRONG_PASSWORD
                }); 
            } 
        } 
    }); 
}); 

// Sign up API
router.post('/user/signup', (req, res) => {
    console.log(`*** Inside signup API with firstName...${JSON.stringify(req.body.firstName)}***`);
    // Creating empty user object 
    let newUser = new User();
    // Intialize newUser object with request data 
    newUser.firstName = req.body.firstName; 
    newUser.lastName = req.body.lastName;
    newUser.phoneNumber = req.body.phoneNumber;
    newUser.email = req.body.email;
    // Call setPassword function to hash password 
    newUser.setPassword(req.body.password); 

    console.log("*** Before saving user ***");
    // Save newUser object to database 
    newUser.save((err, User) => { 
        console.log("*** Exiting signup API ***");
        if (err) { 
            return res.status(400).send({ 
                message : "Failed to add user." + err.message
            }); 
        } 
        else { 
            return res.status(201).send({ 
                message : constants.USER_ADDED_SUCCESS
            }); 
        } 
    });
});

// Send OTP API
router.post("/user/sendOtp", (req, res) => {
    console.log("*** Inside sendOtp API with phone number " + req.body.phoneNumber + " ***");
    User.findOne({ phoneNumber : req.body.phoneNumber }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                message : constants.USER_NOT_FOUND
            }); 
        } else {
            console.log(`*** Found user with phone number ${req.body.phoneNumber} ***`)

            axios.post(`https://control.msg91.com/api/sendotp.php?mobile=${"91" + req.body.phoneNumber}&authkey=${configs.MSG91_AUTHKEY}`,
                null, {}).then((response) =>{
                    console.log("Response data..." + response.data);
                    if (response.data.type === "success") {
                        return res.status(201).send({ 
                            message : "OTP has been sent successfully to " + req.body.phoneNumber
                        }); 
                    } else {
                        return res.status(400).send({ 
                            message : "OTP sending failed for " + req.body.phoneNumber
                        }); 
                    }
            }).catch((err) =>{
                console.error("Verifying otp failed...", err);
                return res.status(400).send({ 
                    message : "OTP sending failed for " + req.body.phoneNumber
                }); 
            })
        }
    })
})

// API for OTP verification - to allow login
router.post("/user/verifyOtp", (req, res) => {
    console.log("*** Inside verifyOtp API with otp" + req.body.otp + " and phoneNumber " + req.body.phoneNumber + " ***");

    const headers = {
        "content-type": "application/x-www-form-urlencoded"
    };
      
    axios.post(`https://control.msg91.com/api/verifyRequestOTP.php?authkey=${configs.MSG91_AUTHKEY}&mobile=${"91" + req.body.phoneNumber}&otp=${req.body.otp}`,
        null, headers).then((response) =>{
            console.log("Response data...", response.data);
            if (response.data.type === "success") {
                return res.status(201).send({
                    message : constants.USER_LOGGED_IN, 
                }) 
            } else {
                return res.status(400).send({ 
                    message : constants.WRONG_OTP
                });
            }
    }).catch((err) =>{
        console.error("Verifying otp failed...", err);
        return res.status(400).send({ 
            message : constants.OTP_VERIFICATION_FAILED
        });
    })
})

module.exports = router