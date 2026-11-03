const express = require("express");

const recordsController = require("../controllers/records.controller");

const router = express.Router();

router.get("/", recordsController.getAllRecords);
router.get("/:id", recordsController.getRecordById);
router.post("/", recordsController.createRecord);

module.exports = router;
