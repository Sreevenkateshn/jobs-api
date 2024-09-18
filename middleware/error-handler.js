const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    statusCode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })

  if(err.name === "ValidationError"){
    customError.msg = Object.values(err.errors).map((item => item.message)).join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;    
  }
  if(err && err.code === 11000){
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyPattern)}, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if(err.name === "CastError"){
    customError.msg = `No item found with id:${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;  
  }
  return res.status(customError.statusCode).json({msg:customError.msg});
}

module.exports = errorHandlerMiddleware
