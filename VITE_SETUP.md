# Vite Setup Guide for Cricket Auction System

## Quick Start

### 1. Create Vite Project

```bash
npm create vite@latest cricket-auction-frontend -- --template react
cd cricket-auction-frontend
```

### 2. Install Dependencies

```bash
npm install
npm install axios react-router-dom xlsx lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. File Structure

Your project should look like this:

```
cricket-auction-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.jsx (rename from main.jsx)
│   └── index.css
├── index.html (in root, not in public/)
├── .env
├── .eslintrc.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### 4. Important Files to Update/Create

#### Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

#### Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

#### Update `src/index.jsx` (rename from main.jsx):
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Update `index.html` (in root directory):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cricket Auction System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

### 5. Key Differences from Create React App

| Feature | Create React App | Vite |
|---------|------------------|------|
| Environment Variables | `REACT_APP_*` | `VITE_*` |
| Access Env Vars | `process.env.REACT_APP_*` | `import.meta.env.VITE_*` |
| Entry File | `src/index.js` | `src/index.jsx` or