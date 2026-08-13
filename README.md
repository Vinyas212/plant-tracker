# 🌱 Plant Tracker

A professional, simple full-stack application for maintaining plant information and tracking plant care.

## Features

- Add plant
- Edit plant
- Delete plant
- Record watering
- Add/edit care instructions
- View plant history
- Search plants
- Dashboard statistics
- Responsive UI
- REST API
- SQLite database
- Docker support

## Tech Stack

Frontend: React, Vite, JavaScript, CSS  
Backend: Node.js, Express.js, SQLite  
DevOps: Docker, Docker Compose, Nginx

## Project Structure

```text
plant-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlantCard.jsx
│   │   │   └── PlantForm.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── PlantDetails.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── plantController.js
│   │   ├── database/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   └── plantRoutes.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── .gitkeep
├── .dockerignore
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Run with Docker

Start Docker Desktop, then from the project root:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

Stop:

```bash
docker compose down
```

The SQLite database is stored in `database/`.

## Run Without Docker

Backend:

```bash
cd backend
npm install
npm start
```

Frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/plants | List plants |
| GET | /api/plants/:id | Plant details |
| POST | /api/plants | Add plant |
| PUT | /api/plants/:id | Edit plant |
| DELETE | /api/plants/:id | Delete plant |
| POST | /api/plants/:id/water | Record watering |
| PUT | /api/plants/:id/care | Save care instructions |
| GET | /api/plants/:id/history | Plant history |

## Database

SQLite automatically creates:

- plants
- care_instructions
- watering_records

## Future Improvements

- Authentication
- Plant photos
- Watering reminders
- Search/filter improvements
- Weather integration
- Cloud database
- Cloud deployment
