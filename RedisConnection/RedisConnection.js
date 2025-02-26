 const Redis = require('ioredis')
 const dotenv = require('dotenv')
dotenv.config();
const RedisManager = new Redis({maxRetriesPerRequest: null },
        {
                retryStrategy(times) {
                       const delay = Math.min(times * 50, 2000);
                       return delay;
                     },
            },
            process.env.REDIS_URI
        // 'rediss://default:AVNS_xvg1g5mw1124APDNcD7@caching-197552da-normalcsgo21-4cff.e.aivencloud.com:28221'
//         {
//         port:15933,
//         host:'redis-15933.c334.asia-southeast2-1.gce.redns.redis-cloud.com',
//         username:'default',
//         password:'Ke91uSFazEiqq4J0sXmVGhPg4PNYEtEt'
// }
)
module.exports= RedisManager;

