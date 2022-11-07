  const {Schema, model} = require('mongoose');

    const userSchema = new Schema({
        name : {
            type: String,
            required: true,
            trim: [true, 'Name is required']
        },
        email : {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
        },
        password : {
            type: String,
            required: [true, 'Password is required'],  
        },
        phone : {
            type: String,
            required: [true, 'Phone number is required'],
        } ,
        isVery: {
            type: Number,
            default: 0
        },
        isAdim: {
            type: Number,
            default: 0
        }
    });

    module.exports = model('User', userSchema);  