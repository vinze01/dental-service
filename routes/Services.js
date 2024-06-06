const express = require('express')
const router = express.Router();
const {Services} = require('../models')

router.get('/', async (req, res) => {
    let result = await Services.findAll()
    res.json(result);
});

router.post('/', async (req, res) => {
    const post = req.body;
    await Services.create(post);
    res.json(post);
});

module.exports = router