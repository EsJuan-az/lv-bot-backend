const { Router } = require('express');
const { body, param } = require('express-validator');
const { baseGet, planUsers } = require('../controllers/home');


const router = Router();

router.get('/', baseGet);
router.get('/pu/:attemp', planUsers);


module.exports = router;