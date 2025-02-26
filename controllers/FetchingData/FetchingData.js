const UserManager = require('../../models/UserSchema')
const RedisManager = require('../../RedisConnection/RedisConnection')
const FetchingData=async(req,res)=>{

  /////HERE WE HAVE TO WORK IT IS CACHING PASSWORD WHICH WE HAVE TO CHANGE IN PRODUCTION
     const {_id,role}=req.body;
     try{
        const CheckForCache = await RedisManager.exists(`${_id}Profile`)
        if(CheckForCache==0){
          const FetchingData = await UserManager.findOne({_id:_id}).select('name username _id bio email avatar')
          if(FetchingData){
              const DatatoString=JSON.stringify(FetchingData)
  /////HERE WE HAVE TO WORK IT IS CACHING PASSWORD WHICH WE HAVE TO CHANGE IN PRODUCTION
            await RedisManager.set(`${_id}Profile`,`${DatatoString}`)
            return res.status(200).send(FetchingData)
          }else{
              return res.status(404).send({message:'User Not Found'})
          }
        }else{
          const CacheReturn = await RedisManager.get(`${_id}Profile`)
          const ParsingToObject = JSON.parse(CacheReturn)
        
          console.log('Sending From Redis')
          return res.status(200).send(ParsingToObject) 
        }   
     } catch(err){
        console.log(err)
     }
     
}

module.exports = FetchingData;