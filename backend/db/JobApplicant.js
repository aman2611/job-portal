const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
  },
  relationship: {
    type: String,
  },
  relationshipFirstName: {
    type: String,

  },
  relationshipMiddleName: {
    type: String
  },
  relationshipLastName: {
    type: String,

  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  belongsToCategory: {
    type: String,
    default: 'No'
  },
  category: {
    type: String,
  },
  aadhar: {
    type: Number,
  },
  belongsToPwBD: {
    type: String,
    default: 'No',
  },
  pwBD: {
    type: String,
  },
  belongsToExServiceman: {
    type: String,
    default: 'No'
  },
  religion: {
    type: String,
    default: 'Hindu',
  },
  candidateEmail: {
    type: String,
  },
  alternateCandidateEmail: {
    type: String,
  },
  mobile: {
    type: Number,
    match: [/^\d{10}$/, 'Phone number must be a 10-digit number']
  },
  officeTelephone: {
    type: Number,
  },
  permanentAddress: {
    type: String,
  },
  permanentCity: {
    type: String,
  },
  permanentState: {
    type: String,
  },
  permanentPincode: {
    type: String,
  },
  sameAddress: {
    type: Boolean,
    default: false
  },
  correspondenceAddress: {
    type: String,
  },
  correspondenceCity: {
    type: String,
  },
  correspondenceState: {
    type: String,
  },
  correspondencePincode: {
    type: String,
  },
  schoolName10th: {
    type: String,
  },
  boardName10th: {
    type: String,
  },
  yop10th: {
    type: Number,
  },
  percentage10th: {
    type: Number,
  },
  schoolName12th: {
    type: String,
  },
  boardName12th: {
    type: String,
  },
  yop12th: {
    type: Number,
  },
  percentage12th: {
    type: Number,
  },
  universityGrad: {
    type: String,
  },
  degreeGrad: {
    type: String,
  },
  majorGrad: {
    type: String,
  },
  yopGrad: {
    type: Number,
  },
  percentageGrad: {
    type: Number,
  },
  universityPG: {
    type: String,
  },
  degreePG: {
    type: String,
  },
  majorPG: {
    type: String,
  },
  yopPG: {
    type: Number,
  },
  percentagePG: {
    type: Number
  },
  jobExperience: [
    {
      companyName: {
        type: String,
          },
      location: {
        type: String,
          },
      startDate: {
        type: Date,
          },
      endDate: {
        type: Date,
          },
      employmentType: {
        type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract']
      },
      skills: {
        type: [String],
        default: [],
          }
    }
  ],
  personalSkills: {
    type: [String],
    default: [],
  },
  resume: {
    type: String,
  },
  profilePicture: {
    type: String,
  }
});

module.exports = mongoose.model("JobApplicantInfo", schema);
