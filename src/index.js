const path = require("path")
const express = require("express")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
require("dotenv").config({
    path:"./.env"
})
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

//cors
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials',false);
    next();
});

// midellwares 
app.use(cors())
app.use("/public",express.static(path.join(__dirname,"/public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))
app.use(cookieParser())

//routes
app.use("/api",require("./routes/index"))

app.listen(PORT,()=>console.log(`Application running in http://localhost:${PORT}`))
