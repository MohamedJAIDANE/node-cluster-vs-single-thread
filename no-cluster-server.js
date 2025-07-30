const http = require('http');

const server = http.createServer((req, res) => {
  const start = Date.now();

  if (req.url === '/block') {
    while (Date.now() - start < 5000) {}

    const duration = Date.now() - start;
    console.log(`🧱 BLOCKED: PID ${process.pid} - Duration: ${duration}ms`);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ pid: process.pid, message: 'Blocking done', duration }));
  } else if (req.url === '/profile') {
    setTimeout(() => {
      const duration = Date.now() - start;
      console.log(`📦 RESPONSE: PID ${process.pid} - Duration: ${duration}ms`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          pid: process.pid,
          message: 'Hello from /profile (no cluster)',
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

server.listen(3081, () => {
  console.log(`🚀 Server running on PID: ${process.pid} (no cluster) on port 3081`);
});
