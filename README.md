# Vinyl Record Collection Tracker
### Setup Guide for Windows, Step by Step

---

## Before You Start, You Need These

1. **Node.js** :- download from https://nodejs.org (LTS version, green button)
2. **A free MongoDB Atlas account** :- database in the cloud (free forever tier)
3. **A Discogs account + personal token** :- for the search feature

---

## Step 1, Set Up MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account
2. Click **"Build a Database"** > choose **M0 Free** > any region > click **Create**
3. When asked to create a user:
   - Username:- `vinyluser`
   - Password:- make something up and **write it down**
   - Click **Create User**
4. When asked about IP access > click **"Add My Current IP Address"**, then **Finish**
5. Back on the dashboard, click **Connect** > **Compass** > copy the connection string
   - It looks like:- `mongodb+srv://vinyluser:PASSWORD@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add `vinyl-tracker` at the end before the `?`:
   - Final result:- `mongodb+srv://vinyluser:PASSWORD@cluster0.xxxxx.mongodb.net/vinyl-tracker?retryWrites=true&w=majority`

---

## Step 2, Get Your Discogs Token

1. Log in at https://www.discogs.com
2. Click your profile picture > **Settings** > **Developers** tab
3. Click **Generate new token**
4. Copy the token (a long string of letters and numbers)

---

## Step 3, Set Up the Server

Open **Command Prompt** (press Windows key, type `cmd`, press Enter).

```
cd Desktop
cd vinyl-tracker
cd server
```

Create your `.env` file (this holds your secret keys):
- In File Explorer, go into the `server` folder
- Copy the file `.env.example` and rename the copy to `.env`
- Open `.env` in Notepad and fill in your values:

```
MONGO_URI=your_mongodb_connection_string_from_step_1
JWT_SECRET=any_long_random_phrase_you_make_up_eg_myvinylapp2024secret
DISCOGS_TOKEN=your_discogs_token_from_step_2
PORT=5000
```

Save and close. Then back in Command Prompt:

```
npm install
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:5000
```

**Leave this window open.**

---

## Step 4, Set Up the Client (React)

Open a **second** Command Prompt window:

```
cd Desktop
cd vinyl-tracker
cd client
npm install
npm start
```

This will take 1–2 minutes the first time. When it's done, your browser will automatically open at **http://localhost:3000**

---

## Step 5, Use the App

1. Click **Register** and create an account with any email/password
2. Log in
3. Click **+ Add Record**
4. Use the **Search Discogs** box to find a record and auto-fill the details
5. Click **Add to Collection**

---

## Troubleshooting

 Problem - Fix
 ``` - ```
 `npm not found` :- Restart Command Prompt after installing Node.js 
 `Cannot connect to MongoDB` :- Check your MONGO_URI in .env, make sure password has no special characters 
 `Discogs search failed` :- Check DISCOGS_TOKEN in .env, no spaces around the = sign 
 `Port 5000 already in use` :- Change PORT=5001 in .env and restart the server 
 Browser shows blank page :- Make sure the server is running in the first CMD window 

---

## File Structure Reference

```
vinyl-tracker/
- server/                 < Express API (runs on port 5000)
   - controllers/        < Business logic
   - middleware/         < JWT authentication check
   - models/             < MongoDB schemas
   - routes/             < API endpoints
   - .env                < YOUR SECRET KEYS (never share this)
   - server.js           < Entry point

- client/                 < React app (runs on port 3000)
   - src/
      - components/     < RecordCard, RecordModal
      - context/        < Auth state (login/logout)
      - pages/          < LoginPage, Dashboard
      - services/       < All API calls
```
