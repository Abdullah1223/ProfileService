// const UserManager =require('../../models/UserSchema');
// const FetchingFollowing = require('./FetchingFollowing');
// const FetchingArtistsForHome = async(req,res)=>{
//   const currentuserid = req.body.user?._id;
//    let FollowingList;
//    let ArtistData;
//    const RedisPipeline =  RedisManager.Pipeline()
//    const CheckingForFollowingListCache = await RedisManager.get(`${currentuserid}:followinglist`)  
//    if(CheckingForFollowingListCache!=null){
//     const parsing = JSON.parse(CheckingForFollowingListCache)
//     FollowingList = parsing;
//    }else{ 
//   const FetchingFollowingList = await UserManager.findOne({_id:currentuserid}).select('following.user')
//   RedisPipeline.set(`${currentuserid}:followinglist`,JSON.stringify(FetchingFollowingList.following))
//   FollowingList = FetchingFollowingList.following
//   }

//   const CheckingForArtistsCache=await RedisManager.get(`ArtistDataForHome`)
//   if(CheckingForArtistsCache!=null){
//     const parsing = JSON.parse(CheckingForArtistsCache)
//     await RedisPipeline.exec()
//     ArtistData = parsing
//     return res.status(200).send({FollowingList,ArtistData})
//   }
//   const FetchingArtists = await UserManager.find({role:'artist'})
//   .sort({createdate:-1})
//   .select('name avatar description role username')
//   .limit(4)
//    ArtistData=FetchingArtists; 
//   if(FetchingArtists.length<0){
//     return res.status(404).send({Message:'Nothing Found'})
//   }
//   RedisPipeline.set('ArtistDataForHome',JSON.stringify(ArtistData),'EX',400)
//   await RedisPipeline.exec()
//  return res.status(200).send({FollowingList,ArtistData})

//   //LATER WEHAVE TO FETCH ARTIST BASED ON THEIR RANK 



// }

// module.exports = FetchingArtistsForHome;


const UserManager = require('../../models/UserSchema');
const RedisManager = require('../../RedisConnection/RedisConnection');
//const RedisManager = require('../../RedisConnection/RedisManager');

const FetchingArtistsForHome = async (req, res) => {
  try {
    const currentUserId = req.body.user?._id;
    const redisPipeline = RedisManager.pipeline();

    // Fetch following list and artist cache concurrently
    const [followingCache, artistCache] = await Promise.all([
      RedisManager.get(`${currentUserId}:followinglist`),
      RedisManager.get('ArtistDataForHome')
    ]);

    let FollowingList = followingCache ? JSON.parse(followingCache) : null;
    let ArtistData = artistCache ? JSON.parse(artistCache) : null;

    // If both caches exist, return response immediately
    if (FollowingList && ArtistData) {
      return res.status(200).send({ FollowingList, ArtistData });
    }

    // If following list cache is missing, fetch from DB
    const followingPromise = FollowingList
      ? Promise.resolve(FollowingList)
      : UserManager.findOne({ _id: currentUserId })
          .select('following.user')
          .then((data) => {
            if (data) {
              const following = data.following;
              redisPipeline.set(`${currentUserId}:followinglist`, JSON.stringify(following));
              return following;
            }
            return [];
          });

    // If artist data cache is missing, fetch from DB
    const artistPromise = ArtistData
      ? Promise.resolve(ArtistData)
      : UserManager.find({ role: 'artist' })
          .sort({ createdate: -1 })
          .select('name avatar description role username')
          .limit(4)
          .then((artists) => {
            if (artists.length === 0) {
              throw { status: 404, message: 'Nothing Found' };
            }
            redisPipeline.set('ArtistDataForHome', JSON.stringify(artists), 'EX', 400);
            return artists;
          });

    // Execute both DB queries in parallel
    [FollowingList, ArtistData] = await Promise.all([followingPromise, artistPromise]);

    // Execute Redis pipeline updates
    if (!followingCache || !artistCache) {
      await redisPipeline.exec();
    }

    return res.status(200).send({ FollowingList, ArtistData });
  } catch (error) {
    return res.status(error.status || 500).send({ Message: error.message || 'Internal Server Error' });
  }
};

module.exports = FetchingArtistsForHome;
