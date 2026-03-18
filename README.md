# CampusNetra - University Management System

A full-stack university management system with real-time chat and announcement capabilities.

## 🚀 One-Click Deployment Structure

This repository is optimized for monorepo deployment:
- **Frontend**: Designed for [Cloudflare Pages](https://pages.cloudflare.com/).
- **Backend**: Designed for Node.js hosts (e.g., [Render](https://render.com/), [Railway](https://railway.app/)).

### Deployment Instructions

#### 1. Database (MySQL or SQLite/D1)
The file `database/campus_netra.sql` has been updated to be compatible with **both MySQL and SQLite/D1**. 
- If using **Cloudflare D1**, run: `wrangler d1 execute <db-name> --file=database/campus_netra.sql`
- If using **MySQL**, import it as usual.

#### 2. Frontend (Cloudflare Pages)
- **Repo**: Connect this GitHub repository.
- **Root Directory**: Project root.
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Env Variable**: `VITE_API_URL` = (Your Backend Worker URL)

#### 3. Backend (Cloudflare Workers)
- **Deployment**: Run `npx wrangler deploy` from the root.
- **Requirement**: Set your D1 database ID in `wrangler.toml` first.
- **Env Variables**: Set `JWT_SECRET` in the Cloudflare dashboard.

## 🛠️ Local Development
```bash
npm run install:all # Install all dependencies
npm run dev:client  # Start Vite frontend
npm run dev:server  # Start Node.js backend
```