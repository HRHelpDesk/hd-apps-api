const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const {PORT = 3001} = process.env;
const axios = require('axios');
const { uuid } = require('uuidv4');
const nodemailer = require('nodemailer');
const { Configuration, OpenAIApi } = require("openai");
const { JobPostEmail } = require('./email-templates/job-post-email');
require('dotenv').config()
///Middleware
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
  res.header("Access-Control-Allow-Origin", 'https://helpdeskforhr.com/'); 
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

/// End Middleware


  app.post('/create-data',(req,res)=>{
    const {request} = req.body;

    async function runPrompt () {
      const completion = await openai.createCompletion({
        "model": "text-davinci-003",
        "prompt": request,
        "temperature": 0.6,
        "max_tokens": 1024,
        "stream": false
      });

      const startIndex = completion.data.choices[0].text.indexOf("{");
      const result = completion.data.choices[0].text.substring(startIndex);

      res.send(result)
      console.log(completion.data.choices[0].text)
      }
    try{
      runPrompt()
    


    } 
    catch{
      res.send('error')
    }
    })


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
        res.send({
          message:'Complete!',
          
          
        })

        let htmlContent = object.categories.map((i)=>{
          return (` <p><b>${i.category}</b></p>
          ${i.questions.map(o=>{
            return (
              `<li>${o}</li>`
            )
          })}
          
          `)});

        var mailOptions = {
          from: 'support@helpdeskforhr.com',
          to: 'support@helpdeskforhr.com',
          subject: `${email} created an Interview Questionnaire for ${object.job}.`,
          html:`<div>
          <h3>${object.job}</h3>
          ${htmlContent}
          <div>`
        };
     
        transport.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
 
        
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

        let htmlContent = object.categories.map((i)=>{
          return (` <p><b>${i.category}</b></p>
          ${i.questions.map(o=>{
            return (
              `<li>${o}</li>`
            )
          })}
          
          `)});

          var mailOptions = {
            from: 'support@helpdeskforhr.com',
            to: 'support@helpdeskforhr.com',
            subject: `${email} created an Interview Questionnaire for ${object.job}.`,
            html:`<div>
            <h3>${object.job}</h3>
            ${htmlContent}
            <div>`
          };
        
        transport.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

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

    // Add
app.post('/add-iq',(req,res)=>{
  const {email, object} = req.body;
  
  Profile.findOneAndUpdate({email:email},{$push: {savedQuestionairres:object}},{'new': true, 'safe': true, 'upsert': true}, (err,data)=>{

    if(err){
      res.send('error')
    } else {
      res.send('updated')
    }
  })
  })


      // Change Name
app.post('/change-iq-name',(req,res)=>{
  const {email, id,name} = req.body;
  
  Profile.findOneAndUpdate({email:email},{$set: {"savedQuestionairres.$[el].job": name}},{arrayFilters: [{ "el.id": id}],'new': true, 'safe': true, 'upsert': true}, (err,data)=>{

    if(err){
      res.send('error')
    } else {
      res.send('updated')
    }
  })
  })



  // JOB POST GENIE

app.post('/save-job-post', (req,res)=>{
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
          savedQuestionairres:[],
          jobPostings:[object],
          jobDescriptions:[],
          employeeHandbooks:[],
          savedPolicies:[]
        
  
       
      })
      newUser.save(function (err) {
        if (err) {
          res.send('error')
        } else{
          console.log('saved!')
          res.send({
            message:'Complete!',
            
            
          })
  
  
          var mailOptions = {
            from: 'support@helpdeskforhr.com',
            to: 'support@helpdeskforhr.com',
            subject: `${email} created an Job Post for ${object.jobPostData.jobTitle}.`,
            html:`<div>
           
            ${JobPostEmail(object)}
            <div>`
          };
       
          transport.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
   
          
        }
        // saved!
        })
   
  
    } else {
      Profile.findOneAndUpdate({email:email},{$push:{jobPostings:object}}, {'new': true, 'safe': true, 'upsert': true},(err,data)=>{
        if(err){
          res.send('error')
          console.log(err)
        } else {
    
          res.send({
            message:'Complete!',
            
          })
  
  
            var mailOptions = {
              from: 'support@helpdeskforhr.com',
              to: 'support@helpdeskforhr.com',
              subject: `${email} created an Job Post for ${object.jobPostData.jobTitle}.`,
              html:`<div>
              ${JobPostEmail(option)}
              <div>`
            };
          
          transport.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
  
        }
      })
    }
  }
    })
    
  })


  // Update
app.post('/update-jp',(req,res)=>{
  const {email, object} = req.body;
  console.log(object)
  Profile.findOneAndUpdate({email:email},{$set: {"jobPostings.$[el].jobPostData": object.jobPostData}},{arrayFilters: [{ "el.id": object.id}],'new': true, 'safe': true, 'upsert': true}, (err,data)=>{

    if(err){
      res.send('error')
    } else {
      res.send('updated')
    }
  })
  })

    // Duplicate
app.post('/add-jp',(req,res)=>{
  const {email, object} = req.body;
  
  Profile.findOneAndUpdate({email:email},{$push: {jobPostings:object}},{'new': true, 'safe': true, 'upsert': true}, (err,data)=>{

    if(err){
      res.send('error')
    } else {
      res.send('updated')
    }
  })
  })

  //Change Name

  app.post('/change-jp-name',(req,res)=>{
    const {email, id,name} = req.body;
    
    Profile.findOneAndUpdate({email:email},{$set: {"jobPostings.$[el].jobPostData.jobTitle": name}},{arrayFilters: [{ "el.id": id}],'new': true, 'safe': true, 'upsert': true}, (err,data)=>{
  
      if(err){
        res.send('error')
      } else {
        res.send('updated')
      }
    })
    })

      // Delete
app.post('/delete-jp',(req,res)=>{
  const {email, iqId} = req.body;
  
  Profile.findOneAndUpdate({email:email},{$pull: {jobPostings:{id: iqId}}},{'new': true, 'safe': true, 'upsert': true}, (err,data)=>{

    if(err){
      res.send('error')
    } else {
      res.send('updated')
    }
  })
  })
  

  // END Job Post Genie





  //Listener
  app.listen(PORT, () => console.log(`API is running on http://localhost:${PORT}/`));