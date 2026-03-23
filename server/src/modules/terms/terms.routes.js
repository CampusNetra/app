const express = require('express');
const router = express.Router();
const termsController = require('./terms.controller');

router.get('/', termsController.getTerms);
router.post('/', termsController.addTerm);
router.put('/:id', termsController.updateTerm);
router.delete('/:id', termsController.deleteTerm);
router.patch('/:id/activate', termsController.updateActiveTerm);

module.exports = router;
