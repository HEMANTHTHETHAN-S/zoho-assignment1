const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    secret:{type:String,required:true}
})

module.exports = mongoose.model('User',UserSchema)