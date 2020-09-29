const express = require('express');
const router = express.Router();
const Profile = require('../db').import('../models/profile');
const validateSession= require('../middleware/validateSession');

//ProfileCreate

router.post('/newProfile', validateSession,(req, res) => {
    Profile.create({
        userId: req.user.id,
        address: req.body.profile.address,
        about: req.body.profile.about

    })
    .then((profile) => res.status(200).json( {message: "New Profile has been create", profile}))
    .catch(err => res.status(500).json({error: err}))
});

//EditProfile
router.put('/:id', validateSession, (req,res) => {
    if(!req.errors && (req.user.admin)){
        Profile.update(req.body.profile,{where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Profile.update(req.body.profile,{where: {userId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Profile.update(req.body.profile)
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }
})

//DeleteProfile
router.delete('/:id', validateSession, (req,res) => {
    if(!req.errors && (req.user.admin)){
        Profile.destroy({where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Profile.destroy({where: {userId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }
})


router.get('/:id', validateSession,(req,res) => {
    Profile.findOne({where: {id: req.params.id}, include: "posts"})
    .then(profile => res.status(200).json(profile))
    .catch(err => status(500).json(err));
})

/*
// GetAllProfiles

router.get('/', (req,res) => {
    Profile.findAll()
    .then(profile => res.status(200).json(profile))
    .catch(err => res.status(500).json({error: err}))
    
});

//GetProfileByID
router.get('/:id', validateSession,(req,res) => {
    Profile.findOne({where: {id: req.params.id}})
    .then(profile => res.status(200).json(profile))
    .catch(err => status(500).json(err));
})

//GetMyProfile-- currently not working 
router.get('/mine',validateSession,(req, res) => {
    Profile.findOne({where: {usrId: req.user.id}})
    .then(profile => res.status(200).json(profile))
    .catch(err => res.status(500).json(err));
});

*/
module.exports = router;