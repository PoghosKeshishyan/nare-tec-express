const express = require('express');
const router = express.Router();
const { all, child, byParentId, add, edit, remove } = require('../controllers/children');

router.get('/', all);
router.get('/by_parent_id', byParentId);
router.get('/:id', child);
router.post('/add', add);
router.put('/edit/:id', edit);
router.delete('/remove/:id', remove);

module.exports = router;
