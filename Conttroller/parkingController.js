
const ParkingModel = require('../Model/parkingModel');


exports.create = async (req, res) => {
    try {
        var date = new Date()
        console.log(date.toString());

        const { numPlate, ownerName, phoneNo } = req.body
        // console.log(owner);
        const registerCar = await ParkingModel.findOne({ numPlate: numPlate })
        if (registerCar) {
            return res.status(400).json({ statusCode: 0, error: 'Car Already Exist' })
        }

        else {
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

            const exceedData = await ParkingModel.find({ "createdAt": { $gte: new Date(`${firstDay} 00:00:00`), $lte: new Date(`${lastDay} 00:00:00`) } }).lean()
            if (exceedData.length >= 100) return res.status(400).json({ statusCode: 0, message: 'Car Limit Reached' })
            else {
                let newCar = new ParkingModel({
                    numPlate: numPlate,
                    owner: ownerName,
                    phoneNo: phoneNo,
                    carStatus: 0,
                    time: date.toString()
                })
                newCar = await newCar.save();
                return res.json({
                    statusCode: 1,
                    message: "New Car Added Succesfully",
                })
            }
        }
    } catch (error) {
        console.log(error);
    }




};


exports.getParkingCar = async (req, res) => {

    const parkingData = await ParkingModel.find().lean()
    if (!parkingData) {
        return res.status(400).json({ error: 'An Error Occured' })
    }
    else {
        return res.status(200).json({
            statusCode: 1,
            message: "Success",
            result: parkingData,
        });

    }

    // res.json({message: 'See your server console'});
};




exports.CreatCarParking = async (req, res) => {

    try {

        const { carId, carStatus } = req.body

        const parkingData = await ParkingModel.findOne({ _id: carId }).lean()
        if (!parkingData) {
            return res.status(400).json({ error: 'No Car Found' })
        }
        if (parkingData) {
            //check the days of registeration
            var date = new Date(parkingData.time)
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
            const net = new Date(lastDay)

            let difference = net.getTime() - date.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

            if (TotalDays >= 30) {

                await ParkingModel.findByIdAndDelete(carId)

                return res.json({
                    statusCode: 1,
                    message: "Car Didn't Register Kindly Register Again",
                })
            }
            else {
                await ParkingModel.findOneAndUpdate({ _id: carId }, {
                    carStatus
                })

                if (carStatus === 0) return res.json({
                    statusCode: 1,
                    message: "Car Out Succesfully",
                })
                else {
                    return res.json({
                        statusCode: 1,
                        message: "Car Parked IN Succesfully",
                    })
                }
            }
        }
    } catch (err) {
        return res.status(400).json({ msg: err.message })
    }
};
