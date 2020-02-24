const express=require('express')
const Studinfo=require('../model/studentinfo');
const router=new express.Router()
const auth=require('../middleware/auth')
const multer=require('multer')


router.post('/student',auth,async(req,res)=>{
    try{

        const stud=new Studinfo({
            ...req.body,
            userid:req.user._id
        })
        await stud.save()
        res.send(stud)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})
router.get('/student',auth,async(req,res)=>{

    // const match={}
    // // console.log(req.query.address)

    // if(req.query.address)
    // {
    //     const address=await Studinfo.findOne({'address':req.query.address})
    //     match.address=req.query.address===address.address
    // }
// console.log(match)
    await req.user.populate({
        path:'info',
        // match,
        options:{
            limit:parseInt(req.query.limit),
            //    -1 for descending order and 1 is asscending order////
            skip:parseInt(req.query.skip),
            sort:{
             createdAt:1
            }
        }

    }).execPopulate()
    console.log(req.user.info)
    res.send(req.user.info)
   
            // const stud=await Studinfo.find({'userid':req.user._id})
            // res.send(stud)
   
})

router.get('/student/:id',auth,async(req,res)=>{
    try{
        const student=await Studinfo.findOne({_id:req.params.id,'userid':req.user.id})
        if(!student)
        {
            res.status(404).send('not found')
        }
        res.send(student)
    }
    catch(e){
        res.send(e)
    }
})

router.patch('/student/:id',auth,async(req,res)=>{
    const update=Object.keys(req.body)
    const allowedtype=['address','gender','age']
    const verify=update.every((u)=>allowedtype.includes(u))
    try{
        if(!verify)
        {
            res.status(400).send('Invalid column')
        }
        const studupdate=await Studinfo.findOne({_id:req.params.id,'userid':req.user.id})
        if(studupdate)
        {
            update.forEach((u) => {
                studupdate[u]=req.body[u]
            });
            await studupdate.save()
            res.send(studupdate)
        }
        else
        {
            res.status(400).send('invalid id')
        }


    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/student/:id',auth,async(req,res)=>{
    try{
        const studentdelete=await Studinfo.findByIdAndDelete({_id:req.params.id,'userid':req.user.id})
        res.send(studentdelete)
    }
    catch(e){
        res.status(500).send(e)
    }
})



module.exports=router