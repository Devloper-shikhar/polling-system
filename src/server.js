// const express = require('express');
// const db = require('./db/db');
// const WebSocket = require('ws');
// const kafka = require('kafka-node');

// require('dotenv').config();

// const app = express();
// app.use(express.json());

// // Test Route
// app.get('/test', async (req, res) => {
//     try {
//         const result = await db.query('SELECT NOW()');
//         res.send(`PostgreSQL Connected! Time: ${result.rows[0].now}`);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Database Connection Failed');
//     }
// });


// app.get('/', (req, res) => {
//     res.send('Welcome to the Polling System API!');
// });

// // Kafka Producer
// const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
// const producer = new kafka.Producer(kafkaClient);
// producer.on('ready', () => console.log('Kafka Producer is ready'));

// app.post('/polls/:id/vote', (req, res) => {
//     const { id } = req.params;
//     const { optionId } = req.body;

//     producer.send(
//         [{ topic: 'poll_votes', messages: JSON.stringify({ pollId: id, optionId }) }],
//         (err) => {
//             if (err) return res.status(500).send(err);
//             res.status(200).send('Vote submitted!');
//         }
//     );
// });

// // WebSocket Server
// const wss = new WebSocket.Server({ port: 8080 });
// const clients = {};

// wss.on('connection', (ws) => {
//     ws.on('message', (message) => {
//         const { pollId } = JSON.parse(message);
//         clients[pollId] = clients[pollId] || [];
//         clients[pollId].push(ws);
//     });
// });

// const broadcastUpdate = (pollId, data) => {
//     if (clients[pollId]) {
//         clients[pollId].forEach((ws) => {
//             if (ws.readyState === WebSocket.OPEN) {
//                 ws.send(JSON.stringify(data));
//             }
//         });
//     }
// };

// // Kafka Consumer
// const consumer = new kafka.Consumer(
//     kafkaClient,
//     [{ topic: 'poll_votes', partition: 0 }],
//     { autoCommit: true }
// );

// consumer.on('message', async (message) => {
//     const { pollId, optionId } = JSON.parse(message.value);

//     try {
//         await db.query('UPDATE options SET votes = votes + 1 WHERE id = $1', [optionId]);
//         const result = await db.query(
//             'SELECT option_text, votes FROM options WHERE poll_id = $1 ORDER BY votes DESC',
//             [pollId]
//         );

//         broadcastUpdate(pollId, result.rows);
//     } catch (err) {
//         console.error(err);
//     }
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const pollRoutes = require('./routes');
const { initializeWebSocketServer } = require('./services/websocketService');
require('dotenv').config();

const app = express();
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Polling System API!');
});

// Poll Routes
app.use('/polls', pollRoutes);

// Start WebSocket Server
initializeWebSocketServer();

// Start HTTP Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
