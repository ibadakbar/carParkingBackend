const mongoose = require('mongoose')
// const { ObjectId } = mongoose.Schema

const ParkingSchema = new mongoose.Schema({
    numPlate: {
        type: String,
        // trim: true,
        // min: 3,
        // max: 160,
        required: true
    },
    owner: {
        type: String,
        // unique: true,
        // index: true,
        // lowercase: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    carStatus: {
        type: Number,
        // required: true
    },
    time: {
        type: String,
        // required: true
    },


}, { timestamps: true });

module.exports = mongoose.model('ParkingSchema', ParkingSchema); 