const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.getHashedPassword = async (password) => {
    try {
       return  await bcrypt.hash(password, saltRounds);
    } catch (error) {
          console.log(error); 
    }
} 

exports.comparePassword = async (password,hasPassword) => {
    try {
       return  await bcrypt.compare(password, hasPassword);
    } catch (error) {
          console.log(error); 
    }
} 