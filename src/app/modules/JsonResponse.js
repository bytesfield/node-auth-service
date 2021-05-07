const { httpStatus } = require('../../config/status');
const { httpErrors } = require('../../config/errors');

class JsonResponse {

     /**
       * Generates a success response for a request
       *
       * @param {string} message
       * @param {array} data
       *
       * @return  \json
       */
    success(message, data = {}){

        return this.buildResponse(message, httpErrors.SUCCESS, httpStatus.OK, data);

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
        return this.buildResponse(message, httpErrors.FAILED, httpStatus.VALIDATION_ERROR, errors);
    }
  
      /**
       * Generates a not found response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    notFound(message){
        return this.buildResponse(message, httpErrors.NOT_FOUND, httpStatus.NOT_FOUND);
    }

     /**
       * Generates an unauthorized response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
      unauthorized(message){
        return this.buildResponse(message, httpErrors.UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    }
  
      /**
       * Generates a method not found response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    methodNotAllowed(message){
        return this.buildResponse(message, httpErrors.METHOD_NOT_FOUND, httpStatus.METHOD_NOT_FOUND);
    }
  
      /**
       * Generates a failed Data Creation response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    failedDataCreation(message){
        return this.buildResponse(message, httpErrors.BAD_REQUEST, httpStatus.BAD_REQUEST);
    }

  
      /**
       * Generates an error response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    error(message){
        return this.buildResponse(message, httpErrors.FAILED, httpStatus.CONFLICT);
    }
  
      /**
       * Generates a forbidden response for a request
       *
       * @param {string} message
       *
       * @return \json
       */
    forbidden(message){
        return this.buildResponse(message, httpErrors.FORBIDDEN, httpStatus.FORBIDDEN);
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