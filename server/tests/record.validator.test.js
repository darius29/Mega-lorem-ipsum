const { test } = require("node:test");
const assert = require("node:assert/strict");

const { validateRecord } = require("../src/validators/record.validator");

const validRecord = {
  title: "Test Record",
  category: "Technology",
  description: "Test description",
  status: "Active",
};

test("accepts a valid record", () => {
  const errors = validateRecord(validRecord);

  assert.deepEqual(errors, {});
});

test("rejects whitespace-only fields", () => {
  const errors = validateRecord({
    ...validRecord,
    category: " ",
  });

  assert.equal(errors.category, "category is required");
});

test("reject missing fields", () => {
  const errors = validateRecord({ title: "Test" });

  assert.deepEqual(errors, {
    category: "category is required",
    description: "description is required",
    status: "status is required",
  });
});

test("rejects non-string values", () => {
  const errors = validateRecord({
    ...validRecord,
    title: 123,
  });

  assert.equal(errors.title, "title is required");
});

test("rejects an empty title", () => {
  const errors = validateRecord({
    ...validRecord,
    title: "",
  });

  assert.equal(errors.title, "title is required");
});
