# Sample Excel Data for Cricket Auction

## Excel Column Headers (Required)

Your Excel file must have these column names in the first row:

| emp_id | player_name | player_type | image_url |
|--------|-------------|-------------|-----------|

**Required Columns:**
- `emp_id` - Unique employee identifier (must be unique)
- `player_name` - Full name of the player
- `player_type` - One of: Batsman, Bowler, All-rounder, Wicket-keeper

**Optional Column:**
- `image_url` - URL to player's image (can be left empty)

---

## Sample Data (50 Players)

Copy this data into Excel:

| emp_id | player_name | player_type | image_url |
|--------|-------------|-------------|-----------|
| EMP001 | Virat Kohli | Batsman | https://example.com/virat.jpg |
| EMP002 | Rohit Sharma | Batsman | https://example.com/rohit.jpg |
| EMP003 | Jasprit Bumrah | Bowler | https://example.com/bumrah.jpg |
| EMP004 | Hardik Pandya | All-rounder | https://example.com/hardik.jpg |
| EMP005 | Rishabh Pant | Wicket-keeper | https://example.com/pant.jpg |
| EMP006 | KL Rahul | Wicket-keeper | https://example.com/rahul.jpg |
| EMP007 | Ravindra Jadeja | All-rounder | https://example.com/jadeja.jpg |
| EMP008 | Mohammed Shami | Bowler | https://example.com/shami.jpg |
| EMP009 | Shikhar Dhawan | Batsman | https://example.com/dhawan.jpg |
| EMP010 | Yuzvendra Chahal | Bowler | https://example.com/chahal.jpg |
| EMP011 | Shreyas Iyer | Batsman | https://example.com/iyer.jpg |
| EMP012 | Kuldeep Yadav | Bowler | https://example.com/kuldeep.jpg |
| EMP013 | Shubman Gill | Batsman | https://example.com/gill.jpg |
| EMP014 | Axar Patel | All-rounder | https://example.com/axar.jpg |
| EMP015 | Ishan Kishan | Wicket-keeper | https://example.com/kishan.jpg |
| EMP016 | Suryakumar Yadav | Batsman | https://example.com/surya.jpg |
| EMP017 | Mohammed Siraj | Bowler | https://example.com/siraj.jpg |
| EMP018 | Washington Sundar | All-rounder | https://example.com/sundar.jpg |
| EMP019 | Deepak Chahar | Bowler | https://example.com/chahar.jpg |
| EMP020 | Prithvi Shaw | Batsman | https://example.com/shaw.jpg |
| EMP021 | Shardul Thakur | All-rounder | https://example.com/thakur.jpg |
| EMP022 | Bhuvneshwar Kumar | Bowler | https://example.com/bhuvi.jpg |
| EMP023 | Sanju Samson | Wicket-keeper | https://example.com/samson.jpg |
| EMP024 | Ruturaj Gaikwad | Batsman | https://example.com/ruturaj.jpg |
| EMP025 | Prasidh Krishna | Bowler | https://example.com/prasidh.jpg |
| EMP026 | Devdutt Padikkal | Batsman | https://example.com/padikkal.jpg |
| EMP027 | Krunal Pandya | All-rounder | https://example.com/krunal.jpg |
| EMP028 | Arshdeep Singh | Bowler | https://example.com/arshdeep.jpg |
| EMP029 | Tilak Varma | Batsman | https://example.com/tilak.jpg |
| EMP030 | Ravi Bishnoi | Bowler | https://example.com/bishnoi.jpg |
| EMP031 | Mayank Agarwal | Batsman | https://example.com/mayank.jpg |
| EMP032 | Deepak Hooda | All-rounder | https://example.com/hooda.jpg |
| EMP033 | Harshal Patel | Bowler | https://example.com/harshal.jpg |
| EMP034 | Dinesh Karthik | Wicket-keeper | https://example.com/dk.jpg |
| EMP035 | Venkatesh Iyer | All-rounder | https://example.com/venkatesh.jpg |
| EMP036 | Avesh Khan | Bowler | https://example.com/avesh.jpg |
| EMP037 | Nitish Rana | Batsman | https://example.com/rana.jpg |
| EMP038 | Umran Malik | Bowler | https://example.com/umran.jpg |
| EMP039 | Rahul Tripathi | Batsman | https://example.com/tripathi.jpg |
| EMP040 | Mukesh Kumar | Bowler | https://example.com/mukesh.jpg |
| EMP041 | Yashasvi Jaiswal | Batsman | https://example.com/yashasvi.jpg |
| EMP042 | Rahul Chahar | Bowler | https://example.com/rchahar.jpg |
| EMP043 | Abhishek Sharma | All-rounder | https://example.com/abhishek.jpg |
| EMP044 | Khaleel Ahmed | Bowler | https://example.com/khaleel.jpg |
| EMP045 | Rajat Patidar | Batsman | https://example.com/patidar.jpg |
| EMP046 | Kuldeep Sen | Bowler | https://example.com/ksen.jpg |
| EMP047 | Rinku Singh | Batsman | https://example.com/rinku.jpg |
| EMP048 | Mukesh Choudhary | Bowler | https://example.com/mchoudhary.jpg |
| EMP049 | Dhruv Jurel | Wicket-keeper | https://example.com/jurel.jpg |
| EMP050 | Umesh Yadav | Bowler | https://example.com/umesh.jpg |

