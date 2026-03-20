const express = require('express');
const curatedMissionsAdmin = require('../controllers/curatedMissions.controller');

const router = express.Router();

// Admin CRUD endpoints
router.get('/', curatedMissionsAdmin.getAllCuratedMissions);
router.get('/:id', curatedMissionsAdmin.getCuratedMissionById);
router.post('/', curatedMissionsAdmin.createCuratedMission);
router.put('/:id', curatedMissionsAdmin.updateCuratedMission);
router.delete('/:id', curatedMissionsAdmin.deleteCuratedMission);

module.exports = router;
