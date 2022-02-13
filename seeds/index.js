const mongoose = require('mongoose')
const User = require('../models/UserSchema')
const Comment = require('../models/CommentSchema')

mongoose.connect('mongodb://localhost:27017/CommentApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("MONGO CONNECTION IS OPEN!!")
})
.catch(err =>{
    console.log("OH ON MONGO CONNECTION  ERROR!!")
    console.log(err)
})


const seedDB = async()=>{
    const comments = new Comment({
        email:'hemanththethan@gmail.com',
    comment:'tommorow will be wonderful day!'
    })
    await comments.save()

}
seedDB().then(()=>{
    mongoose.connection.close()
})