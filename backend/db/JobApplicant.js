const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  // Candidate's personal details
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  },
  relationshipFirstName: {
    type: String,
    required: true
  },
  relationshipMiddleName: {
    type: String
  },
  relationshipLastName: {
    type: String,
    required: true
  },
  dob: {
    type: Date, 
    required: false 
  },
  gender: {
    type: String,
    required: false
  },
  belongsToCategory: {
    type: String,
    default: 'No'
  },
  category: {
    type: String,
    required: false
  },
  aadhar: {
    type: Number,
    required: false
  },
  belongsToPwBD: {
    type: String,
    default: 'No'
  },
  pwBD: {
    type: String,
    required: false
  },
  belongsToExServiceman: {
    type: String,
    default: 'No'
  },
  religion: {
    type: String,
    default: 'Hinduism'
  },
  email: {
    type: String,
    required: true,
    // unique: true,
    // match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  alternateEmail: {
    type: String,
    required: false
  },
  mobile: {
    type: Number,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be a 10-digit number']
  },
  officeTelephone: {
    type: Number,
    required: false
  },
  permanentAddress: {
    type: String,
    required: true
  },
  permanentCity: {
    type: String,
    required: true
  },
  permanentState: {
    type: String,
    // required: true
  },
  permanentPincode: {
    type: String,
    required: true
  },
  sameAddress: {
    type: Boolean,
    default: true
  },
  correspondenceAddress: {
    type: String,
    required: false
  },
  correspondenceCity: {
    type: String,
    required: false
  },
  correspondenceState: {
    type: String,
    required: false
  },
  correspondencePincode: {
    type: String,
    required: false
  },

  // Education details
  education: {
    schoolName10th: {
      type: String
    },
    boardName10th: {
      type: String
    },
    yop10th: {
      type: Number,
      required: false
    },
    percentage10th: {
      type: Number
    },
    schoolName12th: {
      type: String
    },
    boardName12th: {
      type: String
    },
    yop12th: {
      type: Number,
      required: false
    },
    percentage12th: {
      type: Number
    },
    universityGrad: {
      type: String
    },
    degreeGrad: {
      type: String
    },
    majorGrad: {
      type: String
    },
    yopGrad: {
      type: Number,
      required: false
    },
    percentageGrad: {
      type: Number
    },
    universityPG: {
      type: String
    },
    degreePG: {
      type: String
    },
    majorPG: {
      type: String
    },
    yopPG: {
      type: Number,
      required: false
    },
    percentagePG: {
      type: Number
    }
  },

  // Job Experience Details
  jobExperience: [
    {
      companyName: {
        type: String
      },
      location: {
        type: String
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract']
      },
      skills: {
        type: [String],
        default: []
      }
    }
  ],

  // Additional fields for resume and profile picture
  resume: {
    type: String
  },
  profile: {
    type: String
  }
});

module.exports = mongoose.model("JobApplicantInfo", schema);


// const mongoose = require("mongoose");

// let schema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     education: [
//       {
//         institutionName: {
//           type: String,
//           required: true,
//         },
//         startYear: {
//           type: Number,
//           min: 1930,
//           max: new Date().getFullYear(),
//           required: true,
//           validate: Number.isInteger,
//         },
//         endYear: {
//           type: Number,
//           max: new Date().getFullYear(),
//           validate: [
//             { validator: Number.isInteger, msg: "Year should be an integer" },
//             {
//               validator: function (value) {
//                 return this.startYear <= value;
//               },
//               msg: "End year should be greater than or equal to Start year",
//             },
//           ],
//         },
//       },
//     ],
//     skills: [String],
//     rating: {
//       type: Number,
//       max: 5.0,
//       default: -1.0,
//       validate: {
//         validator: function (v) {
//           return v >= -1.0 && v <= 5.0;
//         },
//         msg: "Invalid rating",
//       },
//     },
//     resume: {
//       type: String,
//     },
//     profile: {
//       type: String,
//     },
//   },
//   { collation: { locale: "en" } }
// );

// module.exports = mongoose.model("JobApplicantInfo", schema);
