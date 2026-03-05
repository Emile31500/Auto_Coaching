const { Measurment } = require('../models');

const isMoreThenAWeekDifference = async (user) => {

    const isThereMeasurmentsCst = await isThereMeasurments(user)

    if (isThereMeasurmentsCst) {

        const lastMeasurment = await Measurment.findOne({
            order: [['createdAt', 'DESC']],
            where : {
                userId : user.id,
            }
        })

        if (lastMeasurment instanceof Measurment) {

            const dateLastMeasurment = new Date(lastMeasurment.createdAt)
            dateLastMeasurment.setHours(0, 0, 0, 0);
            const toDay = new Date()
            toDay.setHours(0, 0, 0, 0);
            const isMoreThenAWeekDifferenceConst =  Math.abs(toDay - dateLastMeasurment) >= (7 * 24 * 60 * 60 * 1000);
            return isMoreThenAWeekDifferenceConst;

        } else {
            return false;
        }

    } else {
        return false;
    }
};

const isThereMeasurments = async (user) => {

    const measurments = await Measurment.findAll({
        where : {
            userId : user.id,
        }
    })

    return measurments.length > 0
};


module.exports = {
  isMoreThenAWeekDifference,
  isThereMeasurments
};