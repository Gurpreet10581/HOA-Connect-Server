const express = require ('express');
const User = require('../db').import('../models/user');
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
        password: bcrypt.hashSync(req.body.user.password,10)
        
    })
    .then(
        function signupSuccess (user){
            console.log(`admin? ${user.admin}`)
            let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn:'1d'})
            res.json({
                user: user,
                message: "Sucessfully Signed Up",
                sessionToken: token,
            })
        }
    )
    .catch(err => res.status(500).json({error: err}))
})

//SignIN
router.post('/signin', (req, res) =>{
    User.findOne({
        where:{
            email: req.body.user.email
            
        }
    })
    .then(
        signinSuccess =  (user) =>{
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, (err,matches) =>{
                    if (matches){

                        let token = jwt.sign({id:user.id, email:user.email}, process.env.JWT_SECRET, {expiresIn:'1d'})
                        
                        res.status(200).json({
                            user: user,
                            message: "Sucessfully Signed In",
                            sessionToken: token
                        })
                    }else{
                        res.status(502).send({message: "Login Failed"})
                    }
                })
            }else{
                res.status(500).json({ error: 'User does not exist.'})
            }
        },err => res.status(501).send({error: 'Failed to process'})
    )
    // .catch(err => res.status(500).json({error: err}))
});

//Admin SignUP

router.post('/adminsignup', (req,res) => {
    User.create({
        firstName:req.body.user.userName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        userName: req.body.user.userName,
        password: bcrypt.hashSync(req.body.user.password,10),
        admin: req.body.user.admin || "User"
    })
    .then(
        function adminSuccess(user){
            console.log(`user: ${user.admin}`)
            let token= jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
            res.status(200).json({
                user: user,
                message: 'Created A New Admin',
                sessionToken: token,
            })
        }
    )
    .catch((err) => res.status(500).json({error: err}));
})

//GetUserName
router.get('/userName', validateSession,(req, res) => {
    User.findOne({
        where:{userName: req.body.user.userName}
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
})

//GetByID
router.get('/:id', validateSession,(req, res) => {
    User.findOne({where: {id: req.params.id}})
    .then(user => res.status(200).json(user))
    .catch(err => status(500).json(err));
     

})

//GetAll
router.get('/',validateSession,(req, res) => {
    User.findAll()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
})

//EditUser

router.put('/updateMemeber/:id', validateSession,(req,res) =>{
    let data ={
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        userName: req.body.user.userName
    }
    User.update(data,{
        where: {
            id: req.params.id
        }
    })
    .then(user => res.status(200).json("Successfully Updated", user))
    .catch(err => res.status(500).json(err));

})

//DeleteUser
router.delete('/deleteUser/:id',validateSession,(req, res) => {
    let id = req.params.id;
    User.destroy({
        where:{id: id}
    })
    .then(user => res.status(200).json("Successfully deleted", user))
    .catch(err => res.status(500).json(err));
})




module.exports = router;
