# Load Test Certification

Live authenticated test executed 17 July 2026 against `http://127.0.0.1:4000/api` using six API routes and the local MariaDB database.

| Requests | Concurrency | Passed | Failed | Req/s | p50 | p95 | p99 | Max |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 10,000 | 100 | 10,000 | 0 | 1,020.80 | 99.72 ms | 160.43 ms | 185.89 ms | 272.18 ms |
| 25,000 | 150 | 25,000 | 0 | 1,123.35 | 129.85 ms | 229.95 ms | 369.74 ms | 712.29 ms |
| 50,000 | 200 | 50,000 | 0 | 868.20 | 167.40 ms | 573.33 ms | 648.05 ms | 1,057.43 ms |

All 85,000 requests passed. Throughput declines and p95 rises materially at concurrency 200. This certifies a strong single-host API baseline, not 50,000 simultaneous users. Upload throughput, WAN latency and multi-node behavior require separate infrastructure testing.

Scalability score: **91/100** for local API request load; national-scale certification remains conditional on distributed tests and production monitoring.
