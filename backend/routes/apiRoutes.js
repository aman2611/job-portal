  const express = require("express");
  const mongoose = require("mongoose");
  const jwtAuth = require("../lib/jwtAuth");

  const User = require("../db/User");
  const JobApplicant = require("../db/JobApplicant");
  const Recruiter = require("../db/Recruiter");
  const Job = require("../db/Job");
  const Application = require("../db/Application");
  const Rating = require("../db/Rating");

  const router = express.Router();

  // To add new job
  router.post("/jobs", jwtAuth, (req, res) => {
    const user = req.user;

    if (user.type != "recruiter") {
      res.status(401).json({
        message: "You don't have permissions to add jobs",
      });
      return;
    }

    const data = req.body;

    let job = new Job({
      userId: user._id,
      title: data.title,
      workplaceType: data.workplaceType,
      description: data.description,
      salary: data.salary,
      deadline: data.deadline,
      maxApplicants: data.maxApplicants,
      maxPositions: data.maxPositions,
      dateOfPosting: data.dateOfPosting,
      jobType: data.jobType,
      duration: data.duration,
      skillsets: data.skillsets,
      rating: data.rating,
      questions: data.questions
    });

    job
      .save()
      .then(() => {
        res.json({ message: "Job added successfully to the database" });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });

  // to get all the jobs [pagination] [for recruiter personal and for everyone]
  router.get("/jobs", jwtAuth, (req, res) => {
    let user = req.user;

    let findParams = {};
    let sortParams = {};

    // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

    // to list down jobs posted by a particular recruiter
    if (user.type === "recruiter" && req.query.myjobs) {
      findParams = {
        ...findParams,
        userId: user._id,
      };
    }

    if (req.query.q) {
      findParams = {
        ...findParams,
        title: {
          $regex: new RegExp(req.query.q, "i"),
        },
      };
    }

    if (req.query.jobType) {
      let jobTypes = [];
      if (Array.isArray(req.query.jobType)) {
        jobTypes = req.query.jobType;
      } else {
        jobTypes = [req.query.jobType];
      }
      // console.log(jobTypes);
      findParams = {
        ...findParams,
        jobType: {
          $in: jobTypes,
        },
      };
    }

    if (req.query.salaryMin && req.query.salaryMax) {
      findParams = {
        ...findParams,
        $and: [
          {
            salary: {
              $gte: parseInt(req.query.salaryMin),
            },
          },
          {
            salary: {
              $lte: parseInt(req.query.salaryMax),
            },
          },
        ],
      };
    } else if (req.query.salaryMin) {
      findParams = {
        ...findParams,
        salary: {
          $gte: parseInt(req.query.salaryMin),
        },
      };
    } else if (req.query.salaryMax) {
      findParams = {
        ...findParams,
        salary: {
          $lte: parseInt(req.query.salaryMax),
        },
      };
    }

    if (req.query.duration) {
      findParams = {
        ...findParams,
        duration: {
          $lt: parseInt(req.query.duration),
        },
      };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    // console.log(findParams);
    // console.log(sortParams);

    // Job.find(findParams).collation({ locale: "en" }).sort(sortParams);
    // .skip(skip)
    // .limit(limit)

    let arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
    ];

    if (Object.keys(sortParams).length > 0) {
      arr = [
        {
          $lookup: {
            from: "recruiterinfos",
            localField: "userId",
            foreignField: "userId",
            as: "recruiter",
          },
        },
        { $unwind: "$recruiter" },
        { $match: findParams },
        {
          $sort: sortParams,
        },
      ];
    }

    // console.log(arr);

    Job.aggregate(arr)
      .then((posts) => {
        if (posts == null) {
          res.status(404).json({
            message: "No job found",
          });
          return;
        }
        res.json(posts);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });

  // to get info about a particular job
  router.get("/jobs/:id", jwtAuth, (req, res) => {
    Job.findOne({ _id: req.params.id })
      .then((job) => {
        if (job == null) {
          res.status(400).json({
            message: "Job does not exist",
          });
          return;
        }
        res.json(job);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });

  // to update info of a particular job
  router.put("/jobs/:id", jwtAuth, (req, res) => {
    const user = req.user;
    
    if (user.type != "recruiter") {
      res.status(401).json({
        message: "You don't have permissions to change the job details",
      });
      return;
    }
  
    Job.findOne({
      _id: req.params.id,
      userId: user.id,
    })
      .then((job) => {
        if (job == null) {
          res.status(404).json({
            message: "Job does not exist",
          });
          return;
        }
  
        const data = req.body;
  
        // Check if status is being updated
        if (data.jobStatus) {
          // Update the status to the new value, either "Open" or "Closed"
          job.jobStatus = data.jobStatus;
        }
  
        // Optionally update other fields if needed (maxApplicants, maxPositions, etc.)
        if (data.maxApplicants) {
          job.maxApplicants = data.maxApplicants;
        }
        if (data.maxPositions) {
          job.maxPositions = data.maxPositions;
        }
        if (data.deadline) {
          job.deadline = data.deadline;
        }
  
        // Save the updated job to the database
        job
          .save()
          .then(() => {
            res.json({
              message: "Job details updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
  

  // to delete a job
  router.delete("/jobs/:id", jwtAuth, (req, res) => {
    const user = req.user;
    if (user.type != "recruiter") {
      res.status(401).json({
        message: "You don't have permissions to delete the job",
      });
      return;
    }
    Job.findOneAndDelete({
      _id: req.params.id,
      userId: user.id,
    })
      .then((job) => {
        if (job === null) {
          res.status(401).json({
            message: "You don't have permissions to delete the job",
          });
          return;
        }
        res.json({
          message: "Job deleted successfully",
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });

  // get user's personal details
  router.get("/user", jwtAuth, (req, res) => {
    const user = req.user;
    console.log('this is the user:', user)
    if (user.type === "recruiter") {
      Recruiter.findOne({ userId: user._id })
        .then((recruiter) => {
          if (recruiter == null) {
            res.status(404).json({
              message: "User does not exist",
            });
            return;
          }
          res.json(recruiter);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      User.findOne({ _id: user._id }).populate("userDetails")
        .then((jobApplicant) => {
          console.log('jobapplicants:', jobApplicant)
          if (jobApplicant == null) {
            res.status(404).json({
              message: "User does not exist",
            });
            return;
          }
          res.json(jobApplicant);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });

  // get user details from id
  router.get("/user/:id", jwtAuth, async (req, res) => {
    try {
      // Find the user by ID
      const userData = await User.findOne({ _id: req.params.id });

      if (!userData) {
        return res.status(404).json({
          message: "User does not exist",
        });
      }

      if (userData.type === "recruiter") {
        // Find recruiter details
        const recruiter = await Recruiter.findOne({ userId: userData._id });

        if (!recruiter) {
          return res.status(404).json({
            message: "Recruiter details not found",
          });
        }

        return res.json(recruiter);
      } else if (userData.type === "applicant") {
        // Find job applicant details
        const jobApplicant = await JobApplicant.findOne({ userId: userData._id });

        if (!jobApplicant) {
          return res.status(404).json({
            message: "Job applicant details not found",
          });
        }

        return res.json(jobApplicant);
      } else {
        return res.status(400).json({
          message: "Invalid user type",
        });
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({
        message: "An error occurred while fetching user details",
        error: err.message,
      });
    }
  });


  // update user details
  router.put("/user", jwtAuth, async (req, res) => {
    const user = req.user;
    const data = req.body;

    console.log("user: ", user)

    try {
      if (user.type === "recruiter") {
        let recruiter = await Recruiter.findOneAndUpdate(
          { userId: user._id },
          // { _id: user.userDetails },
          {
            $set: {
              name: data.name || "",
              contactNumber: data.contactNumber || "",
              bio: data.bio || "",
              email: data.email || "",
            },
          },
          { new: true }
        );

        if (!recruiter) {
          return res.status(404).json({ message: "Recruiter profile not found." });
        }

        await User.findByIdAndUpdate(user._id, {
          $set: { userDetails: recruiter._id },
        });

        return res.json({ message: "Recruiter profile updated successfully" });
      } else {
        let jobApplicant = await JobApplicant.findOneAndUpdate(
          { _id: user.userDetails },
          {
            $set: {
              firstName: data.firstName || "",
              middleName: data.middleName || "",
              lastName: data.lastName || "",
              email: data.email || user.email,
              candidateEmail: data.email || user.email,
              relationship: data.relationship || "",
              relationshipFirstName: data.relationshipFirstName || "",
              relationshipMiddleName: data.relationshipMiddleName || "",
              relationshipLastName: data.relationshipLastName || "",
              dob: data.dob || null,
              gender: data.gender || "",
              belongsToCategory: data.belongsToCategory || "No",
              category: data.category || "",
              aadhar: data.aadhar || "",
              belongsToPwBD: data.belongsToPwBD || "No",
              pwBD: data.pwBD || "",
              belongsToExServiceman: data.belongsToExServiceman || "No",
              religion: data.religion || "Hinduism",
              alternateEmail: data.alternateEmail || "",
              mobile: data.mobile || "",
              officeTelephone: data.officeTelephone || "",
              permanentAddress: data.permanentAddress || "",
              permanentCity: data.permanentCity || "",
              permanentState: data.permanentState || "",
              permanentPincode: data.permanentPincode || "",
              sameAddress: data.sameAddress || false,
              correspondenceAddress: data.correspondenceAddress || "",
              correspondenceCity: data.correspondenceCity || "",
              correspondenceState: data.correspondenceState || "",
              correspondencePincode: data.correspondencePincode || "",
              schoolName10th: data.schoolName10th || "",
              boardName10th: data.boardName10th || "",
              yop10th: data.yop10th || "",
              percentage10th: data.percentage10th || "",
              schoolName12th: data.schoolName12th || "",
              boardName12th: data.boardName12th || "",
              yop12th: data.yop12th || "",
              percentage12th: data.percentage12th || "",
              universityGrad: data.universityGrad || "",
              degreeGrad: data.degreeGrad || "",
              majorGrad: data.majorGrad || "",
              percentageGrad: data.percentageGrad || "",
              yopGrad: data.yopGrad || "",
              universityPG: data.universityPG || "",
              degreePG: data.degreePG || "",
              majorPG: data.majorPG || "",
              percentagePG: data.percentagePG || "",
              yopPG: data.yopPG || "",
              jobExperience: data.jobExperience.length > 0 ? data.jobExperience : [],
              personalSkills: data.personalSkills.length > 0 ? data.personalSkills : [],
              resume: data.resume || "",
              profilePicture: data.profilePicture || "",
            }
          },
          { new: true }
        );

        console.log("jobApplicant: ", jobApplicant)

        if (!jobApplicant) {
          return res.status(404).json({ message: "Job applicant profile not found." });
        }

        if (data.email && data.email !== user.email) {
          await User.findByIdAndUpdate(user._id, {
            $set: { email: data.email },
          });
          jobApplicant.candidateEmail = data.email;
        }

        await jobApplicant.save();

        console.log("new job:", jobApplicant)

        return res.json({ message: "Job Applicant profile updated successfully" });

      }
    } catch (err) {
      console.error("Error handling user data:", err);
      res.status(400).json({ error: "Error handling user data", details: err.message });
    }
  });


  // apply for a job [todo: test: done]
  router.post("/jobs/:id/applications", jwtAuth, (req, res) => {
    const user = req.user;
    if (user.type != "applicant") {
      res.status(401).json({
        message: "You don't have permissions to apply for a job",
      });
      return;
    }
    const data = req.body;
    const jobId = req.params.id;

    // check whether applied previously
    // find job
    // check count of active applications < limit
    // check user had < 10 active applications && check if user is not having any accepted jobs (user id)
    // store the data in applications

    Application.findOne({
      userId: user._id,
      jobId: jobId,
      status: {
        $nin: ["deleted", "accepted", "cancelled"],
      },
    })
      .then((appliedApplication) => {
        // console.log(appliedApplication );
        if (appliedApplication !== null) {
          res.status(400).json({
            message: "You have already applied for this job",
          });
          return;
        }

        Job.findOne({ _id: jobId })
          .then((job) => {
            if (job === null) {
              res.status(404).json({
                message: "Job does not exist",
              });
              return;
            }
            Application.countDocuments({
              jobId: jobId,
              status: {
                $nin: ["rejected", "deleted", "cancelled", "finished"],
              },
            })
              .then((activeApplicationCount) => {
                if (activeApplicationCount < job.maxApplicants) {
                  Application.countDocuments({
                    userId: user._id,
                    status: {
                      $nin: ["rejected", "deleted", "cancelled", "finished"],
                    },
                  })
                    .then((myActiveApplicationCount) => {
                      if (myActiveApplicationCount < 10) {
                        Application.countDocuments({
                          userId: user._id,
                          status: "accepted",
                        }).then((acceptedJobs) => {
                          if (acceptedJobs === 0) {
                            const application = new Application({
                              userId: user._id,
                              recruiterId: job.userId,
                              jobId: job._id,
                              status: "applied",
                              sop: data.sop,
                            });
                            application
                              .save()
                              .then(() => {
                                res.json({
                                  message: "Job application successful",
                                });
                              })
                              .catch((err) => {
                                res.status(400).json(err);
                              });
                          } else {
                            res.status(400).json({
                              message:
                                "You already have an accepted job. Hence you cannot apply.",
                            });
                          }
                        });
                      } else {
                        res.status(400).json({
                          message:
                            "You have 10 active applications. Hence you cannot apply.",
                        });
                      }
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                } else {
                  res.status(400).json({
                    message: "Application limit reached",
                  });
                }
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.json(400).json(err);
      });
  });

  // recruiter gets applications for a particular job [pagination] [todo: test: done]
    router.get("/jobs/:id/applications", jwtAuth, (req, res) => {
    const user = req.user;
    const jobId = req.params.id;

    console.log('User:', user);  // Debugging line
    console.log('Job ID:', jobId);  // Debugging line

    // If the user is a recruiter, show all applicants for the job
    if (user.type === "recruiter") {
      let findParams = {
        jobId: jobId,
        recruiterId: user._id,
      };

      if (req.query.status) {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }

      Application.find(findParams)
        .collation({ locale: "en" })
        .sort({})
        .then((applications) => {
          res.json(applications);
        })
        .catch((err) => {
          res.status(400).json(err);
        });

    } else if (user.type === "applicant") {
      // If the user is a candidate, show only their application status for the job
      Application.findOne({
        jobId: jobId,
        userId: user._id,  // Check if the candidate applied to this job
      })
        .then((application) => {
          if (!application) {
            return res.status(404).json({ message: "You have not applied for this job." });
          }
          res.json({
            status: application.status, // This will be 'applied'
            jobId: application.jobId,
            userId: application.userId,
            applicationId: application._id,
            dateOfApplication: application.dateOfApplication,
            sop: application.sop, // You can also return the SOP
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "Invalid user type.",
      });
    }
  });


  // recruiter/applicant gets all his applications [pagination]
  router.get("/applications", jwtAuth, (req, res) => {
    const user = req.user;
  
    Application.aggregate([
      {
        $match: {
          $or: [
            { recruiterId: user._id },
            { userId: user._id },
          ],
        },
      },
      {
        $lookup: {
          from: "userauths",  // Collection name for user details
          localField: "userId", // Match the userId from Application to userauths
          foreignField: "_id", // Match the _id from userauths
          as: "userAuth", // Alias for the result of the lookup
        },
      },
      { 
        $unwind: { path: "$userAuth", preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: "jobapplicantinfos",  // Collection name for job applicant details
          localField: "userAuth.userDetails", // Match the userDetails field in userAuth
          foreignField: "_id", // Match the _id in jobapplicantinfos
          as: "jobApplicant", // Alias for the result of the lookup
        },
      },
      { 
        $unwind: { path: "$jobApplicant", preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: "jobs",  // Job collection to fetch job details
          localField: "jobId", // Match jobId in Application to _id in jobs
          foreignField: "_id", 
          as: "job",
        },
      },
      { 
        $unwind: { path: "$job", preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: "recruiterinfos",  // Collection for recruiter details
          localField: "recruiterId", // Match recruiterId in Application to userId in recruiterinfos
          foreignField: "userId", 
          as: "recruiter",
        },
      },
      { 
        $unwind: { path: "$recruiter", preserveNullAndEmptyArrays: true } 
      },
      {
        $project: {
          recruiterName: "$recruiter.name",  // Include recruiter name
          applicantName: { 
            $concat: ["$jobApplicant.firstName", " ", "$jobApplicant.lastName"] // Concatenate first and last name of applicant
          },
          applicantProfile: "$jobApplicant.profilePicture",  // Include profile photo of applicant
          job: 1,                     // Include job details
          dateOfApplication: 1,        // Include date of application
          status: 1                   // Include the status of the application
        },
      },
      {
        $sort: {
          dateOfApplication: -1,  // Sort by most recent application
        },
      },
    ])
      .then((applications) => {
        console.log("Aggregated Applications:", applications);
        res.json(applications);  // Send the aggregated results as a response
      })
      .catch((err) => {
        console.error("Aggregation Error:", err);
        res.status(400).json(err);  // Send the error if something goes wrong
      });
  });

  // update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
  router.put("/applications/:id", jwtAuth, (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const status = req.body.status;

    // "applied", // when a applicant is applied
    // "shortlisted", // when a applicant is shortlisted
    // "accepted", // when a applicant is accepted
    // "rejected", // when a applicant is rejected
    // "deleted", // when any job is deleted
    // "cancelled", // an application is cancelled by its author or when other application is accepted
    // "finished", // when job is over

    if (user.type === "recruiter") {
      if (status === "accepted") {
        // get job id from application
        // get job info for maxPositions count
        // count applications that are already accepted
        // compare and if condition is satisfied, then save

        Application.findOne({
          _id: id,
          recruiterId: user._id,
        })
          .then((application) => {
            if (application === null) {
              res.status(404).json({
                message: "Application not found",
              });
              return;
            }

            Job.findOne({
              _id: application.jobId,
              userId: user._id,
            }).then((job) => {
              if (job === null) {
                res.status(404).json({
                  message: "Job does not exist",
                });
                return;
              }

              Application.countDocuments({
                recruiterId: user._id,
                jobId: job._id,
                status: "accepted",
              }).then((activeApplicationCount) => {
                if (activeApplicationCount < job.maxPositions) {
                  // accepted
                  application.status = status;
                  application.dateOfJoining = req.body.dateOfJoining;
                  application
                    .save()
                    .then(() => {
                      Application.updateMany(
                        {
                          _id: {
                            $ne: application._id,
                          },
                          userId: application.userId,
                          status: {
                            $nin: [
                              "rejected",
                              "deleted",
                              "cancelled",
                              "accepted",
                              "finished",
                            ],
                          },
                        },
                        {
                          $set: {
                            status: "cancelled",
                          },
                        },
                        { multi: true }
                      )
                        .then(() => {
                          if (status === "accepted") {
                            Job.findOneAndUpdate(
                              {
                                _id: job._id,
                                userId: user._id,
                              },
                              {
                                $set: {
                                  acceptedCandidates: activeApplicationCount + 1,
                                },
                              }
                            )
                              .then(() => {
                                res.json({
                                  message: `Application ${status} successfully`,
                                });
                              })
                              .catch((err) => {
                                res.status(400).json(err);
                              });
                          } else {
                            res.json({
                              message: `Application ${status} successfully`,
                            });
                          }
                        })
                        .catch((err) => {
                          res.status(400).json(err);
                        });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                } else {
                  res.status(400).json({
                    message: "All positions for this job are already filled",
                  });
                }
              });
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        Application.findOneAndUpdate(
          {
            _id: id,
            recruiterId: user._id,
            status: {
              $nin: ["rejected", "deleted", "cancelled"],
            },
          },
          {
            $set: {
              status: status,
            },
          }
        )
          .then((application) => {
            if (application === null) {
              res.status(400).json({
                message: "Application status cannot be updated",
              });
              return;
            }
            if (status === "finished") {
              res.json({
                message: `Job ${status} successfully`,
              });
            } else {
              res.json({
                message: `Application ${status} successfully`,
              });
            }
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    } else {
      if (status === "cancelled") {
        // console.log(id);
        // console.log(user._id);
        Application.findOneAndUpdate(
          {
            _id: id,
            userId: user._id,
          },
          {
            $set: {
              status: status,
            },
          }
        )
          .then((tmp) => {
            // console.log(tmp);
            res.json({
              message: `Application ${status} successfully`,
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        res.status(401).json({
          message: "You don't have permissions to update job status",
        });
      }
    }
  });

  // get a list of final applicants for current job : recruiter
  // get a list of final applicants for all his jobs : recuiter
  router.get("/applicants", jwtAuth, async (req, res) => {
    const user = req.user;

    // Check if the user is a recruiter
    if (user.type !== "recruiter") {
      return res.status(400).json({
        message: "You are not allowed to access applicants list",
      });
    }

    try {
      let findParams = { recruiterId: user._id };

      // Filter by jobId if provided
      if (req.query.jobId) {
        try {
          findParams.jobId = new mongoose.Types.ObjectId(req.query.jobId);
        } catch (err) {
          return res.status(400).json({ message: "Invalid jobId format" });
        }
      }

      // Apply status filter if provided
      if (req.query.status) {
        if (Array.isArray(req.query.status)) {
          findParams.status = { $in: req.query.status };
        } else {
          findParams.status = req.query.status;
        }
      }

      // Sorting parameters
      let sortParams = {};
      if (req.query.asc) {
        sortParams[req.query.asc] = 1;
      }
      if (req.query.desc) {
        sortParams[req.query.desc] = -1;
      }
      if (!req.query.asc && !req.query.desc) {
        sortParams._id = 1; // Default sorting by ID
      }

      const applications = await Application.aggregate([
        // Lookup to join with userAuth collection
        {
          $lookup: {
            from: "userauths",  // Collection name for user details
            localField: "userId", // Field in Application to match
            foreignField: "_id", // Field in userauths to match
            as: "userAuth", // Alias for the result of the lookup
          },
        },
        { $unwind: { path: "$userAuth", preserveNullAndEmptyArrays: true } },

        // Lookup to join with jobapplicantinfos collection
        {
          $lookup: {
            from: "jobapplicantinfos",  // Collection name for job applicant details
            localField: "userAuth.userDetails", // Match field in userAuth
            foreignField: "_id", // Match field in jobapplicantinfos
            as: "jobApplicant", // Alias for the result
          },
        },
        { $unwind: { path: "$jobApplicant", preserveNullAndEmptyArrays: true } },

        // Lookup to join with jobs collection
        {
          $lookup: {
            from: "jobs",  // Collection name for job details
            localField: "jobId", // Field in Application to match
            foreignField: "_id", // Field in jobs collection to match
            as: "job", // Alias for the job details result
          },
        },
        { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },

        // Apply filters (jobId, status)
        { $match: findParams },

        // Sorting the results based on query params
        { $sort: sortParams },

        // Project the necessary fields to return in response
        {
          $project: {
            _id: 1,
            jobId: 1,
            userId: 1,
            recruiterId: 1,
            status: 1,
            dateOfApplication: 1,
            sop: 1,
            "jobApplicant.firstName": 1,
            "jobApplicant.candidateEmail": 1,
            "jobApplicant.mobile": 1,
            "jobApplicant.personalSkills": 1,
            "jobApplicant.profilePicture": 1,
            "jobApplicant.resume": 1,
          },
        },
      ]);

      // Log the result for debugging
      console.log("Applications Result:", applications);

      // If no applicants found, return an error
      if (!applications || applications.length === 0) {
        return res.status(404).json({ message: "No applicants found" });
      }

      // Respond with the aggregated applications data
      res.json(applications);
    } catch (err) {
      console.error("Error in Aggregation:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  // to add or update a rating [todo: test]
  router.put("/rating", jwtAuth, (req, res) => {
    const user = req.user;
    const data = req.body;
    if (user.type === "recruiter") {
      // can rate applicant
      Rating.findOne({
        senderId: user._id,
        receiverId: data.applicantId,
        category: "applicant",
      })
        .then((rating) => {
          if (rating === null) {
            // console.log("new rating");
            Application.countDocuments({
              userId: data.applicantId,
              recruiterId: user._id,
              status: {
                $in: ["accepted", "finished"],
              },
            })
              .then((acceptedApplicant) => {
                if (acceptedApplicant > 0) {
                  // add a new rating

                  rating = new Rating({
                    category: "applicant",
                    receiverId: data.applicantId,
                    senderId: user._id,
                    rating: data.rating,
                  });

                  rating
                    .save()
                    .then(() => {
                      // get the average of ratings
                      Rating.aggregate([
                        {
                          $match: {
                            receiverId: mongoose.Types.ObjectId(data.applicantId),
                            category: "applicant",
                          },
                        },
                        {
                          $group: {
                            _id: {},
                            average: { $avg: "$rating" },
                          },
                        },
                      ])
                        .then((result) => {
                          // update the user's rating
                          if (result === null) {
                            res.status(400).json({
                              message: "Error while calculating rating",
                            });
                            return;
                          }
                          const avg = result[0].average;

                          JobApplicant.findOneAndUpdate(
                            {
                              userId: data.applicantId,
                            },
                            {
                              $set: {
                                rating: avg,
                              },
                            }
                          )
                            .then((applicant) => {
                              if (applicant === null) {
                                res.status(400).json({
                                  message:
                                    "Error while updating applicant's average rating",
                                });
                                return;
                              }
                              res.json({
                                message: "Rating added successfully",
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        })
                        .catch((err) => {
                          res.status(400).json(err);
                        });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                } else {
                  // you cannot rate
                  res.status(400).json({
                    message:
                      "Applicant didn't worked under you. Hence you cannot give a rating.",
                  });
                }
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          } else {
            rating.rating = data.rating;
            rating
              .save()
              .then(() => {
                // get the average of ratings
                Rating.aggregate([
                  {
                    $match: {
                      receiverId: mongoose.Types.ObjectId(data.applicantId),
                      category: "applicant",
                    },
                  },
                  {
                    $group: {
                      _id: {},
                      average: { $avg: "$rating" },
                    },
                  },
                ])
                  .then((result) => {
                    // update the user's rating
                    if (result === null) {
                      res.status(400).json({
                        message: "Error while calculating rating",
                      });
                      return;
                    }
                    const avg = result[0].average;
                    JobApplicant.findOneAndUpdate(
                      {
                        userId: data.applicantId,
                      },
                      {
                        $set: {
                          rating: avg,
                        },
                      }
                    )
                      .then((applicant) => {
                        if (applicant === null) {
                          res.status(400).json({
                            message:
                              "Error while updating applicant's average rating",
                          });
                          return;
                        }
                        res.json({
                          message: "Rating updated successfully",
                        });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      // applicant can rate job
      Rating.findOne({
        senderId: user._id,
        receiverId: data.jobId,
        category: "job",
      })
        .then((rating) => {
          // console.log(user._id);
          // console.log(data.jobId);
          // console.log(rating);
          if (rating === null) {
            // console.log(rating);
            Application.countDocuments({
              userId: user._id,
              jobId: data.jobId,
              status: {
                $in: ["accepted", "finished"],
              },
            })
              .then((acceptedApplicant) => {
                if (acceptedApplicant > 0) {
                  // add a new rating

                  rating = new Rating({
                    category: "job",
                    receiverId: data.jobId,
                    senderId: user._id,
                    rating: data.rating,
                  });

                  rating
                    .save()
                    .then(() => {
                      // get the average of ratings
                      Rating.aggregate([
                        {
                          $match: {
                            receiverId: mongoose.Types.ObjectId(data.jobId),
                            category: "job",
                          },
                        },
                        {
                          $group: {
                            _id: {},
                            average: { $avg: "$rating" },
                          },
                        },
                      ])
                        .then((result) => {
                          if (result === null) {
                            res.status(400).json({
                              message: "Error while calculating rating",
                            });
                            return;
                          }
                          const avg = result[0].average;
                          Job.findOneAndUpdate(
                            {
                              _id: data.jobId,
                            },
                            {
                              $set: {
                                rating: avg,
                              },
                            }
                          )
                            .then((foundJob) => {
                              if (foundJob === null) {
                                res.status(400).json({
                                  message:
                                    "Error while updating job's average rating",
                                });
                                return;
                              }
                              res.json({
                                message: "Rating added successfully",
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        })
                        .catch((err) => {
                          res.status(400).json(err);
                        });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                } else {
                  // you cannot rate
                  res.status(400).json({
                    message:
                      "You haven't worked for this job. Hence you cannot give a rating.",
                  });
                }
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          } else {
            // update the rating
            rating.rating = data.rating;
            rating
              .save()
              .then(() => {
                // get the average of ratings
                Rating.aggregate([
                  {
                    $match: {
                      receiverId: mongoose.Types.ObjectId(data.jobId),
                      category: "job",
                    },
                  },
                  {
                    $group: {
                      _id: {},
                      average: { $avg: "$rating" },
                    },
                  },
                ])
                  .then((result) => {
                    if (result === null) {
                      res.status(400).json({
                        message: "Error while calculating rating",
                      });
                      return;
                    }
                    const avg = result[0].average;
                    // console.log(avg);

                    Job.findOneAndUpdate(
                      {
                        _id: data.jobId,
                      },
                      {
                        $set: {
                          rating: avg,
                        },
                      }
                    )
                      .then((foundJob) => {
                        if (foundJob === null) {
                          res.status(400).json({
                            message: "Error while updating job's average rating",
                          });
                          return;
                        }
                        res.json({
                          message: "Rating added successfully",
                        });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  });

  // get personal rating
  router.get("/rating", jwtAuth, (req, res) => {
    const user = req.user;
    Rating.findOne({
      senderId: user._id,
      receiverId: req.query.id,
      category: user.type === "recruiter" ? "applicant" : "job",
    }).then((rating) => {
      if (rating === null) {
        res.json({
          rating: -1,
        });
        return;
      }
      res.json({
        rating: rating.rating,
      });
    });
  });

  module.exports = router;
