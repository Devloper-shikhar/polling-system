const db = require('../db/db');

const createPoll = async (question, options) => {
    try {
        // Insert poll question
        const pollQuery = `
            INSERT INTO polls (question) 
            VALUES ($1) 
            RETURNING id
        `;
        const pollResult = await db.query(pollQuery, [question]);
        const pollId = pollResult.rows[0].id;

        // Insert options
        const optionQuery = `
            INSERT INTO options (poll_id, option_text) 
            VALUES ($1, $2)
        `;
        for (const option of options) {
            await db.query(optionQuery, [pollId, option]);
        }

        return { pollId, question, options };
    } catch (error) {
        console.error('Error creating poll:', error);
        throw error;
    }
};

module.exports = {
    createPoll,
};
