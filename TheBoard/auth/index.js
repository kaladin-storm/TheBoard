// auth/index.js

(function (auth) {
    
    var data = require("../dataService");
    var hasher = require("./hasher.js");
    
    var passport = require("passport");
    var localStrategy = require("passport-local").Strategy;
    
    function userVerify(username, password, next) {
        data.getUser(username, function (next, err) {
            
            if (!err && user) {
                var testHash = hasher.computeHash(password, user.salt);
                if (testHash == user.passwordHash) { //test to see if password matches
                    next(null, user); //tell password system it was succesful and return the user object
                    return;
                }
            }

            next(null, false, { message: "Invalid credentials" });
        });

       
    };

    auth.init = function (app) {

        //set up passport authentication        
        passport.use(new localStrategy(userVerify));
                
        passport.serializeUser(function (user, next) {
            next(null, user.username);
        });
        passport.deserializeUser(function (key, next) {
            data.getUser(key, function (err, user) {
                if (err || !user) {
                    next(null, false, { message: "Could not find user" });
                } else {
                    next(null, user);
                }
            });

        });

        app.use(passport.initialize());
        app.use(passport.session());
        
        
        app.get("/login", function (req, res) {
            res.render("login", { title: "Loging to board" });
        });
        
        app.post("/login", function (req, res, next) {
            var authFunction = passport.authenticate("local", function (err, user, info) {
                if (err) {
                    next(err);
                } else {
                    req.login(user, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.redirect("/");
                        }
                    });
                }
                
            });
            authFunction(req, res, next);  //actual authentication
        });


        app.get("/register", function (req, res) {
            res.render("register", { title: "Register for the Board" });
        });

        app.post("/register", function (req, res) {
            
            var salt = hasher.createSalt();

            var user = {
                name: "admin1",
                email: "admin1@aol.com", //req.body.email
                username: "admin1", //req.body.username,
                passwordHash: hasher.computeHash("password123", salt),
                salt: salt
            };

            data.addUser(user, function (err) {
                if (err) {
                    //inform user
                    //re
                    res.redirect("/register");
                } else {
                    res.redirect("/login");
                }
            });

        });
    };

})(module.exports);