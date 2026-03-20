const express = require("express")
const { chatWithAI, generateDSAQuestionsController } = require("../controllers/ai.controller")

const router = express.Router()

router.post("/chat", chatWithAI)
router.post("/dsa/questions", generateDSAQuestionsController)

module.exports = router