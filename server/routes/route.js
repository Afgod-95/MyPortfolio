const express = require('express')
const controller = require('../controller/controller.js')
const router = express.Router()

router.get('/godwin_resume.pdf', (req, res) => {
    res.setHeader('Content-Disposition', 'inline; filename=godwin_resume.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(__dirname + '/public/godwin_resume.pdf');
});

router.post('/api/godwin/works', controller.postWorks)
router.get('/api/godwin/works', controller.getAllWorks)

module.exports = router