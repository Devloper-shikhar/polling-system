const express = require('express');
const pollService = require('../services/pollService'); // Import pollService
const { submitVote } = require('../services/kafkaService');
const { getPollResults } = require('../services/dbService');
const asyncHandler = require('../utils/errorHandler');
const db = require('../db/db');
const { getLeaderboard } = require('../services/dbService');


const router = express.Router();

// Create Poll API
router.post('/', asyncHandler(async (req, res) => {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
        return res.status(400).send('Invalid input: A question and at least two options are required.');
    }

    const poll = await pollService.createPoll(question, options);
    res.status(201).json(poll);
}));

// Vote API
router.post('/:id/vote', asyncHandler(async (req, res) => {
    const { id } = req.params; // Poll ID
    const { optionId } = req.body; // Option ID

    // Check if poll exists
    const pollExists = await db.query('SELECT 1 FROM polls WHERE id = $1', [id]);
    if (pollExists.rowCount === 0) {
        return res.status(404).json({ error: `Poll with ID ${id} does not exist.` });
    }

    // Check if option exists for the given poll
    const optionExists = await db.query('SELECT 1 FROM options WHERE id = $1 AND poll_id = $2', [optionId, id]);
    if (optionExists.rowCount === 0) {
        return res.status(404).json({ error: `Option with ID ${optionId} does not exist for poll ${id}.` });
    }

    // Submit the vote
    await submitVote(id, optionId);
    res.status(200).send('Vote submitted!');
}));



// Leaderboard API
router.get('/leaderboard', asyncHandler(async (req, res) => {
    const leaderboard = await getLeaderboard();
    res.status(200).json(leaderboard);
}));


// Poll Results API
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching results for poll ID: ${id}`); // Debug log

    try {
        const results = await getPollResults(id);
        console.log('Poll results:', results); // Debug log
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching poll results:', err.message);
        res.status(404).json({ error: err.message });
    }
}));



module.exports = router;
