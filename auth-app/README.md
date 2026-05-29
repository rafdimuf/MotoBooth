# MotoBooth Google Authentication with Supabase (React + Vite)

A premium, production-ready, minimalist responsive React + Vite + TailwindCSS frontend application incorporating Supabase Google OAuth, route protection, persistent session handling, state animations, and notifications.

---

## ⚡ Prerequisites

To run this React application locally, you will need **Node.js** (v18 or higher) and **npm** installed on your system.

### How to Install Node.js
1. Go to [nodejs.org](https://nodejs.org/).
2. Download the **LTS (Long Term Support)** installer for your Operating System (Windows).
3. Run the installer and proceed with the standard settings (ensure the "Add to PATH" option is checked).
4. Restart your terminal/PowerShell window to refresh environment variables.
5. Verify your installation by running:
   ```bash
   node -v
   npm -v
   ```

---

## 🚀 Getting Started

Follow these steps to run the authentication flow locally:

### 1. Navigate to the project directory
Open your terminal or PowerShell and go to the `auth-app` folder:
```powershell
cd f:\Motobooth\auth-app
```

### 2. Configure Environment Variables
Open the `.env` file in the `auth-app` folder and fill in your Supabase details:
```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

### 3. Install Dependencies
Run the install command to fetch all libraries (Vite, React, React Router, Supabase, Tailwind, Lucide, Hot Toast):
```bash
npm install
```

### 4. Run Development Server
Start Vite's super-fast development server:
```bash
npm run dev
```
The application will automatically launch in your default web browser at `http://localhost:3000`.

---

## 🔐 Supabase Google OAuth Setup Guide

To ensure that your Google Sign-in flow operates smoothly, configure the settings in your Google Cloud Console and Supabase Dashboard:

### 1. Google Cloud Console
1. Create a project at [Google Cloud Console](https://console.cloud.google.com/).
2. Search and go to the **OAuth Consent Screen** section. Fill in the required details and add your email.
3. Navigate to **Credentials** -> **Create Credentials** -> **OAuth Client ID**.
4. Select **Web Application** as application type.
5. In **Authorized redirect URIs**, add the callback URL provided by Supabase. You can find this inside your **Supabase Dashboard** under **Auth** -> **Providers** -> **Google**. It typically looks like:
   `https://[your-project-id].supabase.co/auth/v1/callback`
6. Copy your **Client ID** and **Client Secret**.

### 2. Supabase Dashboard
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and navigate to **Auth** -> **Providers** -> **Google**.
3. Toggle Google provider **ON**.
4. Paste your **Client ID** and **Client Secret** copied from Google Cloud Console.
5. Save settings.
6. In **Auth** -> **URL Configuration**:
   - Set **Site URL** to `http://localhost:3000` (for local development) or your live Vercel URL.
   - In **Redirect URLs**, add `http://localhost:3000/dashboard` and your live URL redirect target (e.g. `https://your-app.vercel.app/dashboard`).

---

## 📦 Deployment to Vercel

Vercel offers the best native hosting support for React + Vite projects.

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Login to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your Git repository.
5. Select the **Root Directory** as `auth-app`.
6. Set the **Framework Preset** to **Vite** (Vercel auto-detects this).
7. Under **Environment Variables**, add:
   * Key: `VITE_SUPABASE_URL` | Value: *Your live Supabase URL*
   * Key: `VITE_SUPABASE_ANON_KEY` | Value: *Your live Supabase Anon Key*
8. Click **Deploy**!

### Option B: Via Vercel CLI (Command Line)
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Navigate to your project folder and run deployment:
   ```bash
   vercel
   ```
3. Follow the CLI wizard to link your account.
4. Add your production environment variables when prompted or configure them in your Vercel Project dashboard.
5. Build and publish to production:
   ```bash
   vercel --prod
   ```

---

## 🎨 Design System & Framework Features
- **Clean Architecture**: Standard React Context (`AuthContext.jsx`) acts as a central brain, shielding pages from asynchronous session null states.
- **Glassmorphism Theme**: Semi-transparent card layouts (`bg-white/70 backdrop-blur-md`) with borders matching the MotoBooth color palette.
- **Responsive Layout**: Works out-of-the-box on smartphones, tablets, and wide screens.
- **Persistent Sessions**: Automated OAuth state synchronization via Supabase subscription channels prevents infinite re-render loop errors and persistent login bugs.
