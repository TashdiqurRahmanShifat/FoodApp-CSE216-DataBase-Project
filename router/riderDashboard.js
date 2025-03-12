const express = require('express');
const router = express.Router();
const {check} = require('../controller/riderDashboardController');

   // Routes
router.get('/', check);

//router.post('/', checkLogin);

// Export router
module.exports = router;