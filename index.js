const express = require('express');
const db = require('./config/db');
const bodyParser = require('body-parser');
const companyRoutes = require('./routes/companyRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const {ticketInProgressWarning, deleteFinishedTickets} = require('./CronJob/cronJobs');
require('dotenv').config()

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT , () => {
    console.log('3000 portu aktif');
})
db();

app.use('/', companyRoutes);
app.use('/', departmentRoutes);
app.use('/', ticketRoutes);
app.use('/', authRoutes);

ticketInProgressWarning.start();
deleteFinishedTickets.start();
