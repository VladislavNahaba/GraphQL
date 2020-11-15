const { Router } = require('express');
const router = Router();

// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

router.get('/', function(req, res) {
    res.send('<h1 style="font-size=40px; text-align: center; color: blue;">Main Page</h1>');
});

router.get('/info', function(req, res) {
    res.send('<h1>Info</h1>');
});

module.exports = router;