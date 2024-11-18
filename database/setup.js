const sqlite3 = require('sqlite3').verbose();

// Database initialization
const db = new sqlite3.Database('./questions.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('Connected to database successfully.');
});

// Create tables
const tables = {
    questions: `CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        question VARCHAR(64)
    )`,
    usedQuestions: `CREATE TABLE IF NOT EXISTS used_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER,
        used_date DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY(question_id) REFERENCES questions(id)
    )`
};

// Initialize tables
Object.entries(tables).forEach(([tableName, query]) => {
    db.run(query, (err) => {
        if (err) {
            console.error(`Error creating ${tableName} table:`, err.message);
        } else {
            console.log(`${tableName} table ready`);
        }
    });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nClosing database connection...');
    db.close();
    process.exit(0);
});

module.exports = db;