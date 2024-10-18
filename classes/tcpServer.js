const net = require('net');
class TcpServer{
    constructor() {
        this.clients = [];
        this.server = net.createServer((socket) => this.handleConnection(socket));
        this.server.listen(3333, '0.0.0.0', () => {
            console.log('Server listening on port 3333');
        });
    }

    handleConnection(socket) {
        socket.setEncoding('utf8');
        socket.id = this.clients.length;
        socket.on('data', (data) => this.handleData(socket, data));
        socket.on('end', () => this.handleEnd(socket));
        socket.on('error', (err) => this.handleError(socket, err));
    }

    handleData(socket, data) {
        const message = data.trim();
        if (!this.clients[socket.id]) {
            this.clients[socket.id] = { socket, type:message };
            console.log(`Client registered: ${message}`);
        } else {
            this.items = data.split(',')
            console.log(`Received message from ${socket.id}: ${message}`);
        }
    }
    handleEnd(socket) {
        if (this.clients[socket.id]) {
            console.log(`Client disconnected: ${socket.id}`);
            delete this.clients[socket.id];
        }
    }
    handleError(socket, err) {
        console.error(`Socket error: ${err}`);
        if (this.clients[socket.id]) {
            delete this.clients[socket.id];
        }
    }
    sendToClient(clientId, message) {
        const clientSocket = this.clients[clientId].socket;
        if (clientSocket) {
            clientSocket.write(message + '\n');
            console.log(`Sent message to ${clientId}: ${message}`);
        } else {
            console.log(`Client ${clientId} not found.`);
        }
    }
}
module.exports = new TcpServer();
