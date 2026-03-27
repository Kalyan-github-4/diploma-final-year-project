const express = require("express")
const { chatWithAI, streamChatWithAI, generateDSAQuestionsController } = require("../controllers/ai.controller")

const router = express.Router()

router.post("/chat", chatWithAI)
router.post("/chat/stream", streamChatWithAI)
router.post("/dsa/questions", generateDSAQuestionsController)

module.exports = router
