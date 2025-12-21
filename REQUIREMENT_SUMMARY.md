# Cricket Auction System - Complete Requirements

## 🔐 Authentication & Authorization

### Three User Roles:

1. **Admin** - Full access to Control Panel and Auction Panel
2. **Auctioneer** - Access to Auction Panel only
3. **Guest** - View-only access to Landing Page

### Login Flow:

- ✅ Login modal appears on page load (required)
- ✅ User cannot access any page without authentication
- ✅ After successful login, redirect to Landing Page
- ✅ Header shows role-based buttons based on user permissions
- ✅ Same authentication token used across all panels

### Default Credentials:

```
Admin:      admin / admin123
Auctioneer: auctioneer / auction123
Guest:      guest / guest123
```

## 📋 New Workflow

### Step 1: Create Tournament

1. Admin creates tournament with name (e.g., "Men's IPL 2024")
2. Set number of teams (1-12)
3. For each team, provide:
   - Team name
   - Team budget

### Step 2: Upload Players for Tournament

1. Select tournament first
2. Upload Excel with players
3. Option to:
   - **Append** to existing players
   - **Replace** with fresh list
4. Players are tournament-specific (not shared)
5. Each tournament has its own player pool

### Step 3: Manage Teams

1. Select tournament
2. Select team
3. Add/Remove players from team
4. View team statistics

### Step 4: Conduct Auction

1. Select tournament
2. Configure auction order:
   - Number of Batsmen first
   - Number of Bowlers second
   - Number of Wicket-keepers third
   - Number of All-rounders fourth
3. Players appear randomly within each category
4. Assign players to teams
5. Budget validation

## 🏏 Tournament & Player Management

### Tournament Structure:

```javascript
tournament = {
  id: 123,
  name: "Men's IPL 2024",
  createdAt: "2024-01-15",
  players: [
    // Tournament-specific players
    {
      empId: "EMP001",
      playerName: "Virat Kohli",
      type: "Batsman",
      ...
    }
  ],
  teams: [
    {
      id: 456,
      name: "Mumbai Indians",
      initialValue: 50000000,
      currentValue: 45000000,
      players: [...]  // Assigned players
    }
  ],
  auctionConfig: {
    order: ["Batsman", "Bowler", "Wicket-keeper", "All-rounder"],
    counts: [20, 15, 5, 10]  // How many from each category
  }
}
```

### Player Upload Rules:

- Each tournament has separate player list
- Men's tournament can have male players
- Women's tournament can have female players
- When uploading:
  1. Prompt: "Append to existing (X players) or Start Fresh?"
  2. If append: Add new players to existing list
  3. If fresh: Replace entire player list

## 🎯 Control Panel (Admin Only)

### Tabs:

1. **Tournaments Tab**

   - List all tournaments
   - Create new tournament
   - View tournament details

2. **Players Tab** (per tournament)

   - Select tournament first
   - Upload Excel (with append/replace option)
   - View all players in tournament
   - Player count

3. **Team Management Tab**
   - Select tournament
   - Select team
   - Add player (manual entry)
   - Remove player (with confirmation)
   - View: Emp ID, Name, Type, Bid Amount
   - Show team budget and player count

### Tournament Creation Flow:

```
Step 1: Enter Tournament Name
Step 2: Enter Number of Teams (1-12)
Step 3: For each team:
  - Team Name
  - Team Budget
Step 4: Save
```

## 🎪 Auction Panel (Admin + Auctioneer)

### Features:

1. **Tournament Selection**

   - Dropdown showing all tournaments
   - Can only auction one tournament at a time

2. **Auction Configuration** (Before Starting)

   - Set order of player types
   - Set count for each type
   - Example: "20 Batsmen, then 15 Bowlers, then 5 Wicket-keepers, then 10 All-rounders"

3. **Auction Process**

   - Show random player from current category
   - Display: Name, Emp ID, Type, Photo
   - Dropdown: Select team
   - Input: Bid amount
   - Button: Assign Player
   - Auto-move to next player after assignment

4. **Category Progress**

   - Show: "Batsmen: 5/20 completed"
   - Auto-switch to next category when current is complete

5. **Validations**
   - Check team budget
   - Prevent duplicate assignments
   - Prevent assigning already-assigned players

### Auction Configuration Example:

```
Category Order:
1. Batsman (20 players)
2. Bowler (15 players)
3. Wicket-keeper (5 players)
4. All-rounder (10 players)

Total: 50 players to be auctioned
```

## 🏠 Landing Page (All Users)

### Layout:

```
├── Page Header
│   ├── Total Tournaments
│   ├── Total Teams
│   └── Total Players
│
├── Tournament 1: Men's IPL 2024
│   ├── Tournament Stats (Teams, Players, Budget)
│   └── Team Cards Grid
│       ├── Team Card 1
│       │   ├── Team Logo
│       │   ├── Team Name
│       │   ├── Players Count
│       │   └── Available Budget
│       ├── Team Card 2
│       └── ...
│
├── Tournament 2: Women's T20 League
│   └── Team Cards Grid
│       └── ...
│
└── Overall Statistics
    ├── Total Tournaments
    ├── Total Teams
    ├── Total Players
    └── Total Budget
```

### Team Card (Click to View Details):

- Team Name
- Team Logo
- Number of Players
- Available Budget
- Budget Spent

### Team Detail Modal (Read-Only):

- Team name and tournament
- List of players with:
  - Player Name
  - Emp ID
  - Type
  - Bid Amount
- Team Statistics:
  - Total Players
  - Budget Remaining
  - Budget Spent
  - Average player cost
- **No Add/Remove buttons** (View only)

## 📊 Statistics Display

### Tournament Level:

- Number of teams
- Total players assigned
- Total budget allocated
- Total spent
- Average cost per player

### Team Level:

- Player count by type (X Batsmen, Y Bowlers, etc.)
- Budget remaining
- Budget spent
- Most expensive player
- Cheapest player

### Overall (All Tournaments):

- Total tournaments
- Total teams across all tournaments
- Total players assigned
- Combined budgets
- Combined spending

## 🔄 Data Flow

### Tournament Creation:

```
Admin → Control Panel → Tournaments Tab → Create Tournament
→ Enter Name → Set Team Count → Enter Team Details → Save
→ Tournament Created (with empty player list)
```

### Player Upload:

```
Admin → Control Panel → Players Tab → Select Tournament
→ Upload Excel → Choose (Append/Fresh) → Process File
→ Players Added to Tournament
```

### Team Assignment:

```
Admin → Control Panel → Team Management → Select Tournament
→ Select Team → Add Player → Enter Details → Save
→ Player Assigned (Budget Deducted)
```

### Auction Process:

```
Admin/Auctioneer → Auction Panel → Select Tournament
→ Configure Auction (if not done) → Start Auction
→ View Random Player → Select Team → Enter Bid → Assign
→ Auto-move to Next Player → Repeat
```

### View Teams:

```
Any User → Landing Page → See All Tournaments
→ See Team Cards → Click Team Card → View Team Details (Modal)
```

## 🎨 UI Components Needed

### New Components:

1. ✅ **LoginModal** - Enhanced with role display
2. ✅ **Header** - Role-based button visibility
3. ⏳ **AuctionConfig** - Configure auction order
4. ⏳ **AuctionPanel** - Updated with tournament selection
5. ⏳ **PlayerUploadModal** - Append/Replace option
6. ⏳ **LandingPage** - Grouped by tournament
7. ⏳ **TeamCard** - Enhanced with statistics
8. ⏳ **TeamDetailModal** - Read-only view

### Updated Components:

1. ✅ **AuthContext** - Three roles support
2. ✅ **App.jsx** - Login-first flow
3. ⏳ **ControlPanel** - Tournament-specific players
4. ⏳ **CreateTournament** - No changes needed

## 🔧 Technical Changes

### State Structure:

```javascript
// App State
{
  tournaments: [
    {
      id: 123,
      name: "Men's IPL 2024",
      players: [...],  // Tournament-specific
      teams: [...],
      auctionConfig: {...}
    }
  ]
}
```

### Key Functions:

```javascript
// Upload players to specific tournament
uploadPlayers(tournamentId, file, mode: 'append'|'replace')

// Get players for tournament
getPlayersForTournament(tournamentId)

// Auction: Get next random player by category
getNextPlayerByCategory(tournamentId, category, excludeIds)

// Assign player in auction
assignPlayerInAuction(tournamentId, playerId, teamId, bidAmount)
```

## ✅ Implementation Checklist

### Phase 1: Authentication (✅ DONE)

- [x] Update AuthContext with roles
- [x] Update LoginModal with role display
- [x] Update Header with role-based buttons
- [x] Update App.jsx with login-first flow

### Phase 2: Tournament Structure

- [ ] Update tournament model (add players array)
- [ ] Modify CreateTournament (already has name)
- [ ] Update ControlPanel to handle tournament-specific players

### Phase 3: Player Upload

- [ ] Create PlayerUploadModal with append/replace
- [ ] Update player upload logic per tournament
- [ ] Handle duplicate emp_id within tournament

### Phase 4: Auction System

- [ ] Create AuctionConfig component
- [ ] Update AuctionPanel with tournament selection
- [ ] Implement category-based random selection
- [ ] Add auction progress tracking

### Phase 5: Landing Page

- [ ] Update LandingPage to group by tournament
- [ ] Enhance TeamCard with statistics
- [ ] Update TeamDetailModal (read-only)

### Phase 6: Testing & Polish

- [ ] Test all three roles
- [ ] Test tournament creation
- [ ] Test player upload (append/replace)
- [ ] Test auction flow
- [ ] Test landing page views

## 🎯 Next Steps

1. **Immediate**: Create remaining components

   - AuctionConfig.jsx
   - PlayerUploadModal.jsx
   - Updated AuctionPanel.jsx

2. **Update**: Existing components

   - ControlPanel.jsx (tournament-specific players)
   - LandingPage.jsx (grouped display)
   - TeamDetailModal.jsx (read-only)

3. **Test**: Complete workflow
   - Create tournament
   - Upload players
   - Assign teams
   - Run auction
   - View results

Would you like me to continue implementing the remaining components?
