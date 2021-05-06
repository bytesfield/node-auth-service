

const createUser = () => {

    const payload = {
        firstname : "Jude",
        lastname : "Udele",
        email : "codeflashtech@gmail.com",
        password : "Abkeys@1993",
        confirm_password : "Abkeys@1993"
    }

    

    return payload;
    
}


module.exports = {
    createUser
}