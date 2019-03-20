var express = require('express');
var index = require('./routes/index')

var router = express.Router();

router.post('/ibeem/device/set_cycle', index);
router.post('/ibeem/device/set_time', index);
router.post('/ibeem/device/set_argument', index);
router.post('/ibeem/device/get_argument', index);

module.exports = router;