const {response}=require('express');
const jwt=require('jsonwebtoken');

const validarJWT=(request,response=response,next)=>{

    const token=request.header('x-token');
    if(!token){
        return response.status(401).json({
            ok:false,
            msg:'No hay token en la petición'
        });
    }
    
    try{

        const payload=jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        request.uid=payload.uid;
        request.name=payload.name;

    }catch(error){
        return response.status(401).json({
            ok:false,
            msg:'Token no valido'
        });
    }


    next();

}

module.exports={
    validarJWT
}