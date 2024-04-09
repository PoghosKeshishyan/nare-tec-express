const express = require('express');
const router = express.Router();
const { all, year, add, edit, remove } = require('../controllers/years');

router.get('/', all);
router.get('/:id', year);
router.post('/add', add);
router.put('/edit/:id', edit);
router.delete('/remove/:id', remove);

module.exports = router;
