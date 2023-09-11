const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/ping', (req, res, next)  => {
    res.status(200).json('pong!');
});

app.post('/register', (req, res, next)  => {
    // if (req.body.email === 'test@test.com') {
        res.status(201).json({
            status: 'success',
            token: '1234567'
        });
    // } else {
    //     res.status(400).json({
    //         status: 'error'
    //     });
    // }
});

app.post('/login', (req, res, next) => {
    if (req.body.email === 'test@test.com') {
        res.status(200).json({
            status: 'success',
            token: '1234567'
        });
    } else {
        res.status(400).json({
            status: 'error',
            errorMessage: `User with email: ${req.body.email} not found. Please use test@test.com as an email`
        });
    }
});

app.post('/get-user', (req, res, next)  => {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({
            status: 'error'
        });
    }
    // simulate token decoding
    const header = req.headers.authorization.split(' ');
    const token = header[1];
    if (token === '1234567') {
        res.status(200).json({
            status: 'success',
            token: '1234567',
            email: 'test@test.com',
        });
    } else {
        res.status(401).json({
            status: 'error'
        });
    }
});

app.post('/add-entity', (req, res, next)  => {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({
            status: 'error'
        });
    }
    // simulate token decoding
    const header = req.headers.authorization.split(' ');
    const token = header[1];
    if (token === '1234567') {
        res.status(200).json({
            availableItems: [ ...req.body ],
        });
    } else {
        res.status(401).json({
            status: 'error'
        });
    }
});

app.post('/get-entities', (req, res, next)  => {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({
            status: 'error'
        });
    }
    // simulate token decoding
    const header = req.headers.authorization.split(' ');
    const token = header[1];
    if (token === '1234567') {
        res.status(200).json({
            availableItems: [
                {id: '59', type: 'Thing', description: 'th1', volume: 11, spentVolume: 0},
                {id: '10', type: 'Thing', description: 'th2', volume: 1, spentVolume: 0},
                {id: '11', type: 'Thing', description: 'th3', volume: 3, spentVolume: 0},
                {id: '1', type: 'Thing', description: 'th4', volume: 5, spentVolume: 0},
                {id: '2', type: 'Container', description: 'c1', volume: 11, spentVolume: 5, items: [{id: '56', type: 'Thing', description: 'th6', volume: 5, spentVolume: 0}]},
                {id: '3', type: 'Container', description: 'c2', volume: 17, spentVolume: 4, items: [{id: '13', type: 'Container', description: 'c8', volume: 4, spentVolume: 1, items: [{id: '33', type: 'Thing', description: 'th18', volume: 1, spentVolume: 0}]}]},
                {id: '4', type: 'Container', description: 'c3', volume: 8, spentVolume: 0},
                {id: '5', type: 'Container', description: 'c4', volume: 9, spentVolume: 0},
            ],
        });
    } else {
        res.status(401).json({
            status: 'error'
        });
    }
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: 'error',
        error: err
    });
});

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
