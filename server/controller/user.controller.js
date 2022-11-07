const { errorResponse, successResponse } = require("../helper/responseHelper");
const { getHashedPassword, comparePassword } = require("../helper/securePassword");
const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const dev = require("../config");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if(!name || !email || !password) 
          return errorResponse(res, 400, "Please fill all the fields");
        if(password.length < 6) 
            return errorResponse(res, 400, "Password must be at least 6 characters long");
        // Check for existing user
        const user = await User.findOne({ email })
        if(user) 
            return errorResponse(res, 400, "User already exists");
         // Hashing password  
         const  hasPassword = await getHashedPassword(password);
         console.log(hasPassword);
        // Create new user
         const newUser = new User({
                name,
                email, 
                password: hasPassword,
                phone
            }); 

        // Save user to database 
        const userData =   await newUser.save();  
        if(!userData) 
            
            return errorResponse(res, 400, "Something went wrong");
            const userInfo = {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                id: userData._id
            };
            return successResponse(res, 201, "User registered successfully", userInfo);
    
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

// Login user
const loginUser = async (req, res) => {
     try {
            const { email, password } = req.body;
            if(!email || !password){
                return errorResponse(res, 400, "Please fill all the fields");
            }
            // Check for existing user
            const user = await User.findOne({ email });
            if(!user){
                return errorResponse(res, 400, "User does not exist");
            }

            // Check for password
            const isMatch = await comparePassword(password, user.password);
            if(!isMatch){
                return errorResponse(res, 400, "Invalid credentials");
            }

           
            // Create and assign a token
            const token = jwt.sign({ id: user._id }, String(dev.app.jwtSecret), { expiresIn: '38s' });

             // reseting cookie if somethin is already there
             if(req.cookies[`${user._id}`]){
                req.cookies[`${user._id}`] = null; 
            }

             // sending the token in a HTTP-only cookie
             res.cookie(String(user._id), token, {
                path: '/',  
                expires: new Date(Date.now() + 1000 * 35), // cookie will be removed after 35 seconds
                httpOnly: true,
                sameSite: 'lax' 
                
            });
            return successResponse(res, 200, "User logged in successfully", token);

           

            
     } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error' 
            });
     }
};

//Middleware to check if user is authorized
const isAuthorized = async (req, res, next) => {
     try {
        if(!req.headers.cookie){
            return errorResponse(res, 401, "No cookie found");
        } 
        const token = req.headers.cookie.split('=')[1];
        if(!token){
            return errorResponse(res, 401, "No token found");
        }
        // Verify token
          jwt.verify(token, String(dev.app.jwtSecret), function(err, decoded) {
            if(err){
                return errorResponse(res, 401, "Invalid token");
            }
            req.id = decoded.id;
            next()
         }); 
 
     } catch (error) { 
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
     }
}

// Get user profile
const userProfile = async (req, res) => {
     try {
        const user = await User.findOne({ _id: req.id });
        if(!user){
            return errorResponse(res, 400, "User does not exist");
        }
        res.status(200).json({
            status: 'success',
            message: 'User profile fetched successfully',
            data: user
        });
     } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error'
        });
     }
}

// Logout user
const logOutUser = async (req, res) => {
    try {
         if(!req.headers.cookie){
            return errorResponse(res, 401, "No cookie found");
        }
        const token = req.headers.cookie.split('=')[1];
        if(!token){
            return errorResponse(res, 401, "No token found");
        }
        // Verify token
            jwt.verify(token, String(dev.app.jwtSecret), function(err, decoded) {
                if(err){
                    return errorResponse(res, 401, "Invalid token");
                }
                req.id = decoded.id;
                 return successResponse(res, 200, "User logged out successfully");
            });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

// refresh token
const getRefreshToken = async (req, res ,next) => {
    try {
        if(!req.headers.cookie){
            return errorResponse(res, 401, "No cookie found");
        } 
        const oldToken = req.headers.cookie.split('=')[1];
        if(!oldToken){ 
            return errorResponse(res, 401, "No token found");
        }
        // Verify old   token
          jwt.verify(oldToken, String(dev.app.jwtSecret), function(err, user) {
            if(err){
                console.log(err);
                return errorResponse(res, 403, "Authentication failed");
            } 
            //resetting the cookies and token
            res.clearCookie(`${user.id}`); 
            req.cookies[`${user.id}`] = null;

            // Create and assign a new token 
            const newToken = jwt.sign({ id: user.id }, String(dev.app.jwtSecret), { expiresIn: '35s' });

            // adding the new token to the cookies
            res.cookie(String(user.id), newToken, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 32), // cookie will be removed after 30 seconds
                httpOnly: true,
                sameSite: 'lax' 
            });

            req.id = user.id; 
         }); 
         next(); 
          
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

 
module.exports = { 
    registerUser,
    loginUser,
    userProfile,
    isAuthorized,
    logOutUser,
    getRefreshToken
} 