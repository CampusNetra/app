const termsService = require('../../services/terms.service');

const getTerms = async (req, res) => {
  try {
    const terms = await termsService.getAllTerms();
    res.json(terms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addTerm = async (req, res) => {
  try {
    const term = await termsService.createTerm(req.body);
    res.status(201).json(term);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateActiveTerm = async (req, res) => {
  try {
    const result = await termsService.setActiveTerm(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTerms,
  addTerm,
  updateActiveTerm
};
