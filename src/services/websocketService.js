const WebSocket = require('ws');

const clients = {};
const wss = new WebSocket.Server({ port: 8080 });

// Initialize WebSocket Server
const initializeWebSocketServer = () => {
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const { pollId } = JSON.parse(message);
            clients[pollId] = clients[pollId] || [];
            clients[pollId].push(ws);
        });
    });
};

// Broadcast updates to WebSocket clients
const broadcastUpdate = (pollId, data) => {
    if (clients[pollId]) {
        clients[pollId].forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        });
    }
};

module.exports = { initializeWebSocketServer, broadcastUpdate };
