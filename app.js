const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const User = require('./models/UserSchema')
const Comment = require('./models/CommentSchema')

mongoose.connect('mongodb://localhost:27017/CommentApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("MONGO CONNECTION IS OPEN!!")
})
.catch(err =>{
    console.log("OH ON MONGO CONNECTION  ERROR!!")
    console.log(err)
})

app.set('view engine','ejs')
app.set('views',path.join(__dirname
    ,'views'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser('SecretStringForCookies'))
app.use(session({
    secret:'SecretStringForSession',
    cookie:{maxAge:60000},
    resave:true,
    saveUninitialized:true
}))
app.use(flash())

app.get('/',(req,res)=>{
    res.render('home')

})
app.get('/signin',(req,res)=>{
    const message = req.flash('msg')
    const password = req.flash('pass')
    res.render('Signin',{message,password})
})

app.get('/signup',(req,res)=>{
    const message = req.flash('msg')
    res.render('Signup',{message})
})
app.get('/forgotpass',(req,res)=>{
    const message = req.flash('invalid')
    res.render('forgotpass',{message})
})
app.get('/comment/:id/filter',async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    const comments = await Comment.find({email:user.email})
    res.render('comment',{comments,user})
})
app.get('/comment/:id',async(req,res)=>{
    const {id} =  req.params
    const user = await User.findById(id)
    const comments =  await Comment.find({})
    res.render('comment',{comments,user})

})

app.post('/signin',async(req,res)=>{
    
    try{
        const{email,password} = req.body
        const user =await User.find({email:email})
        const result = user[0]
        if(result.email==email&&result.password==password){
            res.redirect(`/comment/${result._id}`)
        }    
    }
    catch{
        req.flash('msg','Email or Password is incorrect')
        res.redirect('/signin')
    }
})

app.post('/signup',async(req,res)=>{
    const {email,password,secret} = req.body
    
    try{
            const users = new User({
                email:email,
                password:password,
                secret:secret
            })
            await users.save()
            res.redirect('/signin')
        }
    catch{
        req.flash('msg','Email you entered is already exist')
        res.redirect('/signup')
    }
   
})

app.post('/comment/:id',async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id)
        const comments = new Comment({
            email:user.email,
            comment:req.body.comment
        })
        await comments.save()
        res.redirect(`/comment/${id}`)
    
})

app.post('/forgotpass',async(req,res)=>{
    try{
        const {email,secret} = req.body
        const user = await User.findOne({email:email})
        if(user.email == email && user.secret==secret){
            const password = user.password
            
            req.flash('pass',password)
            res.redirect('/signin')
        }
    }
    
    catch{
        req.flash('invalid','Data you enter is invalid')
        res.redirect('/forgotpass')
    }
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})