const jwt = require('jsonwebtoken');
const { httpStatus } = require('../../../config/status');
const httpError = require('../../../config/errors');
const JsonResponse = require('../../modules/JsonResponse');

let jsonResponse = new JsonResponse();


module.exports = (req, res, next) => {

    const token = req.header('auth-token');
    if(!token){
        return res.status(httpStatus.NOT_FOUND).send(jsonResponse.notFound('Access Denied, token required'));
    }

    try{

        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length).trimLeft();
            
        }

        const verified = jwt.verify(token, res.locals.secrets.JWT_SECRET);
        
        if(!verified){
            return res.status(httpStatus.UNAUTHORIZED).send(jsonResponse.unauthorized('Invalid Token'));

        }

        req.user = verified;

        next();

    }catch(err){
        return res.status(httpStatus.CONFLICT).send(jsonResponse.error('Something went wrong, token invalid'));
    }
}