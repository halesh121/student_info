const Login=require('../model/logininfo')
const express=require('express')
const router=new express.Router();
const auth=require('../middleware/auth')
/////////resize and converter etc.. modle sharp///////////////////
const sharp=require('sharp')
const multer=require('multer');

/**@swagger 
 * 
*/

router.post('/user',async(req,res)=>{
    // console.log(req.body)
    const s = new Login(req.body); 
    try{
        
   
        
        await s.save()
        const token=await s.generateAuthtoken()
            console.log(token)
        res.send({s,token})


    }
    catch(e){
       
        res.send(e)
    }
    
})

router.post('/user/login',async(req,res)=>{

    

    try{

        const user=await Login.findByCredinatilas(req.body.username,req.body.password)
        const token=await user.generateAuthtoken()
        res.send({user,token})
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

router.post('/user/logout',auth,async(req,res)=>{

    try{
            req.user.tokens=req.user.tokens.filter((t)=>{
                t.token!==req.token
            })
            await req.user.save()
            res.send(req.user)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})

router.get('/user',auth,async(req,res)=>{
    // console.log('hello')
    try{
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/user/:id',auth,async(req,res)=>{
    
    const update=Object.keys(req.body);
    const allowedtype=['username','password'];
    const verifycolumn=update.every((u)=>allowedtype.includes(u))
    // console.log(update)

    try{
        if(!verifycolumn)
        {
            // throw new Error('invalid Column')
            res.status(500).send('invalid column')
        }
            // const user=await Login.findById({_id:req.params.id})
            // if(!user)
            // {
            //     throw new Error("user not found")
            // }
            update.forEach((e)=>{
                req.user[e]=req.body[e]
            })
            await req.user.save()
            res.send(req.user)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }

})
router.delete('/user',auth,async(req,res)=>{
    try{

        req.user.remove()
            // const user=await Login.findByIdAndDelete({_id:req.params.id})
            // await req.user.save();
            res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)

    }
})

const uploadimage=multer({
    // dest:'avatar',////////destination folder for image store by localy
    limits:{
        filter:10000

    },
    fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            {
                return cb(new Error('except only jpg, jpeg,png extension'))
            }
            cb(undefined,true)
    }

})

router.post('/user/upload',auth,uploadimage.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:259,height:500}).png().toBuffer();
    req.user.image=buffer
    await req.user.save()
    res.send()
    
},(error,req,res,next)=>{
   
        res.status(400).send({'error':error.message})
    
})

router.delete('/user/uploaddelete',auth,async(req,res)=>{
    req.user.image=undefined
    await req.user.save();
    res.send()
})

router.get('/user/:id/avatar',async(req,res)=>{
    const user=await Login.findById(req.params.id)
    if(!user || !user.image)
    {
        throw new Error("no profile pic found")
    }

    res.set('Content-type','image/png')
    res.send(user.image)
})

module.exports=router
