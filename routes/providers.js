const express = require('express');
const router = express.Router();
const { all, add, edit, remove } = require("../controllers/providers");

router.get("/", all);
router.post("/add", add);
router.put("/edit/:id", edit);
router.delete('/remove/:id', remove);

module.exports = router;
