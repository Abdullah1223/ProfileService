const UserManager = require("../../models/UserSchema");
const CompetitionSchema=require('../../models/CompetitionSchema');
const RedisManager = require("../../RedisConnection/RedisConnection");
const FetchingSaved = async(req,res)=>{
    const{_id}=req.body.user;
    const CheckingForCache = await RedisManager.exists(`${_id}saved`)
    if(CheckingForCache==0){
      const Fetching =await UserManager.findOne({_id:_id}).populate('saved._id').exec()
      if(Fetching){
      const MappedSavedData = await Fetching.saved.map(item => {
          const competition = item._id; // Access the populated competition object
          return {
              _id: competition._id,
              title: competition.title,
              description:competition.description,
              deadline: competition.deadline,
              startdate:competition.startdate,
              entryFee: competition.entryFee,
              prize: competition.prize,
              genre:competition.genre,
              status:competition.status,
              ifentryfees:competition.ifentryfees,
              participants: competition.participants.length // Get the count of participants
          };
      });
      console.log('Setting To Redis')
      const SettingToRedis  = await RedisManager.set(`${_id}saved`,JSON.stringify(MappedSavedData))
     return res.status(200).send(MappedSavedData)
    }
    }
    console.log('Sending From Redis')
    const SendingFromRedis = await RedisManager.get(`${_id}saved`)
    const ParsingData = JSON.parse(SendingFromRedis)
    return res.status(200).send(ParsingData)


    
  
  // else{
  //   return res.status(404).send({Message:'No User Found With this Id'})
  // }

    // Return the new array of competitions
    
}

module.exports =FetchingSaved;