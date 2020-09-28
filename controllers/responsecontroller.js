const express = require('express');
const router = express.Router();
const Response = require('../db').import('../models/response');
const validateSession= require('../middleware/validateSession');

//ResponseCreate

router.post('/newResponse', validateSession,(req, res) => {
    Response.create({
        userId: req.user.id,
        description: req.body.response.description

    })
    .then((response) => res.status(200).json({message: "New Response has been create"}))
    .catch(err => res.status(500).json({error: err}))
});

//EditResponse
router.put('/:id', validateSession, (req,res) => {
    if(!req.errors && (req.user.admin)){
        Response.update({where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Response.update({where: {userId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Response.update(req.body.response)
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }
})

//DeleteResponse
router.delete('/:id', validateSession, (req,res) => {
    if(!req.errors && (req.user.admin)){
        Response.destroy({where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Response.destroy({where: {userId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }
})

//GetAllResponses

router.get('/allResponses', (req,res) => {
    Response.findAll()
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json({error: err}))
    
});

//GetResponseByID
router.get('/:id', validateSession,(req,res) => {
    Response.findOne({where: {id: req.params.id}})
    .then(response => res.status(200).json(response))
    .catch(err => status(500).json(err));
})

//GetMyResponse
router.get('/mine',validateSession,(req, res) => {
    Response.findOne({where: {usrId: req.user.id}})
    .then(response => res.status(200).json(response))
    .catch(err => res.status(500).json(err));
});

module.exports = router;