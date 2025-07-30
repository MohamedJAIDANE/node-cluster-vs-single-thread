# Node.js Blocking vs Clustered Mode Benchmark Report

## Overview
This benchmark compares a basic Node.js server running in single-threaded mode versus a clustered mode to evaluate how blocking operations impact performance.

## Tested URLs
- http://localhost:3081/block
- http://localhost:3000/block

---

## ✅ Summary of Both Tests

| Metric                  | Port 3081             | Port 3000             |
|-------------------------|-----------------------|-----------------------|
| Requests                | 5                     | 5                     |
| Concurrency Level       | 5                     | 5                     |
| Total Time              | 25.007 seconds        | 10.008 seconds        |
| Requests per Second     | 0.20 req/s            | 0.50 req/s            |
| Time per Request (mean) | 25,006 ms             | 10,007 ms             |
| Transfer Rate           | 0.03 KB/s             | 0.08 KB/s             |
| Document Length         | 57 bytes              | 57 bytes              |
| Failed Requests         | 0                     | 0                     |

---

## 🔍 Detailed Breakdown

### 🔸 Port 3081

- **Total Time:** Took 25 seconds to complete 5 requests with 5 concurrent clients.
- **Performance:** Very slow — each request took on average 25 seconds, even though they were made concurrently.
- **Processing Time:** Requests took between 5s and 20s to complete.
- **Waiting Time:** Very high, with most requests waiting the full 20s.
- **Response Pattern:** All 5 requests appear to be waiting on a blocking operation with the same timeout (~20s), suggesting a blocking or long-running task in the backend for `/block`.

**Interpretation:**

Your backend on port 3081 is heavily blocking the request or has some artificial or real delay (~20s). This could be due to:

- Synchronous blocking code (e.g., sleep, long computation)
- External network call with long response time
- Intentional test for blocking behavior

---

### 🔸 Port 3000

- **Total Time:** Completed in 10 seconds
- **Performance:** Slightly better — each request took ~5 seconds to complete, even with concurrency.
- **Processing Time:** Very consistent, all requests returned in ~5004 ms ± 1 ms.
- **Waiting Time:** Same as processing, indicating that responses are queued instantly and served after 5 seconds.

**Interpretation:**

Port 3000 backend is also blocking for 5 seconds per request, but all requests execute in parallel (due to async/non-blocking code). The uniform response time suggests:

- Probably using asynchronous delay (e.g., setTimeout, await sleep(5000))
- No serious contention or CPU blocking
- Requests are handled concurrently and efficiently

---

## ⚖️ Comparison: 3081 vs 3000

| Aspect                | Port 3081 (likely blocking)      | Port 3000 (likely async)          |
|-----------------------|---------------------------------|----------------------------------|
| Concurrency Efficiency | Poor – requests block each other | Good – requests handled in parallel |
| Mean Response Time     | 25s total, 20s per request       | 10s total, 5s per request         |
| Consistency of Response| High variance (5s–20s)            | Low variance (~5s all)            |
| Throughput            | 0.2 req/sec                     | 0.5 req/sec                      |

---