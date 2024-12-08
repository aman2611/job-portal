const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");

const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
            userId: user._id,
            name: data.name,
            contactNumber: data.contactNumber,
            bio: data.bio,
            email: data.email,
          })
          : new JobApplicant({
            userId: user._id,
            name: data.name,
            education: data.education,
            skills: data.skills,
            rating: data.rating,
            resume: data.resume,
            profilePicture: data.profilePicture,
          });

      userDetails
        .save()
        .then((savedUserDetails) => {
          // After saving userDetails, update the user document with the reference to userDetails
          user.userDetails = savedUserDetails._id;

          // Save updated user with the userDetails reference
          user
            .save()
            .then(() => {
              // Token
              const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
              res.json({
                token: token,
                type: user.type,
              });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
            .catch((err) => {
              user
                .delete()
                .then(() => {
                  res.status(400).json(err);
                })
                .catch((err) => {
                  res.json({ error: err });
                });
              err;
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    });

  router.post("/login", (req, res, next) => {
    passport.authenticate(
      "local",
      { session: false },
      function (err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          res.status(401).json(info);
          return;
        }
        // Token
        const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
        res.json({
          token: token,
          type: user.type,
        });
      }
    )(req, res, next);
  });

  module.exports = router;
