const {createPool} = require("mysql")
const pool = createPool({
    host:process.env.DBHOST,
    user:process.env.DBUSER,
    password:process.env.DBPASS,
    database:process.env.DBNAME
})
pool.getConnection((err)=>{
    if(err) throw err
    else console.log("Conected to the database")
})
module.exports = pool
