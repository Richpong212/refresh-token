const chalk = require('chalk');
const mongoose = require('mongoose');
const dev = require('./');

const connectDB = async () => {
    try {
       await  mongoose.connect(dev.db.url)
       console.log(chalk.blue('Database connected successfully'))
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;  