
/*
    Rutas de Eventos
    /api/events
*/

const {Router}= require('express');
const router= Router();
const { validarCampos } = require("../middlewares/validar-campos");
const {validarJWT}= require('../middlewares/validar-jwt');

const {getEvents,createEvent,updateEvent,deleteEvent} = require('../controllers/events');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

router.use(validarJWT);

//Get events
router.get('/',getEvents);

//Create a new Event
router.post('/',[

    check('title','the title is required').not().isEmpty(),
    check('start','Initial date is required').custom(isDate),
    check('end','Finish date is required').custom(isDate),
    validarCampos
],createEvent);

//Update Event
router.put('/:id',[

    check('title','the title is required').not().isEmpty(),
    check('start','Initial date is required').custom(isDate),
    check('end','Finish date is required').custom(isDate),
    validarCampos
],updateEvent);

//Delete Event
router.delete('/:id',deleteEvent)

module.exports=router;