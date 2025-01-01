const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow specific HTTP methods
}));


// serve the static files from the "public" folder
app.use(express.static('public'));

// handel the socket connection
io.on('connection', (socket)=>{
    console.log('a new client connected')
    // handle the massege event
    socket.on('drawing', (data)=>{
        // broadcast the massege to all clients
        socket.broadcast.emit('drawing', data);
    })
    socket.on('ondown',(data)=>{
        socket.broadcast.emit('down',data);
    })
    socket.on('disconnect',()=>{
        console.log('a client disconnected')
    })
})

server.listen(3000,()=>{
    console.log('server is running on port 3000')
})