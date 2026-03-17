const express = require('express');
const router = express.Router();
const termsController = require('./terms.controller');

router.get('/', termsController.getTerms);
router.post('/', termsController.addTerm);
router.patch('/:id/activate', termsController.updateActiveTerm);

module.exports = router;
