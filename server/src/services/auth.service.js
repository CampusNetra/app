const authService = require('../modules/admin/auth.service');

module.exports = {
  signup: authService.signup,
  login: authService.login,
  studentLogin: authService.studentLogin,
  studentRegisterCheck: authService.studentRegisterCheck,
  studentSetPassword: authService.studentSetPassword,
  facultyLogin: authService.facultyLogin,
  facultyRegisterCheck: authService.facultyRegisterCheck,
  facultySetPassword: authService.facultySetPassword
};
