import { nanoid } from "nanoid";
import passport from "passport";
var Strategy = require("passport-google-one-tap").GoogleOneTapStrategy;
import User from '../db/MongooseSchema/User'
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

module.exports = function () {
    // Configure the Google One Tap strategy for use by Passport.
    //
    // Google One Tap strategy require a `verify` function which receives the
    // with the user's profile. The function must invoke `done`
    // with a user object, which will be set at `req.user` in route handlers after
    // authentication.
    passport.use(
        new Strategy(
            {
                consumerKey: process.env["GOOGLE_CLIENT_ID"],
                consumerSecret: process.env["GOOGLE_CLIENT_SECRET"],
            },
            async (profile, done) => {
                console.log(profile)
                if (!profile) {
                    return done(undefined, undefined);
                }

                //console.log(profile)
                var newUser = {};
                if (profile.name === undefined) {
                    newUser = {
                        googleID: profile.id,
                        displayName: profile.displayName,
                        firstName: null,
                        lastName: null,
                        email: profile.emails[0].value,
                        pfp: profile.photos[0].value,
                    }
                } else {
                    newUser = {
                        googleID: profile.id,
                        displayName: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        pfp: profile.photos[0].value,
                    }
                }
                try {
                    let user = await User.findOne({ googleID: profile.id })
                    if (user) {
                        done(undefined, user)
                    } else {
                        user = await User.create(newUser)
                        done(undefined, user)
                    }
                } catch (error) {
                    done(error)
                }
            }
        )
    );

    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session. In a
    // production-quality application, this would typically be as simple as
    // supplying the user ID when serializing, and querying the user record by ID
    // from the database when deserializing.
    passport.serializeUser((user: any, cb) => {
        cb(undefined, user.userID);
    });

    passport.deserializeUser(async (id, cb) => {
        //id = nanoid() / userID
        try {
            const user = await User.findOne({userID: id});
            cb(null, user);
        } catch (err) {
            cb(err);
        }
    });
};