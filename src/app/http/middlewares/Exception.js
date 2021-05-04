const httpStatus = require('../../../config/status');
const httpError = require('../../../config/errors');


  const  handleValidationError =  (error, req, res, next) => {
      if (error.name === 'ValidationError') {
          return res
            .status(httpStatus.httpStatus.VALIDATION_ERROR)
            .json({
                type : error.name,
                status: httpStatus.httpStatus.VALIDATION_ERROR,
                message : httpError.httpErrors.VALIDATION_ERROR,
                error: error.message
            });
      }
      next(error);
    
  }
  const  handleTypeError =  (error, req, res, next) => {
      if (error.name === 'TypeError') {
          return res
            .status(httpStatus.httpStatus.BAD_REQUEST)
            .json({
                type : error.name,
                status: httpStatus.httpStatus.BAD_REQUEST,
                message : httpError.httpErrors.BAD_REQUEST,
                error: error.message
            });
      }
      next(error);
     
  }

  const  handleSyntaxError =  (error, req, res, next) => {
    if (error.name === 'SyntaxError') {
        return res
          .status(httpStatus.httpStatus.UNPROCESSIBLE_ENTITY)
          .json({
              type : error.name,
              status: httpStatus.httpStatus.UNPROCESSIBLE_ENTITY,
              message : httpError.httpErrors.UNPROCESSIBLE_ENTITY,
              error: error.message
          });
    }
    next(error);
   
}

  const  handleReferenceError =  (error, req, res, next) => {
      if (error.name === 'ReferenceError') {
          return res
            .status(httpStatus.httpStatus.BAD_REQUEST)
            .json({
                type : error.name,
                status: httpStatus.httpStatus.BAD_REQUEST,
                message : httpError.httpErrors.BAD_REQUEST,
                error: error.message,
            });
      }
      next(error);
    
  }

  const handleNotFoundError = (error, req, res, next) => {
      if (error.name === 'NotFoundError') {
          return res
            .status(httpStatus.httpStatus.NOT_FOUND)
            .json({
                type : error.name,
                status: httpStatus.httpStatus.NOT_FOUND,
                message : httpError.httpErrors.NOT_FOUND,
                error: error.message,
            });
      }
      next(error);
  }

  const handleDatabaseError = (error, req, res, next) => {
      if (error.name === 'MongoError') {
          if (error.code === 11000) {
              return res
                .status(httpStatus.httpStatus.CONFLICT)
                .json({
                    status: httpStatus.httpStatus.CONFLICT,
                    type: 'MongoError',
                    message : httpError.httpErrors.CONFLICT,
                    error: error.message
                });
          } else {
              return res
                .status(httpStatus.httpStatus.SERVICE_UNAVAILABLE,)
                .json({
                    httpStatus: httpStatus.httpStatus.SERVICE_UNAVAILABLE,
                    type: 'MongoError',
                    message : httpError.httpErrors.SERVICE_UNAVAILABLE,
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
          res.status(error.status || httpStatus.httpStatus.SERVER_ERROR);
          res.json({
              type : error.name,
              status : httpStatus.httpStatus.SERVER_ERROR,
              message : httpError.httpErrors.SERVER_ERROR,
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