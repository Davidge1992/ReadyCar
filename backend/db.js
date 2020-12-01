const mongoose = require('mongoose');

require('dotenv').config();

const ConnectDB = async () => {

    const db = process.env.DB_NAME;

    try{
        await mongoose.connect(db, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connectado a la DB!')
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = ConnectDB;