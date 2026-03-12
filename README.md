![CI/CD Status](https://github.com/neeleshbansal2005/devops-git-tracker/actions/workflows/ci-cd.yml/badge.svg)

# GitContributionTracker

**Student Name:** [NeeleshBansal]  
**Registration No:** [23fe10cse00671]  
**Course:** CSE3253 DevOps [PE6]  
**Semester:** VI (2025-2026)  

## Technology Stack
- [cite_start]**Core:** Node.js, Express.js, PostgreSQL, Redis[cite: 26, 27].
- [cite_start]**DevOps:** Git, GitHub Actions, Docker, Docker Compose[cite: 7, 13, 16].

A full-stack, containerized DevOps application that retrieves and visualizes GitHub user repository intelligence.

## Features

- **Live API Integration:** Fetches real-time user profiles and recent public repositories via the GitHub API.
- **Data Visualization:** Automated Donut Chart (Chart.js) breaking down a user's primary programming languages.
- **Global Audit Log:** Persistent search history powered by a containerized PostgreSQL database.
- **Containerized Architecture:** Fully orchestrated using Docker & Docker Compose.
- **Automated CI/CD:** Automated testing and Docker image builds via GitHub Actions.

## How to Run Locally

### Prerequisites

Ensure [Docker](https://docs.docker.com/get-docker/) and Docker Compose are installed and running on your machine.

### Quick Start

1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd devops-git-tracker
   ```

## System Architecture

```text
[ User Browser ] ---> [ Node.js App (Port 8080) ] ---> [ GitHub API ]
                             |
                             +---> [ PostgreSQL (Port 5432) ] -> Saves Audit Log
                             |
                             +---> [ Redis (Port 6379) ]      -> Caches API Requests
```
