import express from "express";
import passport from "passport";
var router = express.Router();
import { googleLogout } from "vue3-google-login";
import { Store } from "vuex";
import axios from "axios";
import { ensureAuth } from "../scripts/ensureLogin";
import { ensureGuest } from "../scripts/ensureLogin";
import { METHODS } from "http";
import { useStore } from "vuex";
const store = useStore();

router.get("/", function (req, res, next) {
  res.redirect("/home");
});

router.get("/login", ensureAuth, function (req, res, next) {
  req.session["user"] = req.user;
  req.session.save();
  console.log("login " + req.user);
  console.log("login " + req.session);
  res.redirect("/profile");
});

router.post(
  "/auth/callback/google-one-tap",
  passport.authenticate("google-one-tap", {
    session: true,
    failureRedirect: "/home",
  }),
  function (req, res) {
    let user: {
      googleID: string;
      displayName: string;
      firstName: string;
      lastName: string;
      email: string;
      pfp: string;
      userID: string;
      logged: boolean;
    } = {
      googleID: req?.user?.["googleID"] ?? "",
      displayName: req?.user?.["displayName"] ?? "",
      firstName: req?.user?.["firstName"] ?? "",
      lastName: req?.user?.["lastName"] ?? "",
      email: req?.user?.["email"] ?? "",
      pfp: req?.user?.["pfp"] ?? "",
      userID: req?.user?.["userID"] ?? "",
      logged: true,
    };
    try {
      var string = encodeURIComponent(JSON.stringify(user));
      
      req.session["user"] = user;
      req.session.save();
      res.cookie("session", req.sessionID, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.redirect(
        "/redirect" + "?data=" + string + "&session=" + req.sessionID
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

var logout = function () {
  return function (req, res, next) {
    req.logout();
    googleLogout();
    req.session.destroy();
    res.clearCookie("session");
    next();
  };
};

router.get("/logout", logout, function (req, res, next) {
  console.log("logout");
  res.status(200).send("logged out");
});

export { router };
