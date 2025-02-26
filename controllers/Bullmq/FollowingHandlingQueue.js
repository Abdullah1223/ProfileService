const {Queue} = require('bullmq')
const RedisManager = require('../../RedisConnection/RedisConnection')

const FollowingHandlingQueue = new Queue('followinghandlingqueue',{
    connection:RedisManager
})
module.exports =FollowingHandlingQueue;