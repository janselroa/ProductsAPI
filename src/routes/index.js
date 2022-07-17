const {Router} = require("express")
const router = Router()
const authEmailPassword = require("../helpers/authEmailPassword")  
const pool = require("../db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.post("/register",async (req,res)=>{
    try{
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name
        const code = authEmailPassword(email,password,201,"new user!")
        if(!email || !password || !name) return res.json({error:"es necesario name, email, password"})

        if(code>=400) return res.status(code.error).json(code)
        const passwordHash = await bcrypt.hash(password,8)
        pool.query("INSERT INTO users SET ?",{email, password:passwordHash,name, role:"user"},(err)=>{
            if(err) throw err
            else res.status(code.code).json(code)
        })
    }catch(err){
        console.error(err)
    }
})

router.post("/login",(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const code = authEmailPassword(email, password,200,"Usuario autorizado")
    if(code>=400) return res.status(code.error).json(code)
    pool.query("select * from users where email = ?",[email],async(err,result)=>{
        // errors verify
        if(err) throw error
        if(!result.length>0) return res.status(401).json({error:401,message:"Usuario no encontrado"})
        if(!await bcrypt.compare(password,result[0].password)) return res.status(401).json({
            error:401,message:"the password does not match"
        })

        //return token to the user
        jwt.sign({id:result[0].id},process.env.secretKey,(err,token)=>{
            if(err) throw err
            else res.send({
                    token
            })
        })
    })
})

router.get("/profile",(req,res)=>{
    const {authorization} = req.headers
    if(!authorization) return res.status(400)
    jwt.verify(authorization,process.env.secretKey,(err,authData)=>{
        if(err) throw err
        pool.query("select * from users where id = ?",[authData.id],(err,result)=>{
            if(err) throw err
            res.send(`Hola ${result[0].name}`)
        })
    })
})
router.all("/products",(req,res,next)=>{
    console.log(req.headers)
    if(!req.headers.authorization) return res.sendStatus(401)
    jwt.verify(req.headers.authorization,process.env.secretKey,(err,authData)=>{
        if(err) return res.status(401).json({
            error:401,
            message:"invalid token"
        })
        else pool.query("select id from users where id = ?",[authData.id],(err,resuls)=>{
            if(resuls.length==0) return res.sendStatus(401)
            else {
                req.userId = authData.id
                next()
            }
        })
    })
})
router.get("/products",(req,res)=>{
    pool.query("select * from products",(err,results)=>{
        if(err) throw err
        else res.json(results)
    })
})

router.post("/products",(req,res)=>{
    const {name, maker, inventory,price, category,images} = req.body
    pool.query("INSERT INTO products SET ?",{name,maker,inventory,price,category,images,seller_id:req.userId},(err)=>{
        if(err) throw err
        else res.status(201).json({succes:"New product created successfully"})
    })
})

router.delete("/products",(req,res)=>{
    console.log(req.id)
    const productsId = req.params.id || req.body.id
    if(!productsId) return res.sendStatus(400)
    pool.query("select * from products where id = ?",[productsId],(err,result)=>{
        if(result.length==0) return res.status(400).json({error:400,message:"product not found"})
        
        if(result[0].seller_id!=req.userId) return res.status(401).json({error:401,message:"Your user was not the creator of this product"})

        pool.query("delete from products where id = ?",[productsId])
        res.status(200).json({
            code:200,
            message:"The product has been removed successfully"
        })
    })
    
})

module.exports = router
