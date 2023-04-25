const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const {PORT = 3001} = process.env;
const axios = require('axios');
const { uuid } = require('uuidv4');
const nodemailer = require('nodemailer');
///Middleware
let transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'Support@helpdeskforhr.com',
    pass: 'gvrmathnjbachljs'
  }
});

mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://sfgsds5fg4gs11ATX:yQUjBWMJRM8sjqR6@cluster0.x8dmtuj.mongodb.net/HD-Apps', {useNewUrlParser: true, useUnifiedTopology: true})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'https://app.employeetrainingtoolkit.com'); 
  res.header("Access-Control-Allow-Origin", '*'); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const user = new mongoose.Schema({
    id: String,
    email:String,
    savedQuestionairres:Array,
    jobPostings:Array,
    jobDescriptions:Array,
    employeeHandbooks:Array,
    savedPolicies:Array
});


const Profile = mongoose.model('user', user);
app.use(express.json());

app.get('/',(req,res)=>{
res.send('Server is awake!')
})

app.post('/get-data',(req,res)=>{
  const email = req.body.email;

  Profile.find({email:email},(err,data)=>{
    if(err){
      res.send('error')
    } else {
      res.send(data)
    }
  })
  })

//Interview Question Writer

app.post('/save-interview-questions', (req,res)=>{
const {email, object} = req.body;
console.log(email);
console.log(object) 
Profile.find({email:email}, (err,data)=>{
  if(err){
    res.send('error')
  } else {
    if(data.length === 0){
      let newUser = new Profile({
        id: uuid(),
        email:email,
        savedQuestionairres:[object],
        jobPostings:[],
        jobDescriptions:[],
        employeeHandbooks:[],
        savedPolicies:[]
      

     
    })
    newUser.save(function (err) {
      if (err) {
        res.send('error')
      } else{
        console.log('saved!')
 
     
       
 
        
      }
      // saved!
      })
 

  } else {
    Profile.findOneAndUpdate({email:email},{$push:{savedQuestionairres:object}}, {'new': true, 'safe': true, 'upsert': true},(err,data)=>{
      if(err){
        res.send('error')
        console.log(err)
      } else {
  
        res.send({
          message:'Complete!',
          
        })
      }
    })
  }
}
  })
  
})

// Update
app.post('/update-iq',(req,res)=>{
  const {email, object} = req.body;
  console.log(object)
  Profile.findOneAndUpdate({email:email},{$set: {"savedQuestionairres.$[el].categories": object.categories}},{arrayFilters: [{ "el.id": object.id}],'new': true, 'safe': true, 'upsert': true}, (err,data)=>{

    if(err){
      res.send('error')
    } else {
      res.send('updated')
    }
  })
  })

  // Delete
app.post('/delete-iq',(req,res)=>{
  const {email, iqId} = req.body;
  
  Profile.findOneAndUpdate({email:email},{$pull: {savedQuestionairres:{id: iqId}}},{'new': true, 'safe': true, 'upsert': true}, (err,data)=>{

    if(err){
      res.send('error')
    } else {
      res.send('updated')
    }
  })
  })





  //Listener
  app.listen(PORT, () => console.log(`API is running on http://localhost:${PORT}/`));