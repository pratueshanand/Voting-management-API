const express = require('express');
const router = express.Router();
const User = require('../model/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

router.post('/signup', async (req, res) => {
    try{
      const data = req.body;
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

// router.get('/', async (req, res) => {
//     try{
//       const data = await User.find();
//       console.log('data fetched');
//       res.status(200).json(data);
//     }catch(err){
//       console.log(err);
//       res.status(500).json({error: 'Internal Server Error'});
//     }
// });

// router.get('/:worktype', async (req, res) => {
//     try{
//       const workType = req.params.worktype;
//       if(workType == "chef" || workType == "manager" || workType == 'waiter'){
//         const data = await User.find({work: workType});
//         console.log('data fetched');
//         res.status(200).json(data);
//       }
//       else{
//         res.status(404).json({error: 'Invalid Work Type'});
//       }
//     }catch(err){
//       console.log(err);
//       res.status(500).json({error: 'Internal Server Error'});
//     }
// });

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

// router.get('/:id', async (req, res) => {
//     try{
//         const UserId = req.params.id;
//         const response = await User.findById(UserId);

//         if(!response){
//             return res.status(404).json({error: 'User not found'})
//         }

//         console.log('User');
//         res.status(200).json({response});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// router.patch('/:id', async (req, res) => {
//     try{
//       const UserId = req.params.id;
//       const updatedUserData = req.body;

//       const response = await User.findByIdAndUpdate(UserId, updatedUserData, {
//           new: true,
//           runValidators: true
//       });

//       if(!response){
//           res.status(404).json({error: 'User not found'})
//       }

//       console.log(response);
//       res.status(200).json(response);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: 'err'});
//     }
// })

// router.delete('/:id', async (req, res) => {
//     try{
//         const UserId = req.params.id;
//         const response = await User.findByIdAndDelete(UserId);
//         if(!response){
//             return res.status(404).json({error: 'User not found'})
//         }
//         console.log('Data Deleted');
//         res.status(200).json({message: 'User Deleted Successfully'});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

module.exports = router;