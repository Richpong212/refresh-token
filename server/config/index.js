const dotenv = require('dotenv');
dotenv.config();

const dev = {
    app: {
        port: process.env.SERVER_PORT ,
        jwtSecret: process.env.TOKEN_SECRET,
        clientUrl: process.env.CLIENT_URL
    },
    db: {
        url: process.env.MONGODB_URL || ''
    }
}   

module.exports = dev; 