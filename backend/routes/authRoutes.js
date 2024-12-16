const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const sendEmail = require("../lib/sendEmail.js");
const crypto = require("crypto")

const router = express.Router();

const allowedDomain = "gov.in";

//singup
router.post("/signup", (req, res) => {
  const data = req.body;

  if (data.type === "recruiter") {
    const emailDomain = data.email.split('@')[1];
    if (emailDomain !== allowedDomain) {
      return res.status(403).json({ message: `Only ${allowedDomain} domain emails are allowed for recruiters` });
    }
  }

  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.type === "recruiter"
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
          user.userDetails = savedUserDetails._id;

          user
            .save()
            .then(() => {
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
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


//login
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

//forget password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = ` Hello,
                      We received a request to reset your password. If you made this request, you can reset your password by clicking the link below:
                      ${resetUrl}
                      This link will expire in 10 minutes for security reasons. If you did not request a password reset, please ignore this email or let us know immediately.
                      If you have any issues or need further assistance, feel free to reach out to our support team.
                      Best regards,
                      NRIDA`;


    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//reset password
router.put('/reset-password/:token', async (req, res) => {
  console.log(req.body); // Debugging line

  const { token } = req.params;
  const { password } = req.body;

  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({ message: 'Password is required' });
    }

    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
