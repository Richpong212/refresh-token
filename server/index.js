const express = require('express');
const chalk = require('chalk');
const userRoute = require('./routes/user.routes');
const morgan = require('morgan');
const cors = require('cors'); 
const dev = require('./config');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');  


const app = express();

const port = dev.app.port || 3008
 
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true  
}))
app.use(cookieParser()) 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))




// testing route
app.get('/', (req, res) => {
    res.send('Welcome to the blog api');
});
 
// user routes
app.use('/api/users', userRoute)
 
app.listen(port, async () => {
    console.log(chalk.green(`Server is running on port ${port}`));
    await connectDB()
}); 


 