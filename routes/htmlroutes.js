const path = require('path');
const router = require('express').Router();

router.get('/query1', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/query1.html'));
});

router.get('/query2', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/query2.html'));
});

router.get('/query3', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/query3.html'));
});

router.get('/query4', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/query4.html'));
});

router.get('/query5', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/query5.html'));
});

router.get('/query6', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/query6.html'));
});

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

module.exports = router;