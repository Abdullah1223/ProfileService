// const express = require('express')
// const cluster = require('node:cluster')
// const os = require('node:os').availableParallelism()
// const ConnectingKafkaWorker = require('./KafkaConnection/ConnectingKafkaWorker')

// const cors = require('cors')
// const cookieparser =require('cookie-parser')
// const dotenv = require('dotenv')
// const routeforfetchingforuser = require('./routes/FetchingForUser')
// const conn = require('./Connection')
// const JwtAuth = require('./middlewares/JwtAuth')
// const routerforfetchingfollowing = require('./routes/FetchingFollowing')
// const routeforsaving = require('./routes/AddingToSave')
// const JwtAuth2 = require('./middlewares/JwtAuth2')
// const routeforfetchingsaved = require('./routes/FetchingSaved')
// const routeforemovingfromsaved = require('./routes/RemovingFromSaved')
// const routeforaddingfollowing = require('./routes/AddingFollowing')
// const routeforremovingfollowing = require('./routes/RemovingFollowing')
// const { connection } = require('./KafkaConnection/KafkaConnection')
// const KafkaConsumer = require('./KafkaConnection/KafkaWorker')
// const routeforfetchingnotifications = require('./routes/FetchingNotifications')
// const morgan = require('morgan')
// const routeforprofileupdate = require('./routes/profileUpdate')
// const routeforprofilepasswordchange = require('./routes/routeforprofilepasswordchange')
// const routeforfetchingartistsforhome = require('./routes/FetchingArtistsForHome')
// const routeforfetchingspecificuser = require('./routes/FetchingSpecificUser')
// dotenv.config();
// if(cluster.isPrimary){
//     for(i=0;os>i;i++){
//         cluster.fork()
//     }

// }else{
//    const app = express();
//    conn(process.env.MONGODBURI)
//    app.use(cookieparser())
//    app.use(express.json())
//    app.use(cors(
//     {
//         origin:`${process.env.ORIGINURL}`, // Frontend origin
//         credentials: true,
//     }
//    ))
// //    app.use(cors(
// //     {
// //         origin: 'http://localhost:5173', // Frontend origin
// //         credentials: true,
// //     }
// //    ))
//    connection()
//   // ConnectingKafkaWorker()
// //    KafkaConsumer()
// app.use(morgan('dev'))
//    app.use('/FetchingArtistsForHome',JwtAuth2,routeforfetchingartistsforhome)
//    app.use('/FetchingSpecificUser',JwtAuth2,routeforfetchingspecificuser)
//    app.use('/profilefetch',JwtAuth,routeforfetchingforuser)
//    app.use('/fetchingfollowing',JwtAuth2,routerforfetchingfollowing)
//    app.use('/competitionsaved',JwtAuth2,routeforsaving)
//    app.use('/fetchingsaved',JwtAuth2,routeforfetchingsaved)
//    app.use('/removingsaved',JwtAuth2,routeforemovingfromsaved)
//    app.use('/addingfollowing',JwtAuth2,routeforaddingfollowing)
//    app.use('/removingfollowing/',JwtAuth2,routeforremovingfollowing)
//    app.use('/fetchingnotifications',JwtAuth2,routeforfetchingnotifications)
//    app.use('/profileUpdate',JwtAuth2,routeforprofileupdate)
//    app.use('/profilePasswordChange',JwtAuth2,routeforprofilepasswordchange)
//    app.listen(process.env.PORT,()=>{console.log('Running Profile  Service on Port '+process.env.PORT)})
// }



const express = require('express');
const cluster = require('node:cluster');
const os = require('node:os').availableParallelism();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const http = require('http');
const morgan = require('morgan');
const conn = require('./Connection');
const JwtAuth = require('./middlewares/JwtAuth');
const JwtAuth2 = require('./middlewares/JwtAuth2');
const { connection } = require('./KafkaConnection/KafkaConnection');

const routeforfetchingforuser = require('./routes/FetchingForUser');
const routerforfetchingfollowing = require('./routes/FetchingFollowing');
const routeforsaving = require('./routes/AddingToSave');
const routeforfetchingsaved = require('./routes/FetchingSaved');
const routeforemovingfromsaved = require('./routes/RemovingFromSaved');
const routeforaddingfollowing = require('./routes/AddingFollowing');
const routeforremovingfollowing = require('./routes/RemovingFollowing');
const routeforfetchingnotifications = require('./routes/FetchingNotifications');
const routeforprofileupdate = require('./routes/profileUpdate');
const routeforprofilepasswordchange = require('./routes/routeforprofilepasswordchange');
const routeforfetchingartistsforhome = require('./routes/FetchingArtistsForHome');
const routeforfetchingspecificuser = require('./routes/FetchingSpecificUser');

dotenv.config();
const PORT = process.env.PORT || 8001;

if (cluster.isPrimary) {
    for (let i = 0; i < os; i++) {
        cluster.fork();
    }
} else {
    const app = express();
    conn(process.env.MONGODBURI);
    connection();
    
    app.use(cookieParser());
    app.use(express.json());
    app.use(cors({
        origin: process.env.ORIGINURL, // Frontend origin
        credentials: true,
    }));
    app.use(morgan('dev'));
    
    app.use('/FetchingArtistsForHome', JwtAuth2, routeforfetchingartistsforhome);
    app.use('/FetchingSpecificUser', JwtAuth2, routeforfetchingspecificuser);
    app.use('/profilefetch', JwtAuth, routeforfetchingforuser);
    app.use('/fetchingfollowing', JwtAuth2, routerforfetchingfollowing);
    app.use('/competitionsaved', JwtAuth2, routeforsaving);
    app.use('/fetchingsaved', JwtAuth2, routeforfetchingsaved);
    app.use('/removingsaved', JwtAuth2, routeforemovingfromsaved);
    app.use('/addingfollowing', JwtAuth2, routeforaddingfollowing);
    app.use('/removingfollowing', JwtAuth2, routeforremovingfollowing);
    app.use('/fetchingnotifications', JwtAuth2, routeforfetchingnotifications);
    app.use('/profileUpdate', JwtAuth2, routeforprofileupdate);
    app.use('/profilePasswordChange', JwtAuth2, routeforprofilepasswordchange);
    
    // Load SSL certificate files (replace with actual paths)
    const privateKey = fs.readFileSync('/path/to/private-key.pem', 'utf8');
    const certificate = fs.readFileSync('/path/to/certificate.pem', 'utf8');
    const ca = fs.readFileSync('/path/to/ca.pem', 'utf8');
    
    const credentials = { key: privateKey, cert: certificate, ca: ca };
    
    // Create an HTTPS server
    https.createServer(credentials, app).listen(PORT, () => {
        console.log(`HTTPS server is running on port ${PORT}`);
    });
}

// HTTP to HTTPS redirect
http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80, () => {
    console.log('HTTP server is redirecting to HTTPS on port 80');
});
