const httpErrors = {

    'OK': 'Successful',
    'SUCCESS' : 'Success',
    'FAILED' : 'Failed',
    'NOT_FOUND' : "We didn't find what you're looking for.",
    'UNPROCESSIBLE_ENTITY' : 'Entity can not be processed',
    'BAD_REQUEST' :  'Bad Request Recieved',
    'FORBIDDEN' : 'You are Forbidden to access this resource',
    'METHOD_NOT_FOUND' : 'The route method is not allowed.',
    'UNAUTHORIZED' : 'You are not authorized to access this resource.',
    'CONFLICT' : 'Conflict Found',
    'VALIDATION_ERROR' : 'Validation failed.',
    'SERVER_ERROR' : 'Unexpected server error occurred. Try again later',
    'SERVICE_UNAVAILABLE' : 'Service not available',

} 

module.exports = {
    httpErrors
}