const express = require('express');
const router = express.Router();
const { all, month, add, edit, remove } = require('../controllers/months');

router.get('/', all);
router.get('/:id', month);
router.post('/add', add);
router.put('/edit/:id', edit);
router.delete('/remove/:id', remove);

module.exports = router;
