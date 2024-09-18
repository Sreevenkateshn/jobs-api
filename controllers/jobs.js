const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');;
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async function (req, res) {
    const userId = req.user.userId;
    const jobs = await Job.find({ createdBy: userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

const getJob = async function (req, res) {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.find({ _id: jobId, createdBy: userId });
    res.status(StatusCodes.OK).json(job);
}
const createJob = async function (req, res) {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(job);
}
const updateJob = async function (req, res) {
    const { user: { userId }, params: { id: jobId }, body : { company, position} } = req;
    if(company === '' || position === ''){
        throw new BadRequestError('Company/Position cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId},req.body,{new: true, runValidators:true});
    if(!job){
        throw new NotFoundError(`No Job with Job Id ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);
}
const deleteJob = async function (req, res) {
    const {user:{userId},params:{id:jobId}} = req;
    if(jobId === '' ){
        throw new BadRequestError('JobId cannot be empty')
    }
    const job = await Job.findOneAndDelete({_id:jobId, createdBy:userId});
    if(!job){
        throw new NotFoundError(`No Job with Job Id ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);
}

module.exports = {
    deleteJob,
    updateJob,
    createJob,
    getJob,
    getAllJobs
}