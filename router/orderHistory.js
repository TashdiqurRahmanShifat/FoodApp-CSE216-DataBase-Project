const express = require('express');
const router = express.Router();
const {loadHistory} = require('../controller/orderHistoryController');

   // Routes
router.get('/', loadHistory);
module.exports=router;