const cluster = require('cluster');
const http = require('http');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`👑 Master ${process.pid} running with ${numCPUs} workers\n`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.log(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const server = http.createServer((req, res) => {
    const start = Date.now();

    if (req.url === '/block') {
      // Simulate CPU blocking
      while (Date.now() - start < 5000) {}

      const duration = Date.now() - start;
      console.log(`🧱 BLOCKED: PID ${process.pid} - Duration: ${duration}ms`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ pid: process.pid, message: 'Blocking done', duration }));
    } else if (req.url === '/profile') {
      // Simulate slow external API or DB
      setTimeout(() => {
        const duration = Date.now() - start;
        console.log(`📦 RESPONSE: PID ${process.pid} - Duration: ${duration}ms`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            worker: process.pid,
            message: 'Hello from /profile',
            time: new Date().toISOString(),
            duration,
          })
        );
      }, 2000);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(3000, () => {
    console.log(`🚀 Worker ${process.pid} is listening on port 3000`);
  });
}
