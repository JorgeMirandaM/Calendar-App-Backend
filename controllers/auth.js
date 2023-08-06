const { response } = require("express");
const bcrypt= require('bcryptjs');
const User = require("../models/User");
const {generarJWT}= require('../helpers/jwt');
const jwt= require('jsonwebtoken');

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {

    let user= await User.findOne({email});

    if(user){
        return res.status(400).json({
            ok:false,
            msg:'User already exists'
        })
    }

    
    user = new User(req.body);

    //Encrypt password
    const salt=bcrypt.genSaltSync();
    user.password=bcrypt.hashSync(password, salt);

    await user.save();

    //Generate the token
    const token=await generarJWT(user.id, user.name)

    res.json({
        ok:true,
        uid:user.id,
        name: user.name,
        token
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please talk with the admin",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {

    const user= await User.findOne({email});

    if(!user){
        return res.status(400).json({
            ok:false,
            msg:'The user does not exist'
        })
    }

    //Confirm the passwords
    const validPassword= bcrypt.compareSync(password,user.password);

    if (!validPassword){
        return res.status(400).json({
            ok:false,
            msg:'Invalid password'
        })
    }

    //Generate the token
    const token=await generarJWT(user.id, user.name)

    res.json({
        ok:true,
        uid:user.id,
        name: user.name,
        token
    })
    
  } catch (error) {
    res.status(500).json({
        ok: false,
        msg: "Please talk with the admin",
      });
  }

  
};

const revalidateToken = async (req, res = response) => {

  const uid= req.uid;
  const name=req.name;

  //Generate other token
  const token=await generarJWT(uid, name)

  res.json({
    ok: true,
    uid,
    name,
    token
  });
};

module.exports = { createUser, loginUser, revalidateToken };
