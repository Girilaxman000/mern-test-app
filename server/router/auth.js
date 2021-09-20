const express = require('express')
const router = express.Router() //its express router
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/authenticate')

const User = require("../model/userSchema")

//using promisess
//req.body gets all data user write in frontend
// router.post('/register', (req,res) => {
//     const { name, email, password, cpassword, phone, work} = req.body;
//     //console.log(req.body.name);
//     //this below logic is same for both frontend and backend
//     //status code is important so we need to write status code.
//     if(!name || !email || !phone || !password || !cpassword || !work){
//         res.send({ error: "Plz fill all elements"})
//     }

//    // ==>Below Commented Code Is done By Using Promises But this can be simplified even further using async/await <==

//     // User.findOne({email: email}) //left side email is of database and right is our email
//     // .then((userExist) => {  //this returns promises as we will find or don't find. we don't have any option.
//     //     if(userExist){  //run vayo vaneci .then ma natra error
//     //         return res.json({ error: "Email already exists"})
//     //     }
//     //     const user = new User({
//     //         name: name,
//     //         email: email,
//     //         phone: phone,
//     //         password: password,
//     //         cpassword: cpassword,
//     //         work: work
//     //     })
//     //     user.save().then(() => {
//     //         res.status(201).json({ message: "Registered"})
//     //     }).catch((err) => res.status(500).json({error: "Failed"}))
//     // }).catch((error) => console.log(error))

   
//     //nest way of saving in db
//     // async create(employeeCreateDto: EmployeeCreateDTO): Promise<Employee> {
//     //     let newEmployee = new this.employeeModel(employeeCreateDto);
//     //     return await newEmployee.save();
//     //   }




// })


//using async /awsit 
router.post('/register', async (req, res) => {
    const { name, email, password, cpassword, phone, work} = req.body;
    if(!name || !email || !phone || !password || !cpassword || !work){
                 res.send({ error: "Plz fill all elements"})
    }

    try {
        const result = await User.findOne({ email: email})
        if(result){
            return res.json({ error: "Email already exist"})
        } else if (password !== cpassword){
            return res.json({error: "password aren't matching"})
        } else {
        const user = new User({
                        name: name,
                        email: email,
                        phone: phone,
                        password: password,
                        cpassword: cpassword,
                        work: work
                    })
        //method/function for hashing data.
        //pre method.
        //user.password = await bcrypt.hash(user.password , 10)        

        // Create token
    const token = jwt.sign(
        { user_id: user._id, email },
        'MYNAMEISLAXMAN',
        {
          expiresIn: "9h",
         
        }
      );
      // save user token
      user.token = token;
        const UserRegister = await user.save();
        if(UserRegister){
            res.json({ message: "Registeres"})
        }
    }
    } catch(err) {
        console.log(err);
    }


})


//login route
router.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body //get data while user enters in fields

        if(!email || !password){  //always give invalid credentials/details
            return res.status(400).json({ error: 'Please fill all fields'})
        }

        const result = await User.findOne({ email: email}) //database email with name and data, gives all document
        const isMatch = await bcrypt.compare(password, result.password) //first one is password user enters.
          
        if(result && isMatch){ //result bhitra exact data xa vane matra
            // Create token
      const token = jwt.sign(
        { id: result._id, email },
        'MYNAMEISLAXMAN',
        {
            expiresIn: "9h",
        }
      );

      // save user token
      result.token = token;
      return res.status(200).json({message: token})
        } else {
            res.status(400).json({message: "errors"})
        } 
    } catch(err){
        console.log(err)
    }
   
})

router.get('/about', authenticate, (req, res) => {
    res.send('Hii')
}) 

module.exports = router;