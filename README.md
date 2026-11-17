# CSC 3700 Project — Milestone 2

This project uses a React/Vite client, an Express API, and the team MySQL database.

## 1. Set up the database

In phpMyAdmin, select the team database and run these files in order:

1. `Project_3700_26/Server/sql/schema.sql`
2. `Project_3700_26/Server/sql/seed.sql`

**Note:** `schema.sql` drops and recreates the project tables. Run it only when setting up or intentionally resetting the database.

## 2. Configure and start the API

Create `Project_3700_26/Server/.env` with your team’s database credentials:

```ini
PORT=3000
DB_HOST=your_database_host
DB_USER=your_team_username
DB_PASSWORD=your_team_password
DB_NAME=your_team_database
CLIENT_ORIGIN=http://localhost:5173
```

Keep `.env` private; do not commit real credentials.

In a terminal:

```powershell
cd Project_3700_26\Server
npm install
npm run dev
```

The API runs at `http://localhost:3000`.

## 3. Configure and start the React client

Create `Project_3700_26/.env` containing:

```ini
VITE_API_BASE_URL=http://localhost:3000
```

In a second terminal:

```powershell
cd Project_3700_26
npm install
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`. Keep both terminals running while using the app.
