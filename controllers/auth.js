const express=require('express');
const Usuario=require('../models/Usuario');
const bcryptjs=require('bcryptjs');
const {generarJWT}= require('../helpers/jwt');

const crearUsuario = async(request,response=express.response)=>{ //! por el intelliense   

    const {email,password}=request.body;
    try{


        let usuario=await Usuario.findOne({email});
        if(usuario){
            return response.status(400).json({
                ok:false,
                msg:'Un usuario existe con ese correo'
            });
        }

        usuario=new Usuario(request.body);

        //!Encriptar contraseña
        const salt=bcryptjs.genSaltSync();
        usuario.password=bcryptjs.hashSync(password,salt);

        await usuario.save();

        //*Listo para generar el JWT
        const token=await generarJWT(usuario.id,usuario.name);

        return response.status(201).json({
            ok:true,
            msg:'registro',
            uid:usuario.id,
            name: usuario.name,
            token
        });
    }catch(error){
        console.log(error);
        return response.status(500).json({
            ok:false,
            msg:'Pongase en contacto con el administrador de la BD'
        });
    }
    
}

const loginUsuario= async(request,response=express.response)=>{
    
    const {email,password}=request.body;

    try{

        const usuario=await Usuario.findOne({email});
        if(!usuario){
            return response.status(400).json({
                ok:false,
                msg:'El usuario no existe con ese email'
            });
        }

        //! Confirmar los password
        const validPassword= bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return response.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            });
        }

        //*Listo para generar el JWT
        const token=await generarJWT(usuario.id,usuario.name);

        return response.json({
            ok:true,
            name:usuario.name,
            uid:usuario.id,
            token
        })

    }catch(error){
        console.log(error);
        return response.status(500).json({
            ok:false,
            msg:'Pongase en contacto con el administrador de la BD'
        });
    }
}


const revalidarToken= async(request,response=express.response)=>{

    const uid=request.uid;
    const name=request.name;

    const token=await generarJWT(uid,name);
    
    return  response.json({
        ok:true,
        token
    });
}

module.exports={
    crearUsuario,
    loginUsuario,
    revalidarToken
}