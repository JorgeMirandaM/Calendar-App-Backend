const express= require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors= require('cors');


//Create the express server
const app=express();

// Database
dbConnection();

// CORS
app.use(cors());

//Public directory
app.use(express.static('public'));

//Reading and parsing the body
app.use(express.json());


//Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));


//Listen requests
app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})