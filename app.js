const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user');

const app = express();

require('dotenv').config({ path: './config/.env' });

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use('/user', userRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running.`)
})