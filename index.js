const express=require('express');
const app = express();
const cors=require('cors');

require("dotenv").config();

app.use(cors())

const port=process.env.PORT || 3000;

const blogsRoutes=require("./routes/user.routes");

const mongoose=require("mongoose");

app.use(express.json());
app.use('/v1',blogsRoutes)

mongoose.connect("mongodb://127.0.0.1:27017/MyData").then((successConnection)=>{
    console.log("connected to database")
}).catch((errorConnection)=>{
    console.log(errorConnection)
})

app.listen(port,()=>{
console.log(`Server is running on port ${port}`)
})