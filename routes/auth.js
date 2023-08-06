/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");


const {
  createUser,
  loginUser,
  revalidateToken,
} = require("../controllers/auth");

router.post("/new", [check("name", "Name is required").not().isEmpty(),
                    check('email','Email is required').isEmail(),
                    check('password','Password must be 6 characters').isLength({min:6}),
                    validarCampos
], createUser);

router.post("/",[check("email","Email is required").isEmail(),
                check("password","Password must be 6 characters").isLength({min:6}),
                validarCampos
            ], loginUser);

router.get("/renew",[validarJWT], revalidateToken);

module.exports = router;
