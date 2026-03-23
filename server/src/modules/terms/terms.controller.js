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

const updateTerm = async (req, res) => {
  try {
    const term = await termsService.updateTerm(req.params.id, req.body);
    res.json(term);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTerm = async (req, res) => {
  try {
    await termsService.deleteTerm(req.params.id);
    res.json({ message: 'Term deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Term not found' ? 404 : 400).json({ error: error.message });
  }
};

module.exports = {
  getTerms,
  addTerm,
  updateActiveTerm,
  updateTerm,
  deleteTerm
};
