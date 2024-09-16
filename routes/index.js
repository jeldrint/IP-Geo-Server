const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken')

require('dotenv').config();


router.get('/', async(req,res)=> {
    res.send('Welcome to IP GEO API!')
})

router.post('/api', async(req, res, next)=> {
    console.log(req.body)
    passport.authenticate('local', (err,authUser) => {
        if(err){
            console.log('internal error ', err)
            return next(err);
        }
        if(!authUser){
            console.log('auth user failed');    
            return res.json({
                status: 'log in failed'
            })
        }else{
            req.logIn(authUser, (err)=> {
                if(err){
                    return res.json(err)
                }else{
                    jwt.sign({authUser}, process.env.SECRET, (err, token)=>{
                        if(err){
                            return res.json({
                                error: err,
                            })
                        }else{
                            return res.json({
                                status: 'logged in',
                                message: 'Logged in successfully',
                                authUser,
                                token
                            })
                        }
                    })
                }
            })
        }
    })(req,res)
})

module.exports = router;