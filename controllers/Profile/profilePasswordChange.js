const { producer } = require("../../KafkaConnection/KafkaConnection")
const UserManager = require("../../models/UserSchema")
const DecryptingPassword = require("../Encryption/Decryptingpassword")
const Encryptingpassword = require("../Encryption/Encrpytingpassword")

const profilePasswordChange = async(req,res)=>{

 try{const _id =req.body.user?._id
 const {CurrentPassword,NewPassword,ConfirmPassword}=req.body
 const CheckingForPassword = await UserManager.findOne({_id:_id}).select('password')

 const IsPasswordTrue = await DecryptingPassword(CurrentPassword,CheckingForPassword.password)
 if(IsPasswordTrue==true){
        if(NewPassword==ConfirmPassword){
          const EncryptedPassword = await Encryptingpassword(NewPassword)
          const DataToProduce = {
            password:EncryptedPassword,
            _id:_id,
            type:'profilePasswordUpdate'
          }
          await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DataToProduce),partition:4}]})

          return res.status(200).send({Message:'Your Password Has Been Changed'})
        } 
         return res.status(400).send({Message:'Password Does Not Match'})  
 }else{
   return res.status(401).send({Message:'Invalid Password'})  
 }
}catch(err){
  return res.status(500).send({Message:'Error Has  Occuredd'})
}

}


module.exports = profilePasswordChange