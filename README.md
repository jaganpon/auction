# Cricket Auction Management System

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Installation](#installation)
6. [File Structure](#file-structure)
7. [User Workflows](#user-workflows)
8. [Component Documentation](#component-documentation)
9. [API Integration](#api-integration)
10. [Future Enhancements](#future-enhancements)
11. [Prompt Engineering Guide](#prompt-engineering-guide)

---

## 🎯 Project Overview

A comprehensive web-based cricket auction management system that allows organizations to conduct player auctions for multiple tournaments (Men's, Women's, U-19, etc.) with role-based access control, real-time budget tracking, and tournament-specific player management.

### Key Capabilities

- **Multiple Tournament Support**: Create and manage separate tournaments with independent player pools
- **Role-Based Access Control**: Admin, Auctioneer, and Guest roles with specific permissions
- **Tournament-Specific Players**: Each tournament maintains its own player database
- **Flexible Player Upload**: Append new players or replace entire lists
- **Live Auction**: Random player selection with budget validation
- **Dashboard View**: Tournament cards → Team cards → Player lists (hierarchical navigation)

---

## ✨ Features

### 1. Authentication & Authorization

- **Login-First Flow**: Application requires authentication before any access
- **Three User Roles**:
  - **Admin**: Full access to Control Panel and Auction Panel
  - **Auctioneer**: Access to Auction Panel only
  - **Guest**: View-only access to Dashboard
- **Guest Login**: One-click guest access without credentials
- **Session Management**: Token-based authentication with role validation

### 2. Dashboard (Landing Page After Login)

- **Tournament Cards**: Visual cards showing all tournaments
- **Overall Statistics**: Total tournaments, teams, budget, and players
- **Hierarchical Navigation**:
  1. Select Tournament → View all teams in that tournament
  2. Select Team → View all players in that team
  3. Read-only view for all users
- **Budget Visualization**: Progress bars showing budget utilization

### 3. Control Panel (Admin Only)

#### a. Tournaments Tab

- Create new tournaments with name, teams, and budgets
- View all existing tournaments
- Tournament-level statistics

#### b. Players Tab

- **Tournament Selection**: Choose tournament to upload players
- **Excel Upload**: Upload player data (.xlsx/.xls files)
- **Upload Modes**:
  - **Append**: Add new players to existing list (duplicates skipped)
  - **Replace**: Clear all existing players and upload fresh list
- **Player Table**: View all players for selected tournament

#### c. Team Management Tab

- Select tournament and team
- **Add Player**: Manual player entry with budget validation
- **Remove Player**: Delete player from team (restores budget)
- **View Team**: Emp ID, Name, Type, Bid Amount

### 4. Auction Panel (Admin + Auctioneer)

- **Tournament Selection**: Choose tournament for auction
- **Auction Configuration**: (Future) Set player category order
- **Random Player Display**: Shows unassigned players randomly
- **Team Assignment**: Select team and enter bid amount
- **Budget Validation**: Prevents over-budget assignments
- **Progress Tracking**: Shows assigned vs remaining players
- **Team Summary**: Real-time budget and player count updates

### 5. Data Management

- **Tournament-Specific Players**: Each tournament has independent player pool
- **Duplicate Prevention**: emp_id uniqueness within each tournament
- **Budget Tracking**: Real-time calculation per team
- **Player Assignment**: One player can only be in one tournament

---

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Excel Processing**: SheetJS (xlsx library)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Routing**: Single Page Application (SPA) with view switching

### Backend (Future Integration)

- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens
- **API**: RESTful API

### Development

- **Build Tool**: Vite
- **Package Manager**: npm
- **Code Style**: ES6+ with JSX
- **File Extensions**: .jsx for components, .js for utilities

---

## 🔐 User Roles & Permissions

### 1. Admin

**Access Level**: Full Control

**Can Access**:

- ✅ Dashboard (view all tournaments and teams)
- ✅ Control Panel
  - Create/manage tournaments
  - Upload/manage players
  - Assign/remove players from teams
- ✅ Auction Panel
  - Conduct auctions
  - Assign players to teams

**Credentials**: `admin` / `admin123`

### 2. Auctioneer

**Access Level**: Auction Only

**Can Access**:

- ✅ Dashboard (view all tournaments and teams)
- ✅ Auction Panel
  - Conduct auctions
  - Assign players to teams
- ❌ Control Panel (no access)

**Credentials**: `auctioneer` / `auction123`

### 3. Guest

**Access Level**: View Only

**Can Access**:

- ✅ Dashboard (view all tournaments and teams)
- ❌ Control Panel (no access)
- ❌ Auction Panel (no access)

**Credentials**: `guest` / `guest123` OR click "Continue as Guest"

---

## 💻 Installation

### Prerequisites

```bash
Node.js >= 16.0.0
npm >= 7.0.0
```

### Step 1: Create Vite Project

```bash
npm create vite@latest cricket-auction-frontend -- --template react
cd cricket-auction-frontend
```

### Step 2: Install Dependencies

```bash
npm install
npm install axios react-router-dom xlsx lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Configure Tailwind

Update `tailwind.config.js`:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Step 4: Update index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 5: Copy Project Files

Copy all provided files to their respective locations (see File Structure below).

### Step 6: Run Development Server

```bash
npm run dev
```

Access at: `http://localhost:5173`

---

## 📁 File Structure

```
cricket-auction-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── AddPlayerModal.jsx          # Manual player entry form
│   │   ├── AuctionPanel.jsx            # Auction interface
│   │   ├── CreateTournament.jsx        # Tournament creation wizard
│   │   ├── Header.jsx                  # Navigation header with role-based buttons
│   │   ├── LoginModal.jsx              # Authentication modal
│   │   ├── PlayerUploadModal.jsx       # Excel upload with append/replace
│   │   ├── TeamCard.jsx                # Team display card
│   │   └── TeamDetailModal.jsx         # Team player list modal
│   ├── pages/
│   │   ├── Dashboard.jsx               # Main dashboard (tournament cards)
│   │   └── ControlPanel.jsx            # Admin control panel
│   ├── context/
│   │   └── AuthContext.jsx             # Authentication context
│   ├── hooks/
│   │   └── useAuth.js                  # Auth hook
│   ├── services/
│   │   └── api.js                      # API service layer
│   ├── utils/
│   │   └── excelParser.js              # Excel file processing
│   ├── App.jsx                         # Main app component
│   ├── index.jsx                       # App entry point
│   └── index.css                       # Global styles
├── .env                                # Environment variables
├── vite.config.js                      # Vite configuration
├── tailwind.config.js                  # Tailwind configuration
├── postcss.config.js                   # PostCSS configuration
├── package.json                        # Dependencies
└── README.md                           # This file
```

---

## 🔄 User Workflows

### Workflow 1: Admin - Create Tournament and Upload Players

```
Step 1: Login as Admin
→ Enter: admin / admin123
→ Dashboard appears

Step 2: Create Tournament
→ Click "Control Panel" button
→ Go to "Tournaments" tab
→ Click "Create Tournament"
→ Enter tournament name: "Men's IPL 2024"
→ Select number of teams: 8
→ Enter team names and budgets
→ Save

Step 3: Upload Players
→ Go to "Players" tab
→ Select Tournament: "Men's IPL 2024"
→ Click "Upload Excel File"
→ Choose file
→ Select mode (first time = no choice, auto Replace)
→ Upload successful → Players appear in table

Step 4: Add More Players (Append)
→ Upload another Excel file
→ Modal shows "Append or Replace"
→ Choose "Append"
→ New players added, duplicates skipped
```

### Workflow 2: Admin - Manual Team Assignment

```
Step 1: Go to Control Panel
→ "Team Management" tab

Step 2: Select Tournament and Team
→ Tournament dropdown: "Men's IPL 2024"
→ Team dropdown: "Mumbai Indians"

Step 3: Add Player
→ Click "Add Player"
→ Enter: Emp ID, Name, Type, Bid Amount
→ Save
→ Budget deducts automatically

Step 4: Remove Player
→ Click trash icon next to player
→ Confirm removal
→ Budget restores
```

### Workflow 3: Auctioneer - Conduct Auction

```
Step 1: Login as Auctioneer
→ Enter: auctioneer / auction123

Step 2: Go to Auction Panel
→ Click "Auction Panel" button

Step 3: Select Tournament
→ Choose "Men's IPL 2024"
→ Shows available players count
→ Click "Start Auction"

Step 4: Assign Players
→ Random player appears
→ Select team from dropdown
→ Enter bid amount
→ Click "Assign Player"
→ Budget validates
→ Next random player appears

Step 5: Complete Auction
→ Continue until all players assigned
→ "Auction Complete" message appears
```

### Workflow 4: Guest - View Teams

```
Step 1: Guest Login
→ Click "Continue as Guest" button

Step 2: View Dashboard
→ See all tournament cards
→ Click on "Men's IPL 2024" card

Step 3: View Teams
→ See all teams in tournament
→ Click on "Mumbai Indians" card

Step 4: View Players
→ Modal opens showing all players
→ Read-only view (no add/remove)
```

---

## 📦 Component Documentation

### Core Components

#### 1. App.jsx

**Purpose**: Main application component with routing and authentication

**State**:

```javascript
tournaments: []; // Array of tournament objects
currentView: string; // 'dashboard', 'control', 'auction'
showLoginModal: boolean;
```

**Key Functions**:

- `handleLogin()`: Authenticates user and sets view
- `handleControlPanelClick()`: Validates admin role
- `handleAuctionPanelClick()`: Validates admin/auctioneer role

#### 2. Dashboard.jsx

**Purpose**: Main landing page after login with tournament selection

**Features**:

- Tournament cards with statistics
- Hierarchical navigation (Tournament → Teams → Players)
- Overall statistics display
- Back navigation

**State**:

```javascript
selectedTournament: object | null;
selectedTeam: object | null;
showTeamDetail: boolean;
```

#### 3. ControlPanel.jsx

**Purpose**: Admin interface for tournament and player management

**Tabs**:

1. **Tournaments**: Create/view tournaments
2. **Players**: Upload players per tournament
3. **Team Management**: Assign/remove players

**Key Functions**:

```javascript
handleCreateTournament(data);
handlePlayerUpload(file, mode); // mode: 'append' | 'replace'
handleAddPlayerToTeam(player);
handleRemovePlayer(tournamentId, teamId, empId);
```

#### 4. AuctionPanel.jsx

**Purpose**: Conduct player auctions with random selection

**Features**:

- Tournament selection
- Random unassigned player display
- Team selection with budget info
- Budget validation
- Progress tracking

**Key Functions**:

```javascript
getRandomPlayer(); // Select random unassigned player
handleAssign(); // Assign player to team
```

#### 5. PlayerUploadModal.jsx

**Purpose**: Handle Excel upload with append/replace options

**Props**:

```javascript
isOpen: boolean
onClose: function
onUpload: function(file, mode)
existingPlayerCount: number
```

**Features**:

- Visual mode selection (Append/Replace)
- Warnings for Replace mode
- File validation

---

## 🔌 API Integration

### Ready for Backend Integration

The application is designed to easily integrate with a FastAPI backend. All mock authentication and data operations can be replaced with actual API calls.

### API Endpoints (To Be Implemented)

#### Authentication

```
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
GET    /api/auth/verify         - Verify token
```

#### Tournaments

```
GET    /api/tournaments         - Get all tournaments
POST   /api/tournaments         - Create tournament
GET    /api/tournaments/:id     - Get tournament details
PUT    /api/tournaments/:id     - Update tournament
DELETE /api/tournaments/:id     - Delete tournament
```

#### Players

```
POST   /api/tournaments/:id/players/upload     - Upload players
GET    /api/tournaments/:id/players            - Get players
POST   /api/tournaments/:id/players            - Add player
DELETE /api/tournaments/:id/players/:empId     - Remove player
```

#### Teams

```
GET    /api/tournaments/:id/teams              - Get teams
POST   /api/tournaments/:id/teams/:teamId/players  - Add player to team
DELETE /api/tournaments/:id/teams/:teamId/players/:empId  - Remove player
```

#### Auction

```
POST   /api/auction/assign                     - Assign player in auction
GET    /api/tournaments/:id/auction/status     - Get auction status
```

### Example API Service Update

```javascript
// src/services/api.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Authentication
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    username,
    password,
  });
  return response.data;
};

// Tournaments
export const createTournament = async (tournamentData) => {
  const response = await axios.post(
    `${API_URL}/api/tournaments`,
    tournamentData
  );
  return response.data;
};

// Players
export const uploadPlayers = async (tournamentId, file, mode) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode);

  const response = await axios.post(
    `${API_URL}/api/tournaments/${tournamentId}/players/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};
```

---

## 🚀 Future Enhancements

### Phase 1: Auction Configuration

**Feature**: Configure auction player order by category

**Implementation**:

```javascript
// Add to tournament creation
auctionConfig: {
  order: ['Batsman', 'Bowler', 'Wicket-keeper', 'All-rounder'],
  counts: {
    'Batsman': 20,
    'Bowler': 15,
    'Wicket-keeper': 5,
    'All-rounder': 10
  }
}
```

**UI Changes**:

- AuctionConfig modal before starting auction
- Progress bar per category
- Auto-switch to next category when complete

### Phase 2: Match Fixtures

**Feature**: Create match schedules within tournaments

**Schema**:

```javascript
tournament: {
  fixtures: [
    {
      id: 1,
      date: "2024-03-15",
      time: "19:00",
      team1: "Mumbai Indians",
      team2: "Chennai Super Kings",
      venue: "Wankhede Stadium",
      status: "scheduled" | "live" | "completed",
    },
  ];
}
```

**UI Components**:

- FixtureScheduler.jsx (in Control Panel)
- UpcomingMatches.jsx (in Dashboard)
- MatchCard.jsx

### Phase 3: Player Statistics

**Feature**: Track player performance across matches

**Data Structure**:

```javascript
player: {
  stats: {
    matchesPlayed: 0,
    runs: 0,
    wickets: 0,
    catches: 0,
    avgBattingScore: 0,
    avgBowlingEconomy: 0
  }
}
```

**Components**:

- PlayerStatsModal.jsx
- LeaderboardTable.jsx

### Phase 4: Live Auction Streaming

**Feature**: Real-time auction updates across multiple devices

**Technology**:

- WebSocket connection
- Server-Sent Events (SSE)
- Firebase Realtime Database

**Use Cases**:

- Multiple devices viewing same auction
- Live budget updates
- Real-time player assignments

### Phase 5: Analytics Dashboard

**Feature**: Advanced analytics and insights

**Metrics**:

- Most expensive players
- Budget utilization by team
- Player type distribution
- Auction trends
- Team strength analysis

**Visualizations**:

- Charts (Recharts library)
- Graphs (D3.js)
- Heatmaps
- Comparison tables

### Phase 6: Mobile Application

**Technology**: React Native

**Features**:

- Cross-platform (iOS/Android)
- Push notifications for auction updates
- Offline mode for viewing data
- QR code scanning for quick player lookup

### Phase 7: Advanced Features

1. **Player Trading System**: Allow teams to trade players mid-season
2. **Draft System**: Alternative to auction (snake draft)
3. **Salary Cap Validation**: Enforce minimum/maximum spending rules
4. **Multi-Season Support**: Historical data across seasons
5. **Export Reports**: PDF/Excel reports of teams and statistics
6. **Email Notifications**: Auto-send team rosters to owners
7. **Social Sharing**: Share team cards on social media
8. **Player Comparison Tool**: Compare player statistics
9. **Budget Forecasting**: Predict remaining budget needs
10. **Undo/Redo**: Rollback auction assignments

---

## 📖 Prompt Engineering Guide

### How to Request New Features

When requesting new features or modifications, use this prompt template:

```
I want to add [FEATURE_NAME] to the Cricket Auction System.

CURRENT BEHAVIOR:
[Describe what currently happens]

DESIRED BEHAVIOR:
[Describe what you want to happen]

AFFECTED COMPONENTS:
[List components that need changes]

DATA STRUCTURE:
[If applicable, describe data model changes]

USER ROLE:
[Which roles should access this feature]

UI REQUIREMENTS:
[Describe UI elements needed]

EXAMPLE WORKFLOW:
Step 1: [User action]
Step 2: [System response]
Step 3: [Result]
```

### Example Prompt: Add Player Search

```
I want to add PLAYER SEARCH functionality to the Cricket Auction System.

CURRENT BEHAVIOR:
In the Players tab, users see a table with all players but cannot search or filter them.

DESIRED BEHAVIOR:
Add a search bar above the players table that allows filtering by:
- Player name
- Employee ID
- Player type (Batsman/Bowler/etc.)

AFFECTED COMPONENTS:
- ControlPanel.jsx (Players tab)
- New: PlayerSearchBar.jsx component

DATA STRUCTURE:
No changes to data structure. Uses existing tournament.players array.

USER ROLE:
Admin only (Control Panel access required)

UI REQUIREMENTS:
- Search input field with icon
- Filter dropdown for player type
- Clear filters button
- Show count: "Showing X of Y players"

EXAMPLE WORKFLOW:
Step 1: User types "Virat" in search box
Step 2: Table filters to show only players with "Virat" in name
Step 3: User selects "Batsman" from type filter
Step 4: Table shows only batsmen named Virat
Step 5: User clicks "Clear Filters" - all players shown again
```

### Example Prompt: Modify Budget Rules

````
I want to MODIFY BUDGET RULES to enforce minimum player spending.

CURRENT BEHAVIOR:
Teams can assign players with any bid amount as long as budget allows.

DESIRED BEHAVIOR:
- Set minimum bid amount (e.g., ₹100,000)
- Set maximum bid amount per player (e.g., 20% of team budget)
- Warn if team has spent less than 70% of budget at auction end

AFFECTED COMPONENTS:
- AuctionPanel.jsx (add validation)
- AddPlayerModal.jsx (add min/max validation)
- CreateTournament.jsx (add config for min bid)

DATA STRUCTURE:
Add to tournament:
```javascript
tournament: {
  auctionRules: {
    minBidAmount: 100000,
    maxBidPercentage: 20,
    minSpendPercentage: 70
  }
}
````

USER ROLE:

- Admin: Configure rules in tournament creation
- Admin/Auctioneer: Rules enforced during auction

UI REQUIREMENTS:

- Input fields in CreateTournament for rules
- Error messages in auction if rules violated
- Warning modal at auction end if min spend not met

EXAMPLE WORKFLOW:
Step 1: Admin creates tournament, sets min bid = ₹100,000
Step 2: Auctioneer tries to assign player with ₹50,000 bid
Step 3: Error: "Minimum bid is ₹100,000"
Step 4: Auctioneer enters ₹150,000
Step 5: Assignment successful

```

### Prompt Template for Bug Fixes

```

BUG REPORT: [Brief description]

STEPS TO REPRODUCE:

1. [First action]
2. [Second action]
3. [Error occurs]

EXPECTED RESULT:
[What should happen]

ACTUAL RESULT:
[What actually happens]

ERROR MESSAGES:
[Copy any error messages]

AFFECTED FILES:
[Which files might be causing the issue]

SUGGESTED FIX:
[If you have an idea]

```

### Prompt Template for Styling Changes

```

STYLING REQUEST: [Component/Page name]

CURRENT LOOK:
[Describe current appearance]

DESIRED LOOK:
[Describe desired appearance]

INSPIRATION:
[Link to similar designs or describe style]

COLORS:
[Specific colors if any]

RESPONSIVE BEHAVIOR:
[How it should look on mobile/tablet]

ACCESSIBILITY:
[Any specific accessibility requirements]

```

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] Login with admin credentials
- [ ] Login with auctioneer credentials
- [ ] Login with guest credentials
- [ ] Guest quick login button
- [ ] Logout and re-login
- [ ] Access denied messages for wrong roles

**Tournament Management**
- [ ] Create Men's tournament
- [ ] Create Women's tournament
- [ ] View both in dashboard
- [ ] Tournament stats accurate

**Player Upload**
- [ ] First upload (auto Replace)
- [ ] Append mode (no duplicates)
- [ ] Replace mode (clear old data)
- [ ] Duplicate detection works
- [ ] Invalid Excel file rejection

**Team Assignment**
- [ ] Manual player add
- [ ] Budget deduction correct
- [ ] Player removal works
- [ ] Budget restoration correct
- [ ] Duplicate prevention

**Auction**
- [ ] Tournament selection
- [ ] Random player appears
- [ ] Budget validation
- [ ] Player assignment
- [ ] Progress updates
- [ ] Auction completion

**Dashboard**
- [ ] Tournament cards display
- [ ] Click tournament → teams show
- [ ] Click team → players show
- [ ] Back navigation works
- [ ] Statistics accurate

---

## 📞 Support & Contact

For issues, questions, or contributions:
1. Check existing documentation
2. Review component code comments
3. Test with sample data
4. Create detailed bug report with prompt template

---

## 📄 License

This project is licensed under the MIT License.

---

**Version**: 2.0.0
**Last Updated**: December 2024
**Author**: Cricket Auction Team

**Happy Auctioning! 🏏**
```
