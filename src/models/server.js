require('colors');
const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');

const planRouter = require('../routes/plan');
const memoryRouter = require('../routes/memory');
const userRouter = require('../routes/user');


class Server{
    constructor( port ){
        this.port = port;
        this.app = express();
        this.config();
        this.routes();
    }
    config(){
        this.app.use( bodyParser.urlencoded({ extended: false }) );
        this.app.use( bodyParser.json() );
    }
    async cnnConnect(){
       await mongoose.connect( process.env.MONGO_CNN )
       console.log('DB: ' + '*'.green); 
    }
    routes(){
        this.app.use( '/plan', planRouter );
        this.app.use( '/memory', memoryRouter );
        this.app.use( '/user', userRouter)
    }
    listen(){
        this.app.listen( this.port, async() => {
            console.log('SV: ' + '*'.green); 
            await this.cnnConnect();
            console.log('APP: ' + '*'.green); 

        });
    }
}


module.exports = Server;