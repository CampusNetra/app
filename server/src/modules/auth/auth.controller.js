const authService = require('../admin/auth.service');

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const studentLogin = async (req, res) => {
  try {
    const result = await authService.studentLogin(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const studentRegisterCheck = async (req, res) => {
  try {
    const result = await authService.studentRegisterCheck(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const studentSetPassword = async (req, res) => {
  try {
    const result = await authService.studentSetPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  studentLogin,
  studentRegisterCheck,
  studentSetPassword
};
