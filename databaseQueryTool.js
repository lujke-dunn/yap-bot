try {
    require('sqlite3');
} catch (err) {
    console.error('SQLite3 is required. Please run: npm install sqlite3');
    process.exit(1);
}

const sqlite3 = require('sqlite3').verbose();
const readline = require('readline');

const db = new sqlite3.Database('./questions.db');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function executeQuery() {
    rl.question('Query (or "exit"):\n> ', query => {
        if (query.toLowerCase() === 'exit') {
            rl.close();
            db.close();
            return;
        }

        if (!query.trim()) {
            console.log('Query cannot be empty');
            return executeQuery();
        }

        const method = query.trim().toLowerCase().startsWith('select') ? 'all' : 'run';
        
        db[method](query, [], function(err, rows) {
            if (err) {
                console.error('Error:', err.message);
            } else if (method === 'all') {
                rows?.length ? console.table(rows) : console.log('No results');
            } else {
                console.log(`Success. Rows affected: ${this.changes}`);
            }
            executeQuery();
        });
    });
}

process.on('SIGINT', () => {
    rl.close();
    db.close();
    process.exit(0);
});

executeQuery(); 