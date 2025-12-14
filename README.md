# Cricket Auction System - Frontend

A comprehensive web-based cricket auction management system built with React, allowing administrators to manage players, create teams, and conduct live auctions.

## 🚀 Features

### Authentication & Authorization
- Secure login system for Control Panel access
- Session management with JWT tokens
- Default credentials: `admin` / `admin123`

### Player Management
- Excel file upload (.xlsx, .xls formats)
- Automatic parsing and validation
- Duplicate detection
- Player assignment tracking

### Team Management
- Create tournaments with 1-12 teams
- Set team budgets
- View team compositions
- Add/remove players manually
- Real-time budget tracking

### Auction System
- Random player selection
- Live bidding interface
- Budget validation
- Auto-assignment to teams
- Progress tracking

### Dashboard
- Team cards with statistics
- Player distribution overview
- Budget utilization tracking
- Click-to-view detailed player lists

## 📋 Prerequisites

- Node.js 16+ and npm
- Modern web browser

## 🛠️ Installation

### 1. Create React App

```bash
npx create-react-app cricket-auction-frontend
cd cricket-auction-frontend
```

### 2. Install Dependencies

```bash
npm install axios react-router-dom xlsx lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Project Structure

Create the following folder structure:

```
cricket-auction-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── LoginModal.jsx
│   │   ├── TeamCard.jsx
│   │   ├── TeamDetailModal.jsx
│   │   ├── PlayerTable.jsx
│   │   ├── CreateTournament.jsx
│   │   ├── AddPlayerModal.jsx
│   │   └── AuctionPanel.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── ControlPanel.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── excelParser.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

### 4. Copy Files

Copy all the provided files to their respective locations in the project structure.

### 5. Configure Tailwind CSS

Update `tailwind.config.js` as provided in the files.

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Environment Variables

Create `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

## 🎯 Usage

### Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

### Default Login Credentials

```
Username: admin
Password: admin123
```

## 📊 Excel File Format

Your Excel file should have the following columns:

| Column Name  | Required | Description                          |
|-------------|----------|--------------------------------------|
| emp_id      | Yes      | Unique employee identifier           |
| player_name | Yes      | Player's full name                   |
| player_type | Yes      | Batsman/Bowler/All-rounder/Wicket-keeper |
| image_url   | No       | URL to player image (optional)       |

### Sample Excel Data

```
emp_id    | player_name      | player_type    | image_url
----------|------------------|----------------|------------------
EMP001    | Virat Kohli      | Batsman        | https://...
EMP002    | Jasprit Bumrah   | Bowler         | https://...
EMP003    | Hardik Pandya    | All-rounder    | https://...
EMP004    | Rishabh Pant     | Wicket-keeper  | https://...
```

## 🎮 How to Use

### Step 1: Upload Players
1. Click "Control Panel" button
2. Login with credentials
3. Go to "Players" tab
4. Click "Upload Excel File"
5. Select your Excel file
6. Players will be displayed in the table

### Step 2: Create Tournament
1. Click "Create Tournament" button
2. Select number of teams (1-12)
3. Enter team names and budgets
4. Click "Save Tournament"

### Step 3: Conduct Auction
1. Click "Auction Panel" button (public access)
2. A random unassigned player will be displayed
3. Select a team from dropdown
4. Enter bid amount
5. Click "Assign Player"
6. Process repeats until all players are assigned

### Step 4: Team Management
1. Go to "Team Management" tab in Control Panel
2. Select a team from dropdown
3. View team players and budget
4. Add players manually using "Add Player" button
5. Remove players using trash icon

## 🔧 Configuration

### API Integration

To integrate with backend API, update `src/services/api.js`:

```javascript
// Update the API endpoints to match your backend
export const authAPI = {
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  // ... other endpoints
};
```

### Styling Customization

Modify colors and themes in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## 🔍 Features in Detail

### Control Panel (Authenticated)
- **Players Tab**: Upload and manage player database
- **Teams Tab**: View all created teams
- **Team Management**: Add/remove players from teams

### Auction Panel (Public)
- **Random Selection**: Picks unassigned players randomly
- **Budget Validation**: Prevents over-budget assignments
- **Live Updates**: Team cards update in real-time
- **Progress Tracking**: Shows remaining players

### Landing Page (Public)
- **Team Cards**: Visual representation of all teams
- **Statistics**: Total players, budgets, spending
- **Click to View**: Detailed player list per team

## 🛡️ Security Features

- JWT token-based authentication
- Protected routes for Control Panel
- Input validation
- File upload validation
- XSS protection

## 🐛 Troubleshooting

### Excel Upload Not Working
- Ensure file is .xlsx or .xls format
- Check column names match exactly
- File size should be under 10MB

### Players Not Showing
- Verify Excel data has all required columns
- Check browser console for errors
- Ensure no duplicate emp_id values

### Teams Not Created
- Ensure all team names are filled
- Budget values must be positive numbers
- Select between 1-12 teams

## 📝 Notes

- All data is stored in React state (in-memory)
- Data will be lost on page refresh
- For persistent storage, integrate with backend API
- Mock authentication is used (replace with actual API)

## 🔄 State Management

Current implementation uses React's useState for simplicity. For larger scale:

```bash
# Optional: Add Redux
npm install @reduxjs/toolkit react-redux
```

## 🎨 UI Components

Built with:
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon library
- **SheetJS**: Excel file processing

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (320px+)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions:
- Check existing issues
- Create new issue with detailed description
- Include error messages and screenshots

## 🎯 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Advanced player statistics
- [ ] Export functionality (PDF/Excel)
- [ ] Multiple auction rounds
- [ ] Player trading system
- [ ] Mobile app version
- [ ] Email notifications
- [ ] Role-based access control

## 📞 Contact

For more information or support, please open an issue in the repository.

---

**Happy Auctioning! 🏏**
