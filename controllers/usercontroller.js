const express = require ('express');
const User = require('../db').import('../models/user');
const sequelize= require('../db');
const router= express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateSession= require('../middleware/validateSession');

//SignUP

router.post('/signup', (req,res) =>{
    User.create({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        userName: req.body.user.userName,
        password: req.body.user.password
        
    })
    .then(
        function signupSuccess (user){
            res.json({
                user: user,
                message: "Sucessfully Signed Up",
                // sessionToken: token,
            })
        }
    )
    .catch(err => res.status(500).json({error: err}))
})

//SignIN
router.post('/signin', function(req, res){
    User.findOne({
        where:{
            email: req.body.user.email,
            userName: req.body.user.userName
        }
    })
    .then(
        function signinSuccess (user){
            if (user) {

                res.status(200).json({
                    user: user,
                    message: "Sucessfully Signed In",
                    // sessionToken: token,
                })
            }else{
                res.status(500).json({ error: 'User does not exist.'})
            }
        }
    )
    .catch(err => res.status(500).json({error: err}))
})

//UserCreate

router.post('/create', function(req, res){
    User.create({
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        userName: req.body.user.userName,
        password: req.body.user.password
    })
    .then(
        function createSuccess (user){
            res.json({
                user: user,
                message: "Sucessfully Created A New User",
                // sessionToken: token,
            })
        }
    )
    .catch(err => res.status(500).json({error: err}))

})

module.exports = router;
