const authService = require('../modules/admin/auth.service');

module.exports = {
  signup: authService.signup,
  login: authService.login,
  studentLogin: authService.studentLogin
};
