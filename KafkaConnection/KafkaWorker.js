const { consumer } = require("./KafkaConnection");
const KafkaConsumer = async()=>{

  await  consumer.subscribe({topic:'MusicAppNew',fromBeginning:true})
  let bulkOpsChat=[];
  let bulkOpsMessage=[];
  await consumer.run({eachMessage:async({topic,partition,message})=>{
    
    
    // console.log(bulkOpsMessage)   
   
    // console.log(bulkOpsMessage)
  }})
}


module.exports =KafkaConsumer;