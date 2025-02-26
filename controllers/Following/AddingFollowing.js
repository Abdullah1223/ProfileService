const { producer } = require('../../KafkaConnection/KafkaConnection');
const FollowingHandlingQueue = require('../Bullmq/FollowingHandlingQueue');
const WorkerForFollowingHandlingQueue = require('../Bullmq/WorkerForFollowingHandlingQueue');
const AddingFollowing = async(req,res)=>{
  console.log('Adding Following')
  const {_id} = req.body
  const currentuserid = req.body.user._id
  const action="Follow";
   if(_id==null && currentuserid==null){
    return res.status(404).send({Message:'No User Found'})
   }
    const data = {
      currentuserid,
      _id,
      action
    }
   await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(data),partition:1}]})

   return res.status(200).send({Message:'Produced Into Kafka We Are Processing'})
  //  try{
  //   const addingtoqueue =  await FollowingHandlingQueue.add('followingdata',{currentuserid,_id,action});
  //   WorkerForFollowingHandlingQueue();  
  //   if(addingtoqueue){
        
  //       return res.status(200).send({Message:"We Are Processing Your Request"})
  //     }
  //  }catch(err){
  //   return res.status(500).send({Message:'Server Error!!!'})
  //  }

}

module.exports = AddingFollowing;