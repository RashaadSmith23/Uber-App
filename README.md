# 🚗 Zippora Uber App

A full‑stack ride‑hailing web app with real‑time driver tracking, rider‑driver matching, live map, and booking flow.  
Built as a monolithic Node.js + React application, ready for production deployment.

![Zippora Screenshot](screenshot.png)  <!-- Replace with an actual screenshot if available -->

---

## ✨ Features

- **Two‑sided App** – Rider and Driver modes, each with a dedicated dashboard
- **Interactive Map** – Built with Leaflet / React‑Leaflet (OpenStreetMap tiles)
- **Ride Booking Flow** – Select pickup/dropoff on map, choose ride type, see fare estimate
- **Real‑time Updates** – Socket.io for instant ride requests, driver acceptance, and live location tracking
- **Driver Dashboard** – Go online/offline, accept or decline incoming requests, complete trips
- **Secure Authentication** – JWT‑based registration and login for riders and drivers
- **Free Ride Insights** – Friendly, randomized tips shown after fare estimation (no API keys required)
- **Glassmorphism UI** – Modern glass‑effect overlays, smooth animations, and responsive design
- **Monolithic Architecture** – Backend serves the React frontend, so it runs as a single service

---

## 📷 Preview

*Add a screenshot or GIF showing the splash screen, rider map, and driver request popup.*

---

## 🛠️ Tech Stack

**Backend**  
- Node.js + Express (REST API)
- Socket.io (real‑time communication)
- PostgreSQL (users, trips, payments)
- Redis (optional – live location caching)
- JWT (authentication)

**Frontend**  
- React (Vite)
- React Router
- Leaflet + React‑Leaflet (maps)
- Socket.io‑client
- Axios (HTTP requests)
- CSS Glassmorphism + custom animations

**Deployment**  
- Railway (backend + database)
- Vercel (optional – for frontend only; not needed when monolithic)

---

## 📁 Project Structure
Uber App/
├── server.js # Express + Socket.io entry
├── package.json # Root dependencies & build scripts
├── .env # Environment variables
├── src/ # Backend source
│ ├── app.js # Express app setup
│ ├── config/
│ │ └── db.js # PostgreSQL connection pool
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── driverController.js
│ │ └── rideController.js
│ ├── middleware/
│ │ └── auth.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── drivers.js
│ │ └── rides.js
│ ├── utils/
│ │ ├── jwt.js
│ │ └── rideInsights.js # Free insight messages
│ └── db/
│ └── schema.sql # Database tables
├── client/ # React frontend
│ ├── package.json
│ ├── vite.config.js
│ ├── index.html
│ └── src/
│ ├── main.jsx
│ ├── App.jsx
│ ├── components/
│ ├── contexts/
│ ├── pages/
│ ├── services/
│ └── styles/
└── dist/ # Built frontend (served by Express)


---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** v18 or later
- **PostgreSQL** running locally (you can use a cloud instance too)
- **Redis** (optional – not required for basic flow)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/zippora.git
cd zippora

2. Install dependencies
The root package.json will install backend deps, and the postinstall script will also install the frontend dependencies.

bash
npm install
3. Set up the database
Create a PostgreSQL database (e.g., zippora)

Create a user and grant privileges

Run the schema file:

bash
psql -U your_user -d zippora -f src/db/schema.sql
(Make sure PostgreSQL is running on the port you specify in .env)

4. Configure environment variables
Rename .env.example to .env (or create a new one) and fill in:

env
PORT=4000
PG_HOST=localhost
PG_PORT=5432          # or your PostgreSQL port
PG_DATABASE=zippora
PG_USER=your_db_user
PG_PASSWORD=your_password
JWT_SECRET=some_random_secret
5. Build the frontend
bash
npm run build-client
This will create the dist/ folder that the backend serves.

6. Start the server
bash
npm run dev
Now open http://localhost:4000 – you’ll see the Zippora app.

🧪 Testing the API with Postman
A Postman collection is included (postman/Zippora.postman_collection.json) that covers the full flow:

Register/Login (rider & driver)

Driver goes online

Fare estimation

Ride request

Accept ride

Complete trip

Import the collection and run the requests in order. All requests use collection variables to store tokens and trip ID automatically.

📦 Deployment (Railway)
1. Push to GitHub
Commit your code (including the dist/ folder or build it on deploy) to a GitHub repository.

2. Deploy on Railway
Go to Railway.app

New Project → Deploy from GitHub → select your repo

Add a PostgreSQL database service – Railway will inject DATABASE_URL

Set environment variables:

JWT_SECRET

(No FRONTEND_URL needed – monolithic)

Run the database migration:
Use Railway’s PSQL command to connect and execute src/db/schema.sql

Railway will automatically build and start your app (it runs npm start)

3. Access your app
Generate a domain in Railway and your app is live!

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

📝 License
MIT

Built with ❤️ by R.S Designs

text

---

This README covers everything a developer or visitor to your repo needs. You can replace placeholder URLs, screenshots, and your name at the bottom. Let me know if you want to add a specific section (like Stripe integration or Redis setup) and I’ll enhance it.
