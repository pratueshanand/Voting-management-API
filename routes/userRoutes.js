const express = require('express');
const router = express.Router();
const User = require('../model/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const Candidate = require('../model/candidate');

router.post('/signup', async (req, res) => {
    try{
      const data = req.body;
      const adminUsers = await User.find({role: 'admin'});
      if(data.role === 'admin' && adminUsers.length > 0){
        return res.status(403).json({message: 'admin already exists'});
      }
      const newUser = new User(data); 
      const response = await newUser.save();

      const payload = {
        id: response.id
      }
      console.log(JSON.stringify(payload));
      const token = generateToken(payload);
      console.log("Token is:", token);

  
      res.status(200).json({response: response, token: token});
    }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Error occured'});
    }
});

router.post('/login', async (req, res) => {
  try{
    const {aadharCardNumber, password} = req.body;
    const user = await User.findOne({aadharCardNumber: aadharCardNumber});

    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid aadharCardNumber or password'});
    }

    const payload = {
      id: user.id
    }
    const token = generateToken(payload);
    res.status(200).json({token});

  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Error occured'});
  }
})

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findOne({userId});
    res.status(201).json({user});
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Error occured'});
  }
})

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try{
        const userId = req.user.id;
        const {currentPassword, newPassword} = req.body;

        const user = await User.findById(userId);

        if(!(await user.comparePassword(newPassword))){
          return res.status(401).json({error: 'Invalid password'});
        }

        user.password = newPassword;
        await user.save();
        
        console.log('Password Updated');
        res.status(200).json({message: 'Password Updated'});
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;