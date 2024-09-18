const mongoose = require('mongoose');
const User = require('./User');

const JobsSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true, 'Please provide company name'],
        maxlength:100
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: [true, 'Please provide the user']
    },
    position:{
        type: String,
        required: [true, 'Please provide the position'],
        maxlength:100
    },
    status:{
        type: String,
        enum: ['interview', ' declined', 'pending'],
        default: 'pending',
        required: [true, 'Please provide company name'],
        maxlength:100
    },
}, {timestamps:true});

module.exports = mongoose.model('Jobs', JobsSchema);