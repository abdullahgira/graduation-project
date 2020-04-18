const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

const morgan = require('morgan');
const winston = require('./config/winston');

require('make-promises-safe');
require('express-async-errors');
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
    mongoose
        .connect(process.env.MLAB_DB, {
            auth: {
                user: process.env.MLAB_USER,
                password: process.env.MLAB_PASSWORD
            },
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(() => winston.info('Connected to MongoDB...'))
        .catch(err => winston.error('Couldn\'t connect to MongoDB... ', err));
} else {
    mongoose
        .connect(process.env.DEV_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        .then(() => winston.info('Connected to MongoDB...'))
        .catch(err => winston.error('Couldn\'t connect to MongoDB... ', err));
}

const app = express();

app.use(helmet());

app.use(morgan('combined', { stream: winston.stream }));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/user', require('./api/UserController'));
app.use('/api/student', require('./api/StudentController'));
app.use('/api/group', require('./api/GroupController'));
app.use('/api/video/playground/', require('./api/VidoPlayground'));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    winston.error(`${err.statusCode || 500} - ${err.name}: ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.statusCode || 500).json({ error: `${err.message}` });
});

app.use((req, res, next) => { // eslint-disable-line no-unused-vars
    const ERR_MSG = `NotFound: there is no handler for this url`;
    winston.error(`404 - ${ERR_MSG} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(404).json({ error: ERR_MSG });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => winston.info(`Listening on port ${PORT}`));
