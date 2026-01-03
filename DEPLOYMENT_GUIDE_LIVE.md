# Deployment Guide: The Pizza Box

This guide explains how to deploy your **Backend API** to Render.com and your **Frontends** (Web & Admin) to Vercel.

## Step 1: Database (PostgreSQL)

You need a cloud database. You can use **Neon.tech** (Recommended for free tier), **Supabase**, or **Render's PostgreSQL**.

1.  Create a free account on [Neon.tech](https://neon.tech).
2.  Create a new Project.
3.  Copy the **Connection String** (It looks like `postgres://user:pass@host/neondb...`).
4.  Save this string; you will need it for the API.

---

## Step 2: Backend API (Render.com)

We use Render because it keeps the server running for Real-Time orders (Socket.io).

1.  Create an account on [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub account and select your repository: `The-Pizza-Box`.
4.  Fill in the settings:
    *   **Name:** `pizza-box-api` (or similar)
    *   **Region:** Singapore (or closest to you)
    *   **Root Directory:** `apps/api`
    *   **Environment:** Node
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm start`
5.  Scroll down to **Environment Variables** and add:
    *   `DATABASE_URL`: *(Paste the connection string from Step 1)*
    *   `JWT_SECRET`: `supersecretkey` (or generate a random long string)
    *   `NODE_ENV`: `production`
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish.
8.  **Copy the URL** provided by Render (e.g., `https://pizza-box-api.onrender.com`). You will need this for the frontends.

---

## Step 3: Customer Website (Vercel)

1.  Go to [Vercel.com](https://vercel.com) and Log in.
2.  Click **Add New...** -> **Project**.
3.  Import `The-Pizza-Box` repository.
4.  **Configure Project:**
    *   **Project Name:** `pizza-box-web`
    *   **Root Directory:** Click "Edit" and select `apps/web`.
    *   **Framework Preset:** Next.js (Default).
5.  **Environment Variables:**
    *   Click to expand.
    *   Key: `NEXT_PUBLIC_API_URL`
    *   Value: *(Paste your Render API URL from Step 2)*. **IMPORTANT:** Add `/api` to the end if your code expects it.
        *   *Check:* Your code usually expects `.../api`.
        *   *Example:* `https://pizza-box-api.onrender.com/api`
6.  Click **Deploy**.

---

## Step 4: Admin Panel (Vercel)

1.  Go to Vercel Dashboard.
2.  Click **Add New...** -> **Project**.
3.  Import `The-Pizza-Box` repository (Again).
4.  **Configure Project:**
    *   **Project Name:** `pizza-box-admin`
    *   **Root Directory:** Click "Edit" and select `apps/admin`.
5.  **Environment Variables:**
    *   Key: `NEXT_PUBLIC_API_URL`
    *   Value: *(Paste your Render API URL from Step 2)*. **IMPORTANT:** Add `/api` to the end.
        *   *Example:* `https://pizza-box-api.onrender.com/api`
6.  Click **Deploy**.

---

## Step 5: Final Check

1.  Open your **Admin Panel URL**. Login.
2.  Go to **Menu**.
3.  Open your **Customer Website URL** on your phone or another tab.
4.  Place an Order.
5.  Watch the **Kitchen Board** on the Admin Panel. It should update instantly!
