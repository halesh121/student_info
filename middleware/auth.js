const logininfo=require('../model/logininfo');
const jwt=require('jsonwebtoken');

const auth=async (req,res,next)=>{
    try{
        const tokenheader=req.header('Authorization').replace('Bearer ','');
        const tokenverify=await jwt.verify(tokenheader,process.env.jwt_token_text)
        const user=await logininfo.findOne({'_id':tokenverify._id,'tokens.token':tokenheader})
        if(!user)
        {
            throw new Error('invalid user')
        }
        req.user=user
        next()
    }
    catch(e){
        res.send("please authoticate")
    }
}


module.exports=auth