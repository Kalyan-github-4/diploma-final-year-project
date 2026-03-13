const express = require("express")
const {
  generateMissions,
  listMissions,
} = require("../controllers/missions.controller")

const router = express.Router()

router.get("/", listMissions)
router.post("/generate", generateMissions)

module.exports = router