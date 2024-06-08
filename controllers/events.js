const express=require('express');
const Evento=require('../models/Evento');


const getEventos=async(request,response=express.response)=>{

    const eventos= await Evento.find()
    .populate('user','name password');//!sin condiciones es traerse todos

    return response.status(200).json({
        ok:true,
        msg:'obtener eventos getEventos',
        eventos
    });
}

const crearEventos=async(request,response=express.response)=>{

    //verificar que tenga el evento
    const evento= new Evento(request.body);

    try{
        evento.user=request.uid;
        const eventoGuardado=await evento.save();

        return response.status(200).json({
            ok:true,
            evento: eventoGuardado
        });

    }catch(error){
        console.log(error);
        return response.status(500).json({
            ok:false,
            msg:'Hable con el administrador de la BD'
        });
    }

}

const actualizarEventos=async(request,response=express.response)=>{

    const eventoId=request.params.id;
    const uid=request.uid;

    try{

        const evento=await Evento.findById(eventoId);

        if(!evento){
            return response.status(400).json({
                ok:false,
                msg:'El evento no existe con ese id'
            });
        }

        if(evento.user.toString()!==uid){
            return response.status(401).json({
                ok:false,
                msg:'No tiene privilegios para editar este evento'
            });
        }

        const nuevoEvento={...request.body,user:uid};

        const eventoActualizado= await Evento.findByIdAndUpdate(eventoId, nuevoEvento,{new:true});//! el tercer parámetro es para que te retorne siempre el nuevo no el anterior.

        return response.status(200).json({
            ok:true,
            evento:eventoActualizado
        });

    }catch(error){
        console.log(error);
        return response.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }

}

const eliminarEventos=async(request,response=express.response)=>{

    const eventoId=request.params.id;
    const uid=request.uid;

    try{

        const evento=await Evento.findById(eventoId);

        if(!evento){
            return response.status(400).json({
                ok:false,
                msg:'No existe evento para eliminar'
            });
        }

        if(evento.user.toString()!==uid){
            return response.status(401).json({
                ok:false,
                msg:'No tiene privilegios para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);

        return response.status(200).json({
            ok:true
        });


    }catch(error){
        return response.status(500).json({
            ok:false,
            msg:'Pongase en contacto con el administrador de la BD'
        });
    }

}

module.exports={
    getEventos,
    crearEventos,
    actualizarEventos,
    eliminarEventos
}