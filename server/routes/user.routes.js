const express = require('express');
const { registerUser, loginUser, userProfile, isAuthorized, logOutUser, getRefreshToken } = require('../controller/user.controller');
const { registerUserValidator } = require('../validator/user.validator');


const userRoute = express();

userRoute.post('/register',registerUserValidator, registerUser);
userRoute.post('/login', loginUser);
userRoute.get('/profile', isAuthorized, userProfile);
userRoute.get('/refresh',getRefreshToken,  isAuthorized, userProfile);
 
userRoute.post('/logout',isAuthorized, logOutUser);

 

module.exports = userRoute;  