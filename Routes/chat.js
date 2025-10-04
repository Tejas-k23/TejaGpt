import express from "express";
import Thread from "../Models/Thread.js";
import getOpenAIResponse from "../util/openai.js";
const router=express.Router();
router.post("/test",async(req,res)=>{
    try{
    const thread= new Thread({
        threadId:"as8d",
        title:"mydata41"
    });
    const response = await thread.save();
    res.send(response);
}catch(err){
    console.log(err);
    res.status(500).json(err,"Failed to save in db")
}
});


router.get("/thread",async(req,res)=>{
    try
    {const threads= await Thread.find({}).sort({updatedAt:-1});
    res.json(threads);}catch(err){
        console.log(err);
        res.status(500).json({err:"failed to fetch details"});
    }

})
router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
    const thread= await Thread.findOne({threadId});
     if(!thread){
        res.status(404).json({err:"Thread not found"});

    }
    res.json(thread.messages);}catch(err){
    console.log(err);
    res.status(500).json(err,"Failed to save in db")
}
})

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
    const deletedThread=await Thread.findOneAndDelete({threadId});
    if(!deletedThread){
        res.status(404).json({err:"Thread not found"});

    }
    res.status(200).json({success:"deleted succssesfully"});}catch(err){
    console.log(err);
    res.status(500).json(err,"Failed to save in db")
}
})

router.post("/chat",async(req,res)=>{

    const {threadId,messages}=req.body;
    if(!threadId|| !messages){
        res.status(400).json({error:"threadId and messages are required"});
    }
    try{
        let thread=await Thread.findOne({threadId});
        if(!thread){
            thread=new Thread({
                threadId,
                title:messages,
                messages:[{role:"user",content:messages}]
            });
        }else{
            thread.messages.push({role:"user",content:messages});
        }
        const assistantReply= await getOpenAIResponse(messages);
        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt=Date.now();
        await thread.save();
        res.json({reply:assistantReply});
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Failed to process chat"});
    }
})
export default router;