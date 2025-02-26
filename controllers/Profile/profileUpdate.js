const { producer } = require('../../KafkaConnection/KafkaConnection')
const UserManager =require('../../models/UserSchema')
const DecryptingPassword = require('../Encryption/Decryptingpassword')
const profileUpdate =async(req,res)=>{
    const {name,email,password,bio}=req.body 
    const username = req.body.username.toLowerCase()
    const _id=req.body.user?._id
    console.log(password)
    const CheckingForUserPassAndUsername = await UserManager.findOne({_id:_id}).select('password username')
    const CheckPassword=CheckingForUserPassAndUsername.password;
    let  CheckUsername;
    let IsUsernameExists;
    const CheckingForPassword = await DecryptingPassword(password,CheckPassword)
    if(CheckingForPassword==true){
        if(username==CheckingForUserPassAndUsername.username){
            CheckUsername=true
        }else{
            CheckUsername = false;
             IsUsernameExists = await UserManager.exists({username:username})
             if(IsUsernameExists!=null){
                console.log('Username Already Exists')
                return res.status(204).send()
             }
        }
    }else{
        return res.status(401).send({Message:'Invalid Password'})
    }
    
   if(CheckUsername==true){
    const DataForProducing = {
        _id:_id,
        name:name,
        email:email,
        bio:bio,
        username:username,
        type:'profileUpdate'

    }  
    await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DataForProducing),partition:4}]})
    return res.status(200).send({Message:"Profile Updated"})
   }else if(CheckUsername==false && IsUsernameExists==null){
    const DataForProducing = {
        _id:_id,
        name:name,
        email:email,
        bio:bio,
        username:username,
        type:'profileUpdate'
    }
    await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DataForProducing),partition:4}]})
      return res.status(200).send({Message:"Profile Updated"})  

   }
     
    
}

module.exports = profileUpdate;