const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'please provide the name'],
        minlength:3,
        maxlength: 50
    },
    email:{
        type:String,
        required: [true, 'please provide the email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'],
        unique: true
    },
    password:{
        type:String,
        required: [true, 'please provide the password'],
        minlength:6
    }
});
UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME});
}
UserSchema.methods.comparePassword = async function(password){
    const isMatch = await bcryptjs.compare(password, this.password);
    return isMatch;
}
UserSchema.pre('save', async function(){
    const salt = await bcryptjs.genSaltSync(10);
    this.password = await bcryptjs.hash(this.password, salt);
});
module.exports = mongoose.model('User',UserSchema);