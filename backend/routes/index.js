const express = require('express');
const authRoutes = require('./auth');
const personRoutes = require('./person');
const convocationsRoutes = require('./convocations');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/persons', personRoutes);
router.use('/convocations', convocationsRoutes);

module.exports = router;