---

## Player Type Distribution

- **Batsman**: 15 players
- **Bowler**: 16 players
- **All-rounder**: 8 players
- **Wicket-keeper**: 6 players
- **Total**: 50 players

---

## How to Create Excel File

### Method 1: Microsoft Excel
1. Open Microsoft Excel
2. Copy the table above
3. Paste into Excel (starting from cell A1)
4. Save as `.xlsx` file

### Method 2: Google Sheets
1. Open Google Sheets
2. Copy the table above
3. Paste into Google Sheets
4. File → Download → Microsoft Excel (.xlsx)

### Method 3: CSV then Convert
1. Create a text file with comma-separated values:
```csv
emp_id,player_name,player_type,image_url
EMP001,Virat Kohli,Batsman,https://example.com/virat.jpg
EMP002,Rohit Sharma,Batsman,https://example.com/rohit.jpg
```
2. Save as `.csv`
3. Open in Excel and save as `.xlsx`

---

## Alternative: Minimal Sample (10 Players)

For quick testing, use this smaller dataset:

| emp_id | player_name | player_type | image_url |
|--------|-------------|-------------|-----------|
| EMP001 | Virat Kohli | Batsman | |
| EMP002 | Rohit Sharma | Batsman | |
| EMP003 | Jasprit Bumrah | Bowler | |
| EMP004 | Hardik Pandya | All-rounder | |
| EMP005 | Rishabh Pant | Wicket-keeper | |
| EMP006 | Ravindra Jadeja | All-rounder | |
| EMP007 | Mohammed Shami | Bowler | |
| EMP008 | KL Rahul | Wicket-keeper | |
| EMP009 | Shikhar Dhawan | Batsman | |
| EMP010 | Yuzvendra Chahal | Bowler | |

---

## Important Notes

### ✅ DO:
- Use exact column names: `emp_id`, `player_name`, `player_type`
- Make sure `emp_id` is unique for each player
- Use valid player types: Batsman, Bowler, All-rounder, Wicket-keeper
- Keep first row as headers

### ❌ DON'T:
- Don't use duplicate `emp_id` values
- Don't change column names
- Don't leave required fields empty
- Don't use special characters in `emp_id`

---

## Column Name Alternatives (Also Supported)

The application supports these alternative column names:

| Standard | Alternative 1 | Alternative 2 | Alternative 3 |
|----------|--------------|---------------|---------------|
| emp_id | empId | Emp ID | emp id |
| player_name | playerName | Player Name | player name |
| player_type | type | Type | Player Type |
| image_url | imageUrl | Image URL | - |

---

## Testing the Upload

1. Create your Excel file with the sample data
2. Go to Control Panel (login with admin/admin123)
3. Click "Players" tab
4. Click "Upload Excel File" and select your file
5. The system will:
   - Validate the columns
   - Check for duplicates
   - Display the player count
   - Show any errors

---

## Sample Tournament Setup

After uploading players, try this tournament configuration:

**Tournament:** IPL Style Mini League

**Teams (4 teams with ₹50,000,000 budget each):**
1. Mumbai Masters - ₹50,000,000
2. Chennai Champions - ₹50,000,000
3. Bangalore Blazers - ₹50,000,000
4. Delhi Dragons - ₹50,000,000

This will allow approximately 12-13 players per team from the 50-player pool.

---

## Download Ready-Made File

I've prepared the data above. To create your Excel file:

1. Copy the large table (50 players)
2. Paste into Excel/Google Sheets
3. Save as `cricket_players.xlsx`
4. Upload to the application

**File Name Suggestion:** `cricket_players.xlsx` or `player_list.xlsx`
