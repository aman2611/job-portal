const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

let schema = new mongoose.Schema(
  {
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        // Only require password when it's not a reset operation
        return !this.isResettingPassword; 
      },
    },
    type: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
    userDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplicantInfo",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  { collation: { locale: "en" } }
);

// Password hashing
schema.pre("save", function (next) {
  let user = this;

  // Skip hashing if password hasn't changed
  if (!user.isModified("password")) {
    return next();
  }

  // Check if the password is not being reset
  if (!user.password) {
    return next(new Error("Password is required"));
  }

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Password verification upon login
schema.methods.login = function (password) {
  let user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve();
      } else {
        reject(new Error("Invalid password"));
      }
    });
  });
};

// Function to trigger password reset logic
schema.methods.triggerPasswordReset = function () {
  this.isResettingPassword = true;
};

module.exports = mongoose.model("UserAuth", schema);
