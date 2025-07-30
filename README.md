# Node.js Blocking vs Clustered Mode Benchmark Report

## Overview
This benchmark compares a basic Node.js server (`server.js`) running in single-threaded mode versus a clustered mode (`server-cluster.js`) to evaluate how blocking operations impact performance.

## Test Setup

- **Machine**: ASUS ExpertCenter (Linux)
- **Tool**: ApacheBench (ab)
- **Endpoint Tested**: `/block` (simulates 5 seconds blocking), `/profile` (simulates 2 seconds non-blocking)
- **Request Count**: 5
- **Concurrency**: 5

## Commands Used

```bash
# Blocking server (server.js)
curl http://localhost:3081/block
curl http://localhost:3081/profile

# Clustered server (server-cluster.js)
curl http://localhost:3000/block
curl http://localhost:3000/profile

# Install ApacheBench
sudo apt install apache2-utils

# Run benchmark
ab -n 5 -c 5 http://localhost:3081/block
```

## Observations

### server.js (no cluster)
```json
{ "pid": 2539462, "message": "Blocking done", "duration": 5000 }
{ "pid": 2539462, "message": "Hello from /profile (no cluster)", "time": "2025-07-30T08:48:11.518Z", "duration": 2001 }
```
- All requests handled by single process (PID 2539462).
- Blocking endpoint `/block` prevents concurrent handling of `/profile`.

### server-cluster.js
```json
{ "pid": 2556810, "message": "Blocking done", "duration": 5000 }
{ "worker": 2556813, "message": "Hello from /profile", "time": "2025-07-30T08:49:01.779Z", "duration": 2001 }
```
- Blocking request handled by one worker (PID 2556810), while another (PID 2556813) handles `/profile` concurrently.
- Demonstrates that clustering avoids blocking the entire server.

### ApacheBench Result on server.js
```
apr_socket_recv: Connection refused (111)
```
- Indicates the server couldn’t handle concurrent connections in time, likely due to being blocked.

## Conclusion

- **Without clustering**, Node.js can't handle multiple requests during a blocking operation.
- **With clustering**, the server can handle blocking and non-blocking routes concurrently.
