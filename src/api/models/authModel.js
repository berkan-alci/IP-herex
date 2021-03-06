const mongo = require('../../config/mongo');
const {User} = require('./schema/user');
const mongoose = require ('mongoose');
const { loginValidation } = require('../validation/authValidation');

//Send user data to db
const postUser = async (username, hashedPassword, email, phone) => {
    await mongo().then(async (mongoose) => {
        
        try {
            const response = await User.create({
                username,
                password: hashedPassword,
                email,
                phone
            });

            res.json({status:'ok'});
        } catch (err) {
            if (err.code === 11000) {
                return res.json({status:'error', error:'Username/Email already in use!'});
            }
            throw err;

        } finally {
            mongoose.connection.close();
            console.log('MongoDB connection closed');
        }
    });
};

const getUser = async (res, username, password) => {
    await mongo().then(async (mongoose) => {


        try {
            const { error } = validate(req.body);
            if(error) return res.status(400).send(error.details[0].message);

            const user = await User.findOne({ username }).lean();
            if(!user) return res.json({status:'error', error:'Invalid username/password'});
            

           await loginValidation(username, password);
    
           res.json({status:'ok'});
        } catch (error) {
            res.json({status: 'error', error:'Invalid username/password'});
        } finally {
            mongoose.connection.close();
            console.log('MongoDB connection closed');
        }
    });

    
}


module.exports = {
    postUser,
    getUser

}