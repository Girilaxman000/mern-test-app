const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const salt = bcrypt.genSaltSync(10);

const userSchema = new mongoose.Schema({ //creating new instance
  name: {
      type: String,
      required: true
  },
  email: {
    type: String,
    required: true
},
phone: {
    type: Number,
    required: true
},
work: {
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},
cpassword: {
    type: String,
    required: true
},
 token: {
    type: String,
    required: true
}, 
})

//this keyword soesn't work with fat arrow function
//we are hashing the password.
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password=bcrypt.hashSync(this.password,salt);
        this.cpassword=bcrypt.hashSync(this.cpassword,salt);
    }
    next()
})


const User = mongoose.model('USER', userSchema)

module.exports = User;