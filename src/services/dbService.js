const db = require('../db/db');

// Update poll votes
const updatePollVotes = async (pollId, optionId) => {
    await db.query('UPDATE options SET votes = votes + 1 WHERE id = $1', [optionId]);
    const results = await db.query(
        'SELECT option_text, votes FROM options WHERE poll_id = $1 ORDER BY votes DESC',
        [pollId]
    );
    return results.rows;
};

// Get poll results
const getPollResults = async (pollId) => {
    const results = await db.query(
        'SELECT option_text, votes FROM options WHERE poll_id = $1 ORDER BY votes DESC',
        [pollId]
    );
    return results.rows;
};

const getLeaderboard = async () => {
    const query = `
        SELECT p.question AS poll_question, o.option_text AS option, o.votes AS vote_count
        FROM options o
        INNER JOIN polls p ON o.poll_id = p.id
        ORDER BY o.votes DESC
        LIMIT 10;  -- Change limit as needed
    `;
    const result = await db.query(query);
    return result.rows;
};


module.exports = { updatePollVotes, getPollResults,getLeaderboard };
