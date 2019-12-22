const UserModel = require('../../models/user');

const registeration = (req,res)=>{
    const user = req.body;
    console.log(user);
}

module.exports={
    registeration
}
