# AV Autorun — Distributed Job Runner Dashboard

**AV Autorun** is a containerised full-stack job orchestration and monitoring platform built with **Next.js**, **Node.js**, **BullMQ**, **Redis**, and **PostgreSQL**.
It provides an API and dashboard for creating, tracking, and analysing jobs in real time, offering a practical foundation for distributed task management and backend systems design.

---

## Features

* **Distributed Job Queue** — powered by [BullMQ](https://docs.bullmq.io/) with Redis for scheduling, retries, and concurrency control.
* **Persistent Storage** — PostgreSQL and Prisma ORM store job metadata, statuses, and logs.
* **Full Containerisation** — a single `docker compose up` command launches the entire stack.
* **Next.js Dashboard** — view, filter, and monitor jobs by type or status.
* **API Endpoints** — REST-style routes for creating, listing, and checking job progress.
* **Automatic Migrations** — Prisma keeps the database schema in sync across containers.
* **Scalable Design** — web and worker services are decoupled for easy scaling.

---

## Tech Stack

| Layer               | Technologies                                         |
| ------------------- | ---------------------------------------------------- |
| **Frontend & API**  | Next.js 15, TypeScript                               |
| **Queue & Worker**  | BullMQ, Node.js                                      |
| **Database**        | PostgreSQL with Prisma ORM                           |
| **Infrastructure**  | Docker, Docker Compose                               |
| **Cache & Broker**  | Redis                                                |
| **CI/CD (Planned)** | GitHub Actions for build, test, and deploy pipelines |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/andreivo5/avautorun.git
cd avautorun
```

### 2. Environment Variables

Create a `.env` file inside `/apps/web` with:

```env
DATABASE_URL=postgresql://av:av@db:5432/avautorun
REDIS_URL=redis://redis:6379
```

### 3. Start All Services

```bash
docker compose up --build
```

This launches:

* **web** — Next.js frontend and API
* **worker** — BullMQ job processor
* **db** — PostgreSQL instance
* **redis** — Redis message broker

### 4. Apply Prisma Migrations

```bash
docker compose exec web npx prisma migrate deploy
```

### 5. Access the Dashboard

Visit [http://localhost:3000](http://localhost:3000) to open the dashboard and begin creating jobs.

---

## Project Structure

```
avautorun/
│
├── apps/
│   ├── web/          # Next.js dashboard + API routes
│   └── worker/       # BullMQ worker processor
│
├── prisma/           # Database schema + migrations
├── docker-compose.yml
├── Dockerfile        # Docker configuration
└── README.md
```

---

## Future Enhancements

* Real-time updates via WebSockets
* Historical job analytics (success rate, average latency)
* Advanced dashboard filtering (type, status, time range)
* Email or webhook notifications for job completion
* Automated CI/CD pipelines with GitHub Actions
* Cloud deployment support (Fly.io or DigitalOcean)

---

## License

MIT License © 2025 [Andrei Voiniciuc](https://github.com/andreivo5)
