# Surplus-to-Shelter

A real-time food rescue routing platform. Turns a restaurant's unsold food into a shelter's next meal — before it hits the dumpster.

## Tech Stack
* **Frontend**: React (Vite) + Tailwind CSS (Light Theme Only)
* **Backend**: Node.js + Express
* **Database**: MongoDB (Mongoose)
* **Realtime**: Socket.IO

## Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas)

## Setup
1. Clone the repository
2. Set up environment variables by copying `.env.example` to `.env` in the root folder.
3. Install dependencies:
   * Client: `cd client && npm install`
   * Server: `cd server && npm install`
4. Seed the Database:
   * From the server folder, run: `npm run seed` 
   * This provides demo data (3 recipient orgs, sample donations, users).
5. Start development servers:
   * Server: `cd server && npm run dev`
   * Client: `cd client && npm run dev`