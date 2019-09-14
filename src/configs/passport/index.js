const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

var myLocalConfig = (passport) => {
   
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            console.log(`*** Inside login API with email...${JSON.stringify(email)}***`);
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        console.log(`*** Error while login with email...${JSON.stringify(email)}***`);
                        return done(err);
                    }

                    // if no user is found, return the message
                    if (!user) {
                        console.log(`*** User not found with email...${JSON.stringify(email)}***`);
                        return done(null, false);
                    }
                    if (!user.validPassword(password))  {
                        console.log(`*** Invalid password... ${password}`);
                        return done(null, false);
                    }
                    // all is well, return user
                    else {
                        console.log(`*** Found one with email...${JSON.stringify(email)}***`);
                        return done(null, user);
                    }
                });
            });

        }));

    
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            console.log(`*** Inside signup API with firstName...${req.body.firstName}***`);
            if (email) {
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            }

            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:
                if (!req.user) {
                    console.log(`*** No user found with email...${email}***`);
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        // if there are any errors, return the error
                        if (err) {
                            console.log(`*** Error while registering with email...${email}***`);
                            return done(err);
                        }

                        // check to see if theres already a user with that email
                        if (user) {
                            console.log(`*** User found with email...${email}***`);
                            return done(null, false);
                        } else {
                            console.log(`*** Creating user with email...${email}***`);
                            // create the user
                            var newUser            = new User();
                            newUser.local.firstName = req.body.firstName;
                            newUser.local.lastName = req.body.lastName;
                            newUser.local.phoneNumber = req.body.phoneNumber;
                            newUser.local.email    = email;
                            newUser.local.password = newUser.setPassword(password);

                            newUser.save(function(err) {
                                if (err) {
                                    console.log(`*** Error while User saving with email...${email}***`);
                                    return done(err);
                                }
                                console.log(`*** User saved with email...${email}***`);
                                return done(null, newUser);
                            });
                        }

                    });
                    // if the user is logged in but has no local account...
                } else if ( !req.user.local.email ) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({ 'local.email' :  email }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false);
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        } else {
                            let user = req.user;
                            user.local.firstName = req.body.firstName;
                            user.local.email = email;
                            user.local.password = user.setPassword(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null,user);
                            });
                        }
                    });
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });

        }));
};

module.exports = myLocalConfig;