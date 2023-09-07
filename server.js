const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    const allFileContents = fs.readFileSync('messages', 'utf-8');
    allFileContents.split(/\r?\n/).forEach(message =>  {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('message', (message) => {
        console.log('Received messages:', message);
        fs.writeFile('messages', message + '\n', err => {
            if (err) {
                console.error(err);
            }
            // file written successfully
        });
        io.emit('message', message);
    });
});

http.listen(3001, () => {
    console.log('Server started on port 3001');
});