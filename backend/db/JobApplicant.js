const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  // Candidate's personal details
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
  candidateEmail: {
    type: String,
    
  },
  alternateCandidateEmail: {
    type: String,
    required: false
  },
  mobile: {
    type: Number,
    match: [/^\d{10}$/, 'Phone number must be a 10-digit number']
  },
  officeTelephone: {
    type: Number,
    required: false
  },
  permanentAddress: {
    type: String,
  },
  permanentCity: {
    type: String,
  },
  permanentState: {
    type: String,
    // required: true
  },
  permanentPincode: {
    type: String,
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
