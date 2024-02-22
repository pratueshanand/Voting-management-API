const express = require('express');
const router = express.Router();
const Candidate = require('../model/candidate');

const {jwtAuthMiddleware} = require('../jwt');
const User = require('../model/user');

const checkAdminRole = async(userID) => {
  try{
    const user = await User.findById(userID);
    return user.role==='admin';
  }catch(err){
    return false;
  }
}

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try{
      if(! await checkAdminRole(req.user.id)){
        return res.status(403).json({message: 'Admin access Required'});
      }
      const data = req.body;
      const newCandidate = new Candidate(data); 
      const response = await newCandidate.save();  
      res.status(200).json({response: response});
    }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Error occured'});
    }
});

router.get('/', async(req,res) => {
  try{
    const candidate = await Candidate.find();
    const allCandidate = candidate.map((data) => {
      return {
        Name: data.name,
        Party: data.party
      }
    })
    res.status(200).json(allCandidate);
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Error occured'});
  }
})

router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try{
      if(! await checkAdminRole(req.user.id)){
        return res.status(403).json({message: 'Admin access Required'});
      }

      const candidateID = req.params.candidateID;
      const updatedCandidateData = req.body;

      const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
          new: true,
          runValidators: true
      });

      if(!response){
          return res.status(404).json({error: 'Candidate not found'})
      }

      console.log('Candidate Data Updated');
      res.status(200).json(response);
  }catch(err){
      console.log(err);
      res.status(500).json({error: 'Internal Server Error'});
  }
})

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try{
    if(! await checkAdminRole(req.user.id)){
      return res.status(403).json({message: 'Admin access Required'});
    }

    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);

    if(!response){
        return res.status(404).json({error: 'Candidate not found'})
    }

    console.log('Candidate Deleted');
    res.status(200).json(response);
}catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
}
})

router.post('/vote/:candidateID', jwtAuthMiddleware, async(req,res) => {
  candidateID = req.params.candidateID;
  userId = req.user.id;
  try{
    const candidate = await Candidate.findById(candidateID);
    if(!candidate){
      return res.status(404).json({message: 'Candidate Not Found'});
    }
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message: 'Candidate Not Found'});
    }
    if(user.isVoted){
      return res.status(400).json({message: 'You have already Voted'});
    }
    if(user.role === 'admin'){
      return res.status(403).json({message: 'Admin is not allowed'});
    }

    candidate.votes.push({user: userId});
    candidate.voteCount++;
    await candidate.save();
    user.isVoted=true;
    await user.save();

    res.status(200).json({message: 'Vote Recorded Successfully'});

  }catch(err){
    console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
  }
})

router.get('/vote/count', async(req, res) => {
  try{
    const candidate = await Candidate.find().sort({voteCount: 'desc'});
    const voteRecond = candidate.map((data) => {
      return {
        "party": data.party,
        "Vote Count": data.voteCount
      }
    })

    res.status(200).json(voteRecond);
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

module.exports = router;