const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.redirect("/students/list");
});

module.exports = router;
