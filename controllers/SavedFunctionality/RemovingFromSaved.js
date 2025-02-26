const { producer } = require("../../KafkaConnection/KafkaConnection");
const UserManager = require("../../models/UserSchema");
const RedisManager = require("../../RedisConnection/RedisConnection");

const RemovingFromSaved = async (req, res) => {
    const { _id,genre } = req.params; 
    
    const userid = req.body.user._id; 
     console.log(genre)
    try {
        
        const result = await UserManager.updateOne(
            { _id:userid, "saved._id": _id }, 
            { $pull: { saved: { _id: _id } } } 
        );

        if (result.modifiedCount > 0) {
            const DeletingCache = await RedisManager.del(`${userid}saved`)
            const DeletingSavedList = await RedisManager.del(`${userid}savedlist`)
            const DataForProducing = {
               
                    competition_id:_id,
                    competition_category:genre,
                    type:'SavedRemoved'
            }
            await producer.send({topic:'MusicAppNew',messages:[{value:JSON.stringify(DataForProducing),partition:6}]})
            return res.status(200).json({ message: "ID removed from saved successfully." });

        } else {
            return res.status(404).json({ message: "ID not found in saved." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while removing from saved." });
    }
};

module.exports = RemovingFromSaved;
