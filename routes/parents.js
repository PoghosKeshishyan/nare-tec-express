const express = require('express');
const router = express.Router();
const { all, parent, add, edit, remove } = require('../controllers/parents');

router.get('/', all);
router.get('/:id', parent);
router.post('/add', add);
router.put('/edit/:id', edit);
router.delete('/remove/:id', remove);

module.exports = router;
