const express = require("express");
const router = express.Router();


const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, createApplication);
router.get("/", authMiddleware, getApplications);
router.patch("/:id", authMiddleware, updateApplication);

router.delete("/:id", authMiddleware, deleteApplication);
module.exports = router;