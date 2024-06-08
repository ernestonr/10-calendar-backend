const {Router}=require('express');
const {check}=require('express-validator');
const {getEventos, crearEventos, actualizarEventos, eliminarEventos}=require('../controllers/events');
const {validarJWT}=require('../middlewares/validar-jwt');
const {validarCampos}=require('../middlewares/validar-campos');
const {isDate}= require('../helpers/isDate');

const router=Router();

//Todas tienen  que pasar por la validación del token

router.use(validarJWT);//* si aplica el middleware para todas las rutas

//obtener eventos
router.get("/", getEventos)

//crear un nuevo evento
router.post('/',
[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom(isDate),
    check('end','Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
],
crearEventos);


//actualizar evento
router.post('/:id',

[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom(isDate),
    check('end','Fecha de finalización es obligatoria').custom(isDate),
    validarCampos
],
actualizarEventos);

//borrar evento
router.delete('/:id',eliminarEventos);

module.exports=router;