# Cricket Auction Frontend

A modern React-based web application for managing cricket player auctions with real-time bidding and team management.

## 🚀 Features

- **User Authentication** with role-based access (Admin, Auctioneer, Guest)
- **Session Management** with auto-logout and extension warnings
- **Tournament Management** - Create and manage multiple tournaments
- **Team Management** - Configure teams with budgets
- **Player Management** - Upload players via CSV/Excel files
- **Live Auction** - Real-time player bidding with auto-next player flow
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:8000`

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   cd cricket-auction-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📦 Dependencies

### Core Libraries

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework

### Development Tools

- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting

## 🏗️ Project Structure

```
cricket-auction-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ProtectedRoute.jsx
│   │   └── Navbar.jsx
│   ├── context/            # React context providers
│   │   └── AuthContext.jsx
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TournamentSetup.jsx
│   │   ├── AuctionPanel.jsx
│   │   └── TournamentView.jsx
│   ├── App.jsx             # Main app component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🔑 Authentication & Session Management

### Login Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Auctioneer**: username: `auctioneer`, password: `auction123`
- **Guest**: username: `guest`, password: `guest123`

### Session Features

- **2-hour session duration** - Automatic logout after inactivity
- **10-minute warning** - Popup appears before session expires
- **Session extension** - Extend session by 2 more hours
- **Persistent authentication** - Stays logged in after page refresh
- **Auto-redirect** - Returns to the page you were on after login

## 📄 File Upload Format

### Supported Formats

- CSV (`.csv`)
- Excel Modern (`.xlsx`)
- Excel Legacy (`.xls`)

### Required Columns

| Column Name | Type   | Description                         |
| ----------- | ------ | ----------------------------------- |
| emp_id      | String | Unique player identifier            |
| name        | String | Player name                         |
| type        | String | Player type (Batsman, Bowler, etc.) |

### Sample CSV Format

```csv
emp_id,name,type
EMP001,Virat Kohli,Batsman
EMP002,Jasprit Bumrah,Bowler
EMP003,Hardik Pandya,All-Rounder
```

## 🎯 User Roles & Permissions

### Admin

- ✅ Create/edit/delete tournaments
- ✅ Manage teams and budgets
- ✅ Upload player lists
- ✅ Conduct auctions
- ✅ View all data

### Auctioneer

- ✅ Conduct auctions
- ✅ Assign players to teams
- ✅ View tournament data
- ❌ Cannot modify tournament settings

### Guest

- ✅ View tournaments
- ✅ View team compositions
- ❌ Cannot make changes
- ❌ Cannot access auction panel

## 🔄 Auction Workflow

1. **Select Tournament** - Choose from available tournaments
2. **Start Auction** - System loads first unassigned player
3. **Bidding Process**:
   - View current player details
   - Select winning team
   - Enter bid amount
   - Assign player
4. **Auto-Next** - System automatically loads next player
5. **Complete** - Auction ends when all players are assigned

## 🎨 Theming & Customization

### Tailwind Configuration

Edit `tailwind.config.js` to customize:

- Colors
- Fonts
- Spacing
- Breakpoints

### CSS Variables

Modify `src/index.css` for global styles:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
}
```

## 🚀 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution**: Ensure backend is running on `http://localhost:8000`

### Issue: "Session keeps expiring"

**Solution**: Check browser's localStorage is enabled and not cleared

### Issue: "File upload fails"

**Solution**: Verify file format matches requirements (CSV/XLSX/XLS with correct columns)

### Issue: "Page redirects to login on refresh"

**Solution**: Make sure AuthContext is properly wrapped around your app

## 📚 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔧 Configuration

### API URL Configuration

Update API URL in your `.env` file or directly in components:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
```

### Port Configuration

Change Vite dev server port in `vite.config.js`:

```javascript
export default {
  server: {
    port: 3000, // Change from default 5173
  },
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Contact the development team

## 🔄 Updates & Maintenance

- Keep dependencies updated regularly
- Review security advisories
- Test thoroughly before deploying
- Backup data before major updates
