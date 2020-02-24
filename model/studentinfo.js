const mongoose=require('mongoose')


const studentschema=new mongoose.Schema({
    address:{
        type:String,
        require:true,
        trim:false
    },
    gender:{
        type:String,
        require:true       
    },
    age:{
        type:Number,
        require:true
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'logininfo'
    }
},{
    timestamps:true
})


const student=mongoose.model('studentinfo',studentschema)
module.exports=student;