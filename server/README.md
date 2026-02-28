Backend for Digital-Contact

Quick start

1. Open a terminal and change into the `server` folder:

```
cd server
```

2. Install dependencies:

```
npm install
```

3. Copy the example env and start:

```
copy .env.example .env
npm start
```

API endpoints

- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/profile` (Bearer token)

Notes

- This backend uses a simple JSON file at `server/data/users.json` to store users. For production, replace with a database.
