# Clinical Health Intake API

A backend service for managing dynamic clinical forms with versioning, validation, branching logic, and repeatable groups. Built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**.

---

## Features Overview
- Draft → Publish workflow with version control
- JSON-based DSL for dynamic form definitions
- Normalized schema endpoint for frontend rendering
- Submission validation with branching, conditional rules, and repeatable groups
- RESTful API design with clear error handling

---

## Run with Docker

```bash
docker compose up -d --build
docker compose logs -f api
```

Once running, the service is available at:
```
http://localhost:<PORT>/health
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST  | /forms | Create a new form |
| POST  | /forms/:formCode/draft | Create a draft version for a form |
| PUT   | /forms/:formCode/versions/:version/dsl | Update DSL of a draft version |
| POST  | /forms/:formCode/publish | Publish a specific version |
| GET   | /forms/:formCode | Get form metadata |
| GET   | /forms/:formCode/versions | List all versions for a form |
| GET   | /forms/:formCode/schema | Get normalized schema for rendering & validation |
| POST  | /forms/:formCode/validate | Validate a payload against the form schema |
| POST  | /forms/:formCode/submit | Validate and store submission |

---

## Technology Stack

| Component   | Technology |
|------------|------------|
| Language   | TypeScript |
| Framework  | Express.js |
| Database   | MongoDB (Mongoose) |
| Containerization | Docker & Docker Compose |

---


## Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=mongodb://mongo:27017/chi
PORT=3000
```

---

## Example Workflow

1. Create a new form
2. Add a draft version with a DSL definition
3. Update the draft DSL
4. Publish the form version
5. Retrieve normalized schema
6. Validate or submit form responses

---
