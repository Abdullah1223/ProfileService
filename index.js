const express = require('express')
const cluster = require('node:cluster')
const os = require('node:os').availableParallelism()
const ConnectingKafkaWorker = require('./KafkaConnection/ConnectingKafkaWorker')

const cors = require('cors')
const cookieparser =require('cookie-parser')
const dotenv = require('dotenv')
const routeforfetchingforuser = require('./routes/FetchingForUser')
const conn = require('./Connection')
const JwtAuth = require('./middlewares/JwtAuth')
const routerforfetchingfollowing = require('./routes/FetchingFollowing')
const routeforsaving = require('./routes/AddingToSave')
const JwtAuth2 = require('./middlewares/JwtAuth2')
const routeforfetchingsaved = require('./routes/FetchingSaved')
const routeforemovingfromsaved = require('./routes/RemovingFromSaved')
const routeforaddingfollowing = require('./routes/AddingFollowing')
const routeforremovingfollowing = require('./routes/RemovingFollowing')
const { connection } = require('./KafkaConnection/KafkaConnection')
const KafkaConsumer = require('./KafkaConnection/KafkaWorker')
const routeforfetchingnotifications = require('./routes/FetchingNotifications')
const morgan = require('morgan')
const routeforprofileupdate = require('./routes/profileUpdate')
const routeforprofilepasswordchange = require('./routes/routeforprofilepasswordchange')
const routeforfetchingartistsforhome = require('./routes/FetchingArtistsForHome')
const routeforfetchingspecificuser = require('./routes/FetchingSpecificUser')
dotenv.config();
if(cluster.isPrimary){
    for(i=0;os>i;i++){
        cluster.fork()
    }

}else{
   const app = express();
   conn(process.env.MONGODBURI)
   app.use(cookieparser())
   app.use(express.json())
   app.use(cors(
    {
        origin:`${process.env.ORIGINURL}`, // Frontend origin
        credentials: true,
    }
   ))
//    app.use(cors(
//     {
//         origin: 'http://localhost:5173', // Frontend origin
//         credentials: true,
//     }
//    ))
   connection()
  // ConnectingKafkaWorker()
//    KafkaConsumer()
app.use(morgan('dev'))
   app.use('/FetchingArtistsForHome',JwtAuth2,routeforfetchingartistsforhome)
   app.use('/FetchingSpecificUser',JwtAuth2,routeforfetchingspecificuser)
   app.use('/profilefetch',JwtAuth,routeforfetchingforuser)
   app.use('/fetchingfollowing',JwtAuth2,routerforfetchingfollowing)
   app.use('/competitionsaved',JwtAuth2,routeforsaving)
   app.use('/fetchingsaved',JwtAuth2,routeforfetchingsaved)
   app.use('/removingsaved',JwtAuth2,routeforemovingfromsaved)
   app.use('/addingfollowing',JwtAuth2,routeforaddingfollowing)
   app.use('/removingfollowing/',JwtAuth2,routeforremovingfollowing)
   app.use('/fetchingnotifications',JwtAuth2,routeforfetchingnotifications)
   app.use('/profileUpdate',JwtAuth2,routeforprofileupdate)
   app.use('/profilePasswordChange',JwtAuth2,routeforprofilepasswordchange)
   app.listen(process.env.PORT,()=>{console.log('Running Profile  Service on Port '+process.env.PORT)})
}