const express = require('express');
const router = express.Router();


router.get('/', async(req,res)=> {
    res.send('Welcome to IP GEO API!')
})

//router.get('/api')

module.exports = router;