const { StatusCodes } = require("http-status-codes");
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async function (req, res) {
    const user = await User.create({ ...req.body });

    console.log(user.createJWT());
    res.status(StatusCodes.CREATED).json({token:user.createJWT(),user:{name:user.name}});
}

const login = async function (req, res) {
    const { email, password } = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({email});
    const passwordMatches = await user.comparePassword(password);
    if(!user || !passwordMatches){
        throw new UnauthenticatedError('Invalid credentials');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name}, token});
}

module.exports = {
    login,
    register
}