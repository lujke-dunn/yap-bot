const db = require('./setup');

async function getRandomQuestion() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT q.id, q.question 
            FROM questions q
            WHERE q.id NOT IN (
                SELECT question_id 
                FROM used_questions 
                WHERE used_date >= date('now', '-10 days')
            )
            ORDER BY RANDOM()
            LIMIT 1;
        `;

        db.get(query, [], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (row) {
                db.run('INSERT INTO used_questions (question_id) VALUES (?)', [row.id]);
                resolve(row.question);
            } else {
                db.get('SELECT question FROM questions ORDER BY RANDOM() LIMIT 1', [], (err, fallbackRow) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(fallbackRow ? fallbackRow.question : 'No questions available');
                    }
                });
            }
        });
    });
}

module.exports = { getRandomQuestion };