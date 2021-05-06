const httpStatus = require('../../config/status');
const httpError = require('../../config/errors');

class JsonResponse {

     /**
       * Generates a success response for a request
       *
       * @param {string} message
       * @param {array} data
       *
       * @return \json
       */
    success(message, data = {}){

        return this.buildResponse(message, httpError.httpErrors.SUCCESS, httpStatus.httpStatus.OK, data);

    }

     /**
     * Generates a not found response for a request
     *
     * @param {string} message
     * @param {array} errors
     *
     * @return \Json
     */
    failedValidation(message, errors = {}){
        return this.buildResponse(message, httpError.httpErrors.FAILED, httpStatus.httpStatus.VALIDATION_ERROR, errors);
    }
  
      /**
       * Generates a not found response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    notFound(message){
        return this.buildResponse(message, httpError.httpErrors.NOT_FOUND, httpStatus.httpStatus.NOT_FOUND);
    }

     /**
       * Generates an unauthorized response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
      unauthorized(message){
        return this.buildResponse(message, httpError.httpErrors.UNAUTHORIZED, httpStatus.httpStatus.UNAUTHORIZED);
    }
  
      /**
       * Generates a method not found response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    methodNotAllowed(message){
        return this.buildResponse(message, httpError.httpErrors.METHOD_NOT_FOUND, httpStatus.httpStatus.METHOD_NOT_FOUND);
    }
  
      /**
       * Generates a failed Data Creation response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    failedDataCreation(message){
        return this.buildResponse(message, httpError.httpErrors.BAD_REQUEST, httpStatus.httpStatus.BAD_REQUEST);
    }

  
      /**
       * Generates an error response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    error(message){
        return this.buildResponse(message, httpError.httpErrors.FAILED, httpStatus.httpStatus.CONFLICT);
    }
  
      /**
       * Generates a forbidden response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    forbidden(message){
        return this.buildResponse(message, httpError.httpErrors.FORBIDDEN, httpStatus.httpStatus.FORBIDDEN);
    }

    buildResponse(
        message,
        status,
        statusCode,
        data = {},
        headers = {}
    ){
        const responseData = {
            status : status,
            statusCode : statusCode,
            message : message,
        };

        if (data.length !== undefined ) {
            responseData.data = data;
            
        }

        return responseData;
    }


}


module.exports = JsonResponse;