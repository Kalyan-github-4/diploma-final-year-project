const express = require("express")
const { chatWithAI, streamChatWithAI, generateDSAQuestionsController, textToSpeechController, healthCheckController } = require("../controllers/ai.controller")

const router = express.Router()

router.get("/health", healthCheckController)
router.post("/chat", chatWithAI)
router.post("/chat/stream", streamChatWithAI)
router.post("/dsa/questions", generateDSAQuestionsController)
router.post("/tts", textToSpeechController)

module.exports = router
