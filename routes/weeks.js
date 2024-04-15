const express = require('express');
const router = express.Router();
const { weekByChildId, weekByParentId, edit } = require('../controllers/weeks'); 

router.get('/child/:child_id', weekByChildId);
router.get('/parent/:parent_id', weekByParentId);
router.put('/edit/:id', edit);

module.exports = router;
