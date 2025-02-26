const UserManager =require('../../models/UserSchema')
const RedisManager = require('../../RedisConnection/RedisConnection')
const FetchingFollowing = async(req,res)=>{
   const _id=req.body.user?._id
   const cursor = req.params.cursor
   const role = req.params.role
//  const _id = "678bb0b92b8d1da88e976d66"
    console.log('Fetching Following Hit')
   if(cursor==0&&role=='all'){
   const CheckingForCache = await RedisManager.hget(`${_id}following`,`all/${0}`)
   if(CheckingForCache){    
    const SendingValues = {
      data:JSON.parse(CheckingForCache),
      YourId:_id,
    }
    return res.status(200).send(SendingValues)
   }
    const data = await UserManager.find({_id:{$ne:_id}}).select('name bio image avatar username role followers').populate({
      path:'followers.user',
      select:'_id'
    }).limit(4)
    const SendingValues = {
      data:data,
      YourId:_id,
    }
    if(data.length>0){
      const SettingToRedis = await RedisManager.hset(`${_id}following`,`all/${0}`,JSON.stringify(data))
    }
   return res.status(200).send(SendingValues)
   }else if(cursor!=0&&role=='all'){
    const CheckingForCache = await RedisManager.hget(`${_id}following`,`all/${cursor}`)
    if(CheckingForCache){
      const SendingValues = {
        data:JSON.parse(CheckingForCache),
        YourId:_id,
      }
      return res.status(200).send(SendingValues)
    }
    const data = await UserManager.find({_id:{$ne:_id,$gt:cursor}}).select('name bio image avatar username role followers').populate({
      path:'followers.user',
      select:'_id'
    }).limit(4)
    const SendingValues = {
      data:data,
      YourId:_id,
    }
    const SettingToRedis = await RedisManager.hset(`${_id}following`,`all/${cursor}`,JSON.stringify(data))
    return res.status(200).send(SendingValues)
       //fetch all the recors after that cursor 
   }else if(cursor==0&&role=='artist'){
    //fetch all records where role = artist 
    const CheckingForCache = await RedisManager.hget(`${_id}following`,`artist/${0}`)
    if(CheckingForCache){
      const SendingValues = {
        data:JSON.parse(CheckingForCache),
        YourId:_id,
      }
      return res.status(200).send(SendingValues)
    }
    const data = await UserManager.find({_id:{$ne:_id},role:"artist"}).select('name bio avatar username role followers').populate({
      path:'followers.user',
      select:'_id'
    }).limit(4)
    const SettingToRedis = await RedisManager.hset(`${_id}following`,`artist/${0}`,JSON.stringify(data))
    const SendingValues = {
      data:data,
      YourId:_id,
    }
   return res.status(200).send(SendingValues)
   }else if(cursor!=0&&role=='artist'){
    // fetch recordsaftercursor where role==artist
    const CheckingForCache = await RedisManager.hget(`${_id}following`,`artist/${cursor}`)
    if(CheckingForCache){
      const SendingValues = {
        data:JSON.parse(CheckingForCache),
        YourId:_id,
      }

      return res.status(200).send(SendingValues)
    }
    const data = await UserManager.find({_id:{$ne:_id,$gt:cursor},role:"artist"}).select('name avatar bio image username role followers').populate({
      path:'followers.user',
      select:'_id'
    }).limit(4)
    const SendingValues = {
      data:data,
      YourId:_id,
    }
    const SettingToRedis = await RedisManager.hset(`${_id}following`,`artist/${cursor}`,JSON.stringify(data))
   return res.status(200).send(SendingValues)
   }else if(cursor==0&&role=='fan'){
     //fetch all the records withlimit where role = fan 
     const CheckingForCache = await RedisManager.hget(`${_id}following`,`fan/${0}`)
    if(CheckingForCache){
      const SendingValues = {
        data:JSON.parse(CheckingForCache),
        YourId:_id,
      }
      return res.status(200).send(SendingValues)
    }
     const data = await UserManager.find({_id:{$ne:_id},role:"fan"}).select('name avatar bio image username role followers').populate({
      path:'followers.user',
      select:'_id'
    }).limit(4)
    const SendingValues = {
      data:data,
      YourId:_id,
    }
    const SettingToRedis = await RedisManager.hset(`${_id}following`,`fan/${0}`,JSON.stringify(data))

   return res.status(200).send(SendingValues)
   }else if(cursor!=0&&role=='fan'){
    //fetch records aftercursor where role == fan
    
    const CheckingForCache = await RedisManager.hget(`${_id}following`,`fan/${cursor}`)
    if(CheckingForCache){
      const SendingValues = {
        data:JSON.parse(CheckingForCache),
        YourId:_id,
      }
      return res.status(200).send(SendingValues)
    }
    const data = await UserManager.find({_id:{$ne:_id,$gt:cursor},role:"fan"}).select('name bio image avatar username role followers').populate({
      path:'followers.user',
      select:'_id'
    }).limit(4)
    const SendingValues = {
      data:data,
      YourId:_id,
    }
    const SettingToRedis = await RedisManager.hset(`${_id}following`,`fan/${cursor}`,JSON.stringify(data))

   return res.status(200).send(SendingValues)
   }
}

module.exports  = FetchingFollowing;