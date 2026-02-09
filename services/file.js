const { Food } = require('../models');
const { Op } = require('sequelize');


const isRightExt = async (fileName, extArray) => {
 
    let result = false;

    for (let i=0; i < extArray.length; i++){
        console.log(result)
        if(fileName.endsWith(extArray[i])) result = true;
    
    }

    return result
}

module.exports = {
  isRightExt,
};