const UserManager = require("../../models/UserSchema");
const RedisManager = require("../../RedisConnection/RedisConnection");

const FetchingSpecificUser = async(req,res)=>{
  const tofetchuserid = req.params.userid
  const CheckingForCache = await RedisManager.get(`${tofetchuserid}:specificuserdata`)
  if(CheckingForCache!=null){
    const parsing = JSON.parse(CheckingForCache)
    return  res.status(200).send(parsing)
  }
  const FetchingUser = await UserManager.findOne({_id:tofetchuserid}).select('name username avatar bio role')
  await RedisManager.setex(
    `${tofetchuserid}:specificuserdata`, 
    300,  // TTL should be here
    JSON.stringify(FetchingUser) // Value comes last
  );
  return res.status(200).send(FetchingUser)

}

module.exports  = FetchingSpecificUser;