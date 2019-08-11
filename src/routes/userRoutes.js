const express = require('express');
const mongoose = require('mongoose');
var http = require("https");
var qs = require("querystring");

const router = express.Router();

const User = mongoose.model('User');


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
                message : "User not found."
            }); 
        } 
        else { 
            if (user.validPassword(req.body.password)) { 
                return res.status(201).send({
                    message : "User Logged In", 
                }) 
            } 
            else { 
                return res.status(400).send({ 
                    message : "Wrong Password"
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
                message : "User added succesfully."
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
                message : "User not found."
            }); 
        } else {
            console.log(`*** Found user with phone number ${req.body.phoneNumber} ***`)
            let options = {
                "method": "POST",
                "hostname": "control.msg91.com",
                "port": null,
                "path": `/api/sendotp.php?mobile=${"91" + req.body.phoneNumber}&authkey=289201AEHexKaGq5d503156`,
                "headers": {}
            };
          
            let httpReq = http.request(options, function (response) {
                var chunks = [];
            
                response.on("data", function (chunk) {
                    chunks.push(chunk);
                });
            
                response.on("end", function () {
                    let body = Buffer.concat(chunks);
                    console.log("Response Body..." + body.toString());
                    if (JSON.parse(body.toString()).type === "success") {
                        return res.status(201).send({ 
                            message : "OTP has been sent successfully to " + req.body.phoneNumber
                        }); 
                    } else {
                        return res.status(400).send({ 
                            message : "OTP sending failed for " + req.body.phoneNumber
                        }); 
                    }
                });
            });
              
            httpReq.end();
        }
    })
})

// Verify OTP API - to allow login
router.post("/user/verifyOtp", (req, res) => {
    console.log("*** Inside verifyOtp API with otp" + req.body.otp + " and phoneNumber " + req.body.phoneNumber + " ***");

    var options = {
        "method": "POST",
        "hostname": "control.msg91.com",
        "port": null,
        "path": `/api/verifyRequestOTP.php?authkey=289201AEHexKaGq5d503156&mobile=${"91" + req.body.phoneNumber}&otp=${req.body.otp}`,
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        }
    };
      
    var req = http.request(options, function (response) {
        var chunks = [];
        
        response.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        response.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());

            if (JSON.parse(body.toString()).type === "success") {
                return res.status(201).send({
                    message : "User Logged In", 
                }) 
            } else {
                return res.status(400).send({ 
                    message : "Wrong OTP"
                });
            }
        });
    });
    
    req.write(qs.stringify({}));
    req.end();
})

module.exports = router