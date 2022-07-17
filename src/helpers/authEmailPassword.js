module.exports = (email, password,code,message)=>{
    if(!password || !email) return {
        error:400,
        message:"password and email are required"
    }
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if(!emailRegex.test(email)) return {
        error:400,
        message:"invalid email"
    }
    return {
        code,
        message
    }

}
