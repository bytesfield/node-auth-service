const { httpStatus } = require('../../../config/status');
const { httpErrors } = require('../../../config/errors');


  const  handleValidationError =  (error, req, res, next) => {
      if (error.name === 'ValidationError') {
          return res
            .status(httpStatus.VALIDATION_ERROR)
            .json({
                type : error.name,
                status: httpStatus.VALIDATION_ERROR,
                message : httpErrors.VALIDATION_ERROR,
                error: error.message
            });
      }
      next(error);
    
  }
  const  handleTypeError =  (error, req, res, next) => {
      if (error.name === 'TypeError') {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({
                type : error.name,
                status: httpStatus.BAD_REQUEST,
                message : httpErrors.BAD_REQUEST,
                error: error.message
            });
      }
      next(error);
     
  }

  const  handleSyntaxError =  (error, req, res, next) => {
    if (error.name === 'SyntaxError') {
        return res
          .status(httpStatus.UNPROCESSIBLE_ENTITY)
          .json({
              type : error.name,
              status: httpStatus.UNPROCESSIBLE_ENTITY,
              message : httpErrors.UNPROCESSIBLE_ENTITY,
              error: error.message
          });
    }
    next(error);
   
}

  const  handleReferenceError =  (error, req, res, next) => {
      if (error.name === 'ReferenceError') {
          return res
            .status(httpStatus.BAD_REQUEST)
            .json({
                type : error.name,
                status: httpStatus.BAD_REQUEST,
                message : httpErrors.BAD_REQUEST,
                error: error.message,
            });
      }
      next(error);
    
  }

  const handleNotFoundError = (error, req, res, next) => {
      if (error.name === 'NotFoundError') {
          return res
            .status(httpStatus.NOT_FOUND)
            .json({
                type : error.name,
                status: httpStatus.NOT_FOUND,
                message : httpErrors.NOT_FOUND,
                error: error.message,
            });
      }
      next(error);
  }

  const handleDatabaseError = (error, req, res, next) => {
      if (error.name === 'MongoError') {
          if (error.code === 11000) {
              return res
                .status(httpStatus.CONFLICT)
                .json({
                    status: httpStatus.CONFLICT,
                    type: 'MongoError',
                    message : httpErrors.CONFLICT,
                    error: error.message
                });
          } else {
              return res
                .status(httpStatus.SERVICE_UNAVAILABLE,)
                .json({
                    httpStatus: httpStatus.SERVICE_UNAVAILABLE,
                    type: 'MongoError',
                    message : httpErrors.SERVICE_UNAVAILABLE,
                    error: error.message
                });
          }
      }
      next(error);
  }

  const handleServerError  = (error, req, res, next) => {
      if (res.headersSent) {
          return next(error)
      } else {
          res.status(error.status || httpStatus.SERVER_ERROR);
          res.json({
              type : error.name,
              status : httpStatus.SERVER_ERROR,
              message : httpErrors.SERVER_ERROR,
              error: error.message
          });
      }
  
  }

  module.exports = {
    handleValidationError,
    handleNotFoundError,
    handleDatabaseError,
    handleServerError,
    handleReferenceError,
    handleTypeError,
    handleSyntaxError

  }