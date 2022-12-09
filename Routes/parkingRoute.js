const express = require('express')

const router = express.Router()

//Import Controllers

const { create,getParkingCar,CreatCarParking } = require('../Conttroller/parkingController')
router.post('/post', create);
router.get('/getParkingCar', getParkingCar);
router.post('/updateCarStatus', CreatCarParking);




module.exports = router;