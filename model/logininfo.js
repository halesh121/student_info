const mongoose=require('mongoose');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs');
const STUDINFO=require('../model/studentinfo')

const Valditor=require('validator')


/**
 * @swagger
 * definition:
 * user:
 * type:object
 * properties:
 * username:
 * type:String
 * password:
 * type:string
 * image:
 * type:Buffer
 * tokens:
 * type:array
 *timpestamp:true
 * required:
 * -username
 * -password
 */

const loginschema= mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        validtor(v){
        if(v.length > 3){
                throw new Error("password greater then  1 character")
        }
    }
    },
    image:{
        type:Buffer
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
},{
    timestamps:true
})

loginschema.virtual('info',{
    ref:'studentinfo',
    localField:'_id',
    foreignField:'userid'
})

loginschema.methods.toJSON= function()
{
    const user=this

    const userobject=user.toObject()

    delete userobject.password
    delete userobject.tokens
    delete userobject.image
    return userobject
}

loginschema.methods.generateAuthtoken=async function(){

//    return console.log("token")
    const usertoken=this
    const token=jwt.sign({_id:usertoken._id.toString()},process.env.jwt_token_text)

    usertoken.tokens=usertoken.tokens.concat({token})
    await usertoken.save()
    return token
}
loginschema.statics.findByCredinatilas=async (username,password)=>{
 
    const user1=await user.findOne({username})
    if(!user1)
    {
        throw new Error("invalid uername")
    }
    const ispass=await bcrypt.compare(password,user1.password)
    if(!ispass)
    {
        throw new Error("invalid password")
    }
    return user1

}

loginschema.pre('save',async function(next){
    // return console.log("hi")
    const user1=this
    if(user1.isModified('password')){
        user1.password=await bcrypt.hash(user1.password,8)
        next()
    }
})
loginschema.pre('remove',async function(next){
    const use12=this
    const deleteuser=await STUDINFO.deleteMany({'userid':user12.id})
        next()
})
const user=mongoose.model('logininfo',loginschema)

module.exports=user