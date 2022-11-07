 const {check, validationResult} = require('express-validator')

 exports.registerUserValidator = [
    check('name').notEmpty().withMessage('Name is required'), 
    check('email').normalizeEmail().isEmail().withMessage('Email is required'),
    check('password').isLength({min: 6}).notEmpty().withMessage('This Password does not meet the requirements'),
    check('phone').notEmpty().withMessage('Your Phone number is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
           // const validationErrors = {}
           // const allErrors = errors.array();
           // allErrors.forEach(error => {
              //     validationErrors[error.param] = error.msg
              
          // });
            const validationErrors = errors.array().map(error => error.msg);
            return res.status(400).json({
                status: 'error',
                message: validationErrors
            }); 
        }
        next();
    } 
 ]  