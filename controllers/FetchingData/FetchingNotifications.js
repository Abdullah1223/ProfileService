const UserManager = require("../../models/UserSchema");

const FetchingNotifications = async (req,res)=>{

     const _id = req.body.user._id
     const cursor = req.params.cursor
     const type = req.params.type
     if(cursor==0 && type==0){
      const Notifications = await UserManager.findOne({_id:_id}).select('Notifications')
      return res.status(200).send(Notifications)
     }else if(cursor!=0 && type=='ActiveNotifications'){
      const ActiveNotifications = await UserManager.find(
            { _id: _id, "Notifications.ActiveNotifications._id": { $gt: cursor } }, // Correct filtering
             // Correct slicing
          ).select("Notifications.ActiveNotifications").limit(4);
          
          console.log(ActiveNotifications)
               return res.status(200).send(ActiveNotifications)
     }
      // if(Notifications){
          
      // }else{
      //   return res.status(404).send({Message:'No Notifications Found'})
      // }
     

}

module.exports = FetchingNotifications;