export const server = "http://localhost:4444";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  forgotpassword: `${server}/auth/forgot-password`,
  resetpassword: `${server}/auth/reset-password`,
  uploadResume: `${server}/upload/resume`,
  uploadprofilePicture: `${server}/upload/profilePicture`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
};

export default apiList;
