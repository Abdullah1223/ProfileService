const { producer } = require("../../KafkaConnection/KafkaConnection");
const UserManager = require("../../models/UserSchema");
const RedisManager = require("../../RedisConnection/RedisConnection");

const AddingToSaved = async (req, res) => {
  console.log('Adding To SAVE hit');
  const { _id } = req.body;
  const currentuserid = req.body.user._id
  const {category}=req.body
 
  if (_id == null && data == null) {
    return res.status(404).send("No Id For This Competition Found Or User is Logged Out");
  }

  try {
    // Retrieve the user document first
    const user = await UserManager.findOne({ _id: currentuserid }).select('saved');
    console.log(user)
    // Check if the competition is already saved
    const isAlreadySaved = user.saved.some(item => item._id.toString() === _id.toString());
       console.log(isAlreadySaved)
    if (!isAlreadySaved) {
      // If not already saved, perform the update
      user.saved.push({ _id: _id });
      await user.save();
      const DeletingCache = await RedisManager.del(`${currentuserid}saved`)
      const DataForProducing = {
        competition_id:_id,
        competition_category:category,
        type:'Saved'
      }
      const DeletingSavedList = await RedisManager.del(`${currentuserid}savedlist`)
      await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DataForProducing),partition:6}]})
    }
    
    res.status(200).send(user);  // Send back the updated user
  } catch (err) {
    console.error(err);
    res.status(500).send("Database operation failed");
  }
};

module.exports = AddingToSaved;
