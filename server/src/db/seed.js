const db = require("./database");

const categories = ["Technology", "Business", "Sport", "E-commerce", "Travel"];

const statuses = ["Active", "Pending", "Archived", "Done"];

const descriptions = [
  "Latest developments in technology and artificial intelligence.",
  "Strategies for growing and managing successful businesses.",
  "Sports news, competitions, and athlete performance.",
  "Best practices for online stores and digital marketplaces.",
  "Travel guides, destinations, and tips for exploring new places.",
];

const { count } = db.prepare("SELECT COUNT(*) AS count FROM records").get();

if (count === 0) {
  const insertRecord = db.prepare(`
        INSERT INTO records(title, category, description, status)
        VALUES(?, ?, ?, ?)`);

  const insertMany = db.transaction(() => {
    for (let i = 1; i <= 200; i++) {
      const index = (i - 1) % categories.length;

      const title = `Lorem Ipsum Record ${i}`;
      const category = categories[index];
      const description = descriptions[index];
      const status = statuses[(i - 1) % statuses.length];

      insertRecord.run(title, category, description, status);
    }
  });

  insertMany();
  console.log("200 records created successfully");
} else {
  console.log(`Database already contains ${count} records`);
}

db.close();
