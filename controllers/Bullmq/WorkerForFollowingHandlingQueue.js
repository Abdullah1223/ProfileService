const {Worker}=require('bullmq')
const RedisManager = require('../../RedisConnection/RedisConnection')
const UserManager = require('../../models/UserSchema')

const WorkerForFollowingHandlingQueue = async()=>{

    const worker = new Worker('followinghandlingqueue',async (job)=>{
          
        const bulkOps = []

        try{
            if(job.data.action=='Follow'){
                bulkOps.push({
                  updateOne: {
                    filter: { _id: job.data.currentuserid },
                    update: { $push: { following: { user: job.data._id, followSince: new Date() } } },
                  },
                });
                bulkOps.push({
                  updateOne: {
                    filter: { _id: job.data._id },
                    update: { $push: { followers: { user: job.data.currentuserid, followSince: new Date() } } },
                  },
                })
              }else if(job.data.action=="Unfollow"){
                  bulkOps.push({
                      updateOne: {
                        filter: { _id: job.data.currentuserid },
                        update: { $pull: { following: { user: job.data._id } } },
                      },
                    });
                    bulkOps.push({
                      updateOne: {
                        filter: { _id: job.data._id },
                        update: { $pull: { followers: { user: job.data.currentuserid } } },
                      },
                    });
              }
      
              if(bulkOps.length>0){
                  await UserManager.bulkWrite(bulkOps)
              }
        }catch(err){
            console.log(err)
        }

    },{
        connection:RedisManager
    })

}

module.exports = WorkerForFollowingHandlingQueue