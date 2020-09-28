const express = require('express');
const router = express.Router();
const Post = require('../db').import('../models/post');
const validateSession= require('../middleware/validateSession');

//PostCreate

router.post('/newPost', validateSession,(req, res) => {
    Post.create({
        ownerId: req.user.id,
        title: req.body.post.title,
        description: req.body.post.description

    })
    .then((post) => res.status(200).json({message: "New Post has been create",post}))
    .catch(err => res.status(500).json({error: err}))
});

//EditPost
router.put('/:id', validateSession, (req,res) => {
    if(!req.errors && (req.user.admin)){
        Post.update(req.body.post,{where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Post.update(req.body.post,{where: {ownerId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Post.update(req.body.post)
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }
})

//DeletePost
router.delete('/:id', validateSession, (req,res) => {
    if(!req.errors && (req.user.admin)){
        Post.destroy({where: {id: req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else if (!req.errors){
        Post.destroy({where: {ownerId: req.user.id, id:req.params.id}})
        .then(data =>res.status(200).json(data))
        .catch(err => res.status(500).json(err));
    }
    else{
        res.status(500).json(req.errors);
    }
})

//GetAllPosts

router.get('/', (req,res) => {
    Post.findAll()
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json({error: err}))
    
});

//GetPostByID
router.get('/:id', validateSession,(req,res) => {
    Post.findOne({where: {id: req.params.id}})
    .then(post => res.status(200).json(post))
    .catch(err => status(500).json(err));
})

//GetMyPost
router.get('/mine',validateSession,(req, res) => {
    Post.findOne({where: {usrId: req.user.id}})
    .then(post => res.status(200).json(post))
    .catch(err => res.status(500).json(err));
});

module.exports = router;