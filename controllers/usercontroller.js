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
        password: bcrypt.hashSync(req.body.user.password,10),
        admin: req.body.user.admin
        
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
        firstName:req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        userName: req.body.user.userName,
        password: bcrypt.hashSync(req.body.user.password,10),
        admin: req.body.user.admin 
    })
    .then(
        function adminSuccess(user){
            // console.log(`user: ${user.admin}`)
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

// //GetUserName
// router.get('/userName', validateSession,(req, res) => {
//     User.findOne({
//         where:{userName: req.body.user.userName}
//     })
//     .then(user => res.status(200).json(user))
//     .catch(err => res.status(500).json(err));
// })

//GetByID
// router.get('/:id', validateSession,(req, res)
router.get('/:id', validateSession,(req, res) => {
    User.findOne({where: {id: req.params.id}, include:["profile", "posts", "responses"]})
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
     

})

//GetAll
router.get('/',validateSession,(req, res) => {
    User.findAll()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
})

//EditUser

router.put('/editUser/:id', validateSession,(req,res) =>{
    if(!req.errors && (req.user.admin)){
        User.update(req.body.user,{where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        User.update({where: {ownerId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        User.update(req.body.user)
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }

})

//DeleteUser
router.delete('/deleteUser/:id',validateSession,(req, res) => {
    if(!req.errors && (req.user.admin)){
        User.destroy({where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        User.destroy({where: {ownerId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }
})




module.exports = router;
