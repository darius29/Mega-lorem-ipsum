const express = require("express");

const recordsController = require("../controllers/records.controller");

const router = express.Router();

router.get("/", recordsController.getAllRecords);
router.get("/:id", recordsController.getRecordById);
router.post("/", recordsController.createRecord);
router.put("/:id", recordsController.updateRecord);
router.delete("/:id", recordsController.deleteRecord);

module.exports = router;
