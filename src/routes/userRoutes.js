const express = require('express');
const mongoose = require('mongoose');

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

module.exports = router