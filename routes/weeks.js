const express = require('express');
const router = express.Router();
const { all, week, add, edit, remove } = require('../controllers/weeks'); 

router.get('/', all);
router.get('/:id', week);
router.post('/add', add);
router.put('/edit/:id', edit);
router.delete('/remove/:id', remove);

module.exports = router;
