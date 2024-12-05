const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  relationshipFirstName: {
    type: String,
    required: true,

  },
  relationshipMiddleName: {
    type: String
  },
  relationshipLastName: {
    type: String,
    required: true,

  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
  },
  belongsToCategory: {
    type: String,
    default: 'No'
  },
  category: {
    type: String,
    required: true,
  },
  aadhar: {
    type: Number,
    required: true,
  },
  belongsToPwBD: {
    type: String,
    default: 'No',
  },
  pwBD: {
    type: String,
    required: true,
  },
  belongsToExServiceman: {
    type: String,
    default: 'No'
  },
  religion: {
    type: String,
    default: 'Hindu',
    required: true,
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
    required: true,
  },
  permanentCity: {
    type: String,
    required: true,
  },
  permanentState: {
    type: String,
    required: true,
  },
  permanentPincode: {
    type: String,
    required: true,
  },
  sameAddress: {
    type: Boolean,
    default: false
  },
  correspondenceAddress: {
    type: String,
    required: true,
  },
  correspondenceCity: {
    type: String,
    required: true,
  },
  correspondenceState: {
    type: String,
    required: true,
  },
  correspondencePincode: {
    type: String,
    required: true,
  },
  schoolName10th: {
    type: String,
    required: true,
  },
  boardName10th: {
    type: String,
    required: true,
  },
  yop10th: {
    type: Number,
    required: true,
  },
  percentage10th: {
    type: Number,
    required: true,
  },
  schoolName12th: {
    type: String,
    required: true,
  },
  boardName12th: {
    type: String,
    required: true,
  },
  yop12th: {
    type: Number,
    required: true,
  },
  percentage12th: {
    type: Number,
    required: true,
  },
  universityGrad: {
    type: String,
    required: true,
  },
  degreeGrad: {
    type: String,
    required: true,
  },
  majorGrad: {
    type: String,
    required: true,
  },
  yopGrad: {
    type: Number,
    required: true,
  },
  percentageGrad: {
    type: Number,
    required: true,
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
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      employmentType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract']
      },
      skills: {
        type: [String],
        default: [],
        required: true,
      }
    }
  ],
  personalSkills: {
    type: [String],
    default: [],
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("JobApplicantInfo", schema);
