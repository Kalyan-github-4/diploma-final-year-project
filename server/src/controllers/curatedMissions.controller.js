// Curated Missions Admin Controller
const curatedMissionsService = require('../services/curated-missions.service');

// GET all curated missions
async function getAllCuratedMissions(req, res) {
  try {
    const missions = await curatedMissionsService.getAll();
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET one curated mission by id
async function getCuratedMissionById(req, res) {
  try {
    const mission = await curatedMissionsService.getById(req.params.id);
    if (!mission) return res.status(404).json({ error: 'Not found' });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST create new curated mission
async function createCuratedMission(req, res) {
  try {
    const mission = await curatedMissionsService.create(req.body);
    res.status(201).json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUT update curated mission
async function updateCuratedMission(req, res) {
  try {
    const mission = await curatedMissionsService.update(req.params.id, req.body);
    if (!mission) return res.status(404).json({ error: 'Not found' });
    res.json(mission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE curated mission
async function deleteCuratedMission(req, res) {
  try {
    const deleted = await curatedMissionsService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllCuratedMissions,
  getCuratedMissionById,
  createCuratedMission,
  updateCuratedMission,
  deleteCuratedMission,
};
