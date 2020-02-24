const express=require('express')
require('../db/mongoose')
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui=require('swagger-ui-express');
const login=require('../model/logininfo')
const loginrouter=require('../router/login')
const studentrouter=require('../router/studentinfo')
// const swaggerOption=require('./swagger.js')
const auth=require('../middleware/auth')
// const PORT=require('../config/dev.env')



const app=express()
const Port=process.env.PORT


const swaggerDefinition = {
    openapi: '3.0.1', // YOU NEED THIs
    info: {
      title: 'Student Information',
      version: '1.0.0',
      description: 'student information with created user',
    },
    host: 'localhost:4005',
    basePath: '/',
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            
          }
        }
      },
      security: [{
        bearerAuth: []
      }]
  };

  console.log(auth.tokenheader);

  const swaggerOption={
      swaggerDefinition,
      apis:['.router/*.js'],
  }
const swaggerDocs = swaggerjsdoc(swaggerOption);
app.get('/swagger.json',(req,res)=>{
    res.setHeader('Content-Type','application/json')
    res.send(swaggerDocs)
})
app.use("/api-docs",swaggerui.serve,swaggerui.setup(swaggerDocs));

app.use(express.json());
app.use(loginrouter)
app.use(studentrouter)

app.listen(Port,()=>console.log(`listen port ${Port}`))