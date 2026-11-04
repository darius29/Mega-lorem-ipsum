const recordsService = require("../services/records.service");
const { validateRecord } = require("../validators/record.validator");

const getAllRecords = (req, res) => {
  const records = recordsService.getAllRecords();

  return res.status(200).json(records);
};

const getRecordById = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid ID",
    });
  }

  const record = recordsService.getRecordById(id);

  if (!record) {
    return res.status(404).json({
      error: "Record not found",
    });
  }

  return res.status(200).json(record);
};

const createRecord = (req, res) => {
  const errors = validateRecord(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      errors,
    });
  }

  const record = recordsService.createRecord(req.body);

  return res.status(201).json(record);
};

const updateRecord = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid record ID",
    });
  }

  const errors = validateRecord(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const record = recordsService.updateRecord(id, req.body);

  if (!record) {
    return res.status(400).json({
      error: "Record not found",
    });
  }

  return res.status(200).json(record);
};

const deleteRecord = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid record ID",
    });
  }

  const deleted = recordsService.deleteRecord(id);

  if (!deleted) {
    return res.status(404).json({
      error: "Record not found",
    });
  }

  return res.status(204).send();
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
