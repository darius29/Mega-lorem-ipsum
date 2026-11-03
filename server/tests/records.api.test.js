const { test, after } = require("node:test");

const assert = require("node:assert/strict");
const request = require("supertest");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const testDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "mega-lorem-tests-"),
);

process.env.DB_PATH = path.join(testDirectory, "test.db");

const app = require("../src/app");
const db = require("../src/db/database");

const validRecord = {
  title: "API Test Record",
  category: "Technology",
  description: "Testing the REST API",
  status: "Active",
};

let recordId;

after(() => {
  db.close();

  fs.rmSync(testDirectory, {
    recursive: true,
    force: true,
  });
});

test("GET /api/records returns an array", async () => {
  const response = await request(app).get("/api/records");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test("POST /api/records creates a record", async () => {
  const response = await request(app).post("/api/records").send(validRecord);

  assert.equal(response.status, 201);
  assert.equal(response.body.title, validRecord.title);
  assert.ok(response.body.id);

  recordId = response.body.id;
});

test("GET /api/records/:id returns a record", async () => {
  const response = await request(app).get(`/api/records/${recordId}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.id, recordId);
});

test("POST rejects an empty title", async () => {
  const response = await request(app)
    .post("/api/records")
    .send({
      ...validRecord,
      title: "",
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.errors.title, "title is required");
});

test("PUT /api/records/:id updates a record", async () => {
  const response = await request(app)
    .put(`/api/records/${recordId}`)
    .send({ ...validRecord, title: "Updated API test record" });

  assert.equal(response.status, 200);
  assert.equal(response.body.title, "Updated API test record");
});

test("GET rejects an invalid ID", async () => {
  const response = await request(app).get("/api/records/abc");

  assert.equal(response.status, 400);
});

test("GET returns 404 for missing records", async () => {
  const response = await request(app).get("/api/records/9999999");

  assert.equal(response.status, 404);
});

test("DELETE /api/records/:id removes a record", async () => {
  const response = await request(app).delete(`/api/records/${recordId}`);

  assert.equal(response.status, 204);
});

test("GET returns 404 after deletions", async () => {
  const response = await request(app).get(`/api/records/${recordId}`);

  assert.equal(response.status, 404);
});
