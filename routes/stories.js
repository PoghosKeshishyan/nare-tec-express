const express = require('express');
const router = express.Router();
const { all, byYear, add, edit, remove } = require('../controllers/stories');

router.get('/', all);
router.get('/:year', byYear);
router.post('/add', add);
router.put('/edit/:id', edit);
router.delete('/remove/:id', remove);

module.exports = router;
