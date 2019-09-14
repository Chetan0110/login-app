const express = require('express');
const router = express.Router();
const passport = require('passport');
const { google } = require('googleapis');

const config = require("../configs/configs").configs;




// Commented as this code is not being used anymore 
// as passport has been integrated for persistent login
// The code being used is modified code which is below commented code


// const mongoose = require('mongoose');
// const axios = require("axios");
// const User = mongoose.model('User');
// const configs = require("../configs/configs").configs;
// const constants = require("../constants/message_constants").constants;

// router.get('/user/all', (req, res) => {
//     User.find().then((users) => {
//       res.send(users);
//     }).catch(() => { res.send('Sorry! Something went wrong.'); });
// });

// // User login api 
// router.post('/user/login', (req, res) => { 

//     // Find user with requested email 
//     User.findOne({ email : req.body.email }, function(err, user) { 
//         if (user === null) { 
//             return res.status(400).send({ 
//                 message : constants.USER_NOT_FOUND
//             }); 
//         } 
//         else { 
//             if (user.validPassword(req.body.password)) { 
//                 return res.status(201).send({
//                     message : constants.USER_LOGGED_IN
//                 }) 
//             } 
//             else { 
//                 return res.status(400).send({ 
//                     message : constants.WRONG_PASSWORD
//                 }); 
//             } 
//         } 
//     }); 
// }); 

// // Sign up API
// router.post('/user/signup', (req, res) => {
//     console.log(`*** Inside signup API with firstName...${JSON.stringify(req.body.firstName)}***`);
//     // Creating empty user object 
//     let newUser = new User();
//     // Intialize newUser object with request data 
//     newUser.firstName = req.body.firstName; 
//     newUser.lastName = req.body.lastName;
//     newUser.phoneNumber = req.body.phoneNumber;
//     newUser.email = req.body.email;
//     // Call setPassword function to hash password 
//     newUser.setPassword(req.body.password); 

//     console.log("*** Before saving user ***");
//     // Save newUser object to database 
//     newUser.save((err, User) => { 
//         console.log("*** Exiting signup API ***");
//         if (err) { 
//             return res.status(400).send({ 
//                 message : "Failed to add user." + err.message
//             }); 
//         } 
//         else { 
//             return res.status(201).send({ 
//                 message : constants.USER_ADDED_SUCCESS
//             }); 
//         } 
//     });
// });

// // Send OTP API
// router.post("/user/sendOtp", (req, res) => {
//     console.log("*** Inside sendOtp API with phone number " + req.body.phoneNumber + " ***");
//     User.findOne({ phoneNumber : req.body.phoneNumber }, function(err, user) { 
//         if (user === null) { 
//             return res.status(400).send({ 
//                 message : constants.USER_NOT_FOUND
//             }); 
//         } else {
//             console.log(`*** Found user with phone number ${req.body.phoneNumber} ***`)

//             axios.post(`https://control.msg91.com/api/sendotp.php?mobile=${"91" + req.body.phoneNumber}&authkey=${configs.MSG91_AUTHKEY}`,
//                 null, {}).then((response) =>{
//                     console.log("Response data..." + response.data);
//                     if (response.data.type === "success") {
//                         return res.status(201).send({ 
//                             message : "OTP has been sent successfully to " + req.body.phoneNumber
//                         }); 
//                     } else {
//                         return res.status(400).send({ 
//                             message : "OTP sending failed for " + req.body.phoneNumber
//                         }); 
//                     }
//             }).catch((err) =>{
//                 console.error("Verifying otp failed...", err);
//                 return res.status(400).send({ 
//                     message : "OTP sending failed for " + req.body.phoneNumber
//                 }); 
//             })
//         }
//     })
// })

// // API for OTP verification - to allow login
// router.post("/user/verifyOtp", (req, res) => {
//     console.log("*** Inside verifyOtp API with otp" + req.body.otp + " and phoneNumber " + req.body.phoneNumber + " ***");

//     const headers = {
//         "content-type": "application/x-www-form-urlencoded"
//     };
      
//     axios.post(`https://control.msg91.com/api/verifyRequestOTP.php?authkey=${configs.MSG91_AUTHKEY}&mobile=${"91" + req.body.phoneNumber}&otp=${req.body.otp}`,
//         null, headers).then((response) =>{
//             console.log("Response data...", response.data);
//             if (response.data.type === "success") {
//                 return res.status(201).send({
//                     message : constants.USER_LOGGED_IN, 
//                 }) 
//             } else {
//                 return res.status(400).send({ 
//                     message : constants.WRONG_OTP
//                 });
//             }
//     }).catch((err) =>{
//         console.error("Verifying otp failed...", err);
//         return res.status(400).send({ 
//             message : constants.OTP_VERIFICATION_FAILED
//         });
//     })
// })

// module.exports = router



router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : 'signup'
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : 'login'
}), function(req, res, next) {
    console.log("Returning response...");
    return res.status(201).send({
        message : constants.USER_LOGGED_IN
    }) 
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.status(200).json(req.user);
});
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.status(200).json({
        'message': 'successfully logout'
    });
});


// Google Authentication
//
const googleConfig = {
    clientId: config.OAUTH2_CLIENT_ID,
    clientSecret: config.OAUTH2_CLIENT_SECRET,
    redirect: config.OAUTH2_CALLBACK
};

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePlusApi(auth) {
  return google.plus({ version: 'v1', auth });
}

/**
 * Create a Google URL and send to the client to log in the user.
 */
function urlGoogle() {
  const auth = createConnection();
  const url = getConnectionUrl(auth);
  return url;
}

router.get('/getGoogleUrl', (req, res) => {
    res.status(200).json({ googleAccountsUrl: urlGoogle()});
});

router.get(
    // OAuth 2 callback url. Use this url to configure your OAuth client in the
    // Google Developers console
    '/auth/google/callback',
    // Redirect back to the original page, if any
    async (req, res) => {
        const code = req.url.split("?")[1].split("&")[0].split("=")[1];
        await getGoogleAccountFromCode(req, res, code);
    }
  );
/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(req, res, code) {
    const redirect = '/home';
    //   console.log("Redirecting to..." + redirect);
    //   delete req.session.oauth2return;
    const auth = createConnection();
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({ userId: 'me' });
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    console.log("id: " + userGoogleId + "email: " + userGoogleEmail + "tokens: " + tokens);
    res.redirect(redirect);
    // return {
    //   id: userGoogleId,
    //   email: userGoogleEmail,
    //   tokens: tokens,
    // };
}
  

module.exports = router;

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log("Checking auth...");
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}