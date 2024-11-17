const { Producer, Consumer } = require('kafka-node');
const kafkaClient = require('../utils/kafkaClient');
const { updatePollVotes, getLeaderboard } = require('./dbService');
const { broadcastUpdate } = require('./websocketService');

const producer = new Producer(kafkaClient, { requireAcks: 1 });


producer.on('ready', () => console.log('Kafka Producer is ready'));
producer.on('error', (err) => console.error('Kafka Producer Error:', err));

// Submit vote to Kafka
const submitVote = (pollId, optionId) => {
    return new Promise((resolve, reject) => {
        producer.send(
            [{ topic: 'poll_votes', messages: JSON.stringify({ pollId, optionId }) }],
            (err) => (err ? reject(err) : resolve())
        );
    });
};

// Kafka Consumer
const consumer = new Consumer(
    kafkaClient,
    [{ topic: 'poll_votes', partition: 0 }],
    { autoCommit: true }
);

consumer.on('message', async (message) => {
    const { pollId, optionId } = JSON.parse(message.value);

    try {
        // Update poll votes in the database
        await updatePollVotes(pollId, optionId);

        // Fetch the updated leaderboard
        const leaderboard = await getLeaderboard();

        // Broadcast the updated leaderboard to WebSocket clients
        broadcastUpdate('leaderboardUpdate', leaderboard);

    } catch (err) {
        console.error('Error processing vote or broadcasting leaderboard:', err);
    }
});

consumer.on('error', (err) => {
    console.error('Kafka Consumer Error:', err);
});

module.exports = { submitVote };
