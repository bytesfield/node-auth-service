

const userRightPayload = () => {

    const payload = {
        firstname : "Jude",
        lastname : "Udele",
        email : "codeflashtech@gmail.com",
        password : "Abkeys@1993",
        confirm_password : "Abkeys@1993"
    }

    return payload;
    
}

const userWrongPayload = () => {

    const payload = {
        firstname : "Jude",
        lastname : "Udele",
        email : "codeflashtech@gmail.com",
        password : "Abkeys",
        confirm_password : "Abkeys"
    }

    return payload;
    
}

module.exports = {
    userRightPayload,
    userWrongPayload
}