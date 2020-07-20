const caluclatetip=(total,tip)=>total+(total*tip)

const fharenate=(temp)=>{
    return (temp-32)/1.8
}
const celsius=(temp)=>{
    return (temp*1.8)+32;
}


module.exports={caluclatetip,fharenate,celsius}