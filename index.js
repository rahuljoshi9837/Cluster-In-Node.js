const cluster = require('cluster');
const os = require('os');
const express = require('express');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    // Master process: fork a worker for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Log when a worker exits and replace it with a new worker
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new one...`);
        cluster.fork();
    });
} else {
    // Worker process: create an Express server
    const app = express();

    // Define a sample API route
    app.get('/', (req, res) => {
        console.log(process.pid);
        setTimeout(() => {
            res.send(`Hello from worker ${process.pid}`);
        },5000);
    });

    // Define another API route
    app.get('/api/data', (req, res) => {
        res.json({ message: `Data served by worker ${process.pid}`, data: [1, 2, 3, 4] });
    });

    // Start the server
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is listening on port ${PORT}`);
    });
}
