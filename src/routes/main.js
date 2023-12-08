const express = require('express')
const mongoose = require('mongoose')
const routes = express.Router()

const blogM = require('../model/blog');

routes.get('/registered' , async(req,res)=>{
    const blogdata = await blogM.find();
    res.render('registered',{blogdata:blogdata})
})

module.exports = routes;