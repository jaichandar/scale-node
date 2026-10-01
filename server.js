const cluster = require('node:cluster');
const os = require('node:os');
const process = require('node:process');
const express = require('express');
require('dotenv').config({});

const numCPUs = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Forking replacement...`);
    cluster.fork();
  });

} else {
  const app = express();
  app.get('/loop', (req, res) => {
    const startTime = performance.now();
    let count = 0;

    for (let i = 0; i < 10000; i++) {
      count += i;
    }

    console.log('loop completed...');

    const duration = (performance.now() - startTime).toFixed(3);

    res.json({
      message: 'Loop completed successfully',
      iterations: 10000,
      sum: count,
      executionTimeMs: Number(duration),
      handledByWorker: process.pid
    });
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', workerPid: process.pid });
  });

  app.listen(PORT, () => {
    console.log(`Worker process ${process.pid} running on http://localhost:${PORT}`);
  });
}