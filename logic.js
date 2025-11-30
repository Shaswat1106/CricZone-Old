/* --- logic.js : FINAL CONNECTED VERSION --- */

// ✅ TUMHARA LINK YAHAN LAGA DIYA HAI:
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7PduoezqweZgS1aT_Whp1zfLOfEUwA7D76Kmbhw7c9C6DF-GOwMukmhVMprtlh356CXuxvaGI4ShH/pub?output=csv";

let database = [];

// --- 1. ENGINE START ---
async function init() {
    const tbody = document.getElementById('stats-body');
    // Loading animation
    tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding:20px; color:#3b94fd; font-weight:bold;'>Fetching Live Data from Cloud...</td></tr>";

    try {
        const response = await fetch(SHEET_URL);
        const dataText = await response.text();
        
        database = parseCSV(dataText);
        
        // Data aate hi filter chalao
        applyFilters();
        
    } catch (error) {
        console.error("Error:", error);
        tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; color:red;'>Data Load Error. Check Internet connection.</td></tr>";
    }
}

// --- 2. CSV PARSER ---
function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const parsedData = [];

    // Row 1 (Header) skip karke Row 2 se data uthao
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;

        // Note: Agar data me comma hai to dikkat hogi, par simple numbers ke liye ye sahi hai
        const cols = row.split(',');

        // Column Mapping (Jo tumne sheet me dala hai)
        parsedData.push({
            name: cols[0],
            team: cols[1],
            format: cols[2],
            mat: parseInt(cols[3]) || 0,
            inns: parseInt(cols[4]) || 0,
            runs: parseInt(cols[5]) || 0,
            avg: parseFloat(cols[6]) || 0,
            sr: parseFloat(cols[7]) || 0,
            fours: parseInt(cols[8]) || 0,
            sixes: parseInt(cols[9]) || 0,
            hundreds: parseInt(cols[10]) || 0,
            wickets: parseInt(cols[11]) || 0,
            econ: parseFloat(cols[12]) || 0
        });
    }
    return parsedData;
}

// --- 3. FILTER & SORT LOGIC ---
function applyFilters() {
    const selectedFormat = document.getElementById('filter-format').value;
    const selectedTeam = document.getElementById('filter-team').value;
    const selectedSort = document.getElementById('filter-sort').value;

    let finalData = [];

    // A. Team Filter
    let teamFilteredData = database.filter(player => {
        return selectedTeam === 'ALL' || player.team === selectedTeam;
    });

    // B. Format Filter (With Overall Logic)
    if (selectedFormat === 'ALL') {
        finalData = calculateOverallStats(teamFilteredData);
    } else {
        finalData = teamFilteredData.filter(player => player.format === selectedFormat);
    }

    // C. Sorting (High to Low)
    finalData.sort((a, b) => b[selectedSort] - a[selectedSort]);

    renderTable(finalData);
}

// --- 4. OVERALL CALCULATOR ---
function calculateOverallStats(data) {
    const playerMap = {};

    data.forEach(p => {
        if (!playerMap[p.name]) {
            playerMap[p.name] = {
                name: p.name, team: p.team, format: "ALL",
                mat: 0, inns: 0, runs: 0, fours: 0, sixes: 0, hundreds: 0, wickets: 0,
                totalBalls: 0 // SR Calculation ke liye
            };
        }

        playerMap[p.name].mat += p.mat;
        playerMap[p.name].inns += p.inns;
        playerMap[p.name].runs += p.runs;
        playerMap[p.name].fours += p.fours;
        playerMap[p.name].sixes += p.sixes;
        playerMap[p.name].hundreds += p.hundreds;
        playerMap[p.name].wickets += p.wickets;

        // SR Math: Balls = (Runs * 100) / SR
        if (p.sr > 0) {
            playerMap[p.name].totalBalls += (p.runs * 100) / p.sr;
        }
    });

    return Object.values(playerMap).map(p => {
        let newAvg = p.inns > 0 ? (p.runs / p.inns).toFixed(2) : 0;
        let newSR = p.totalBalls > 0 ? ((p.runs / p.totalBalls) * 100).toFixed(2) : 0;
        return { ...p, avg: newAvg, sr: newSR, econ: "-" }; 
    });
}

// --- 5. RENDER TABLE ---
function renderTable(data) {
    const tbody = document.getElementById('stats-body');
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding:20px; color:#666;'>No players found in database</td></tr>";
        return;
    }

    data.forEach(p => {
        // Badges Styling
        let badgeColor = '#555';
        if(p.format === 'ODI') badgeColor = '#3b94fd';
        if(p.format === 'T20') badgeColor = '#ff9100';
        if(p.format === 'TEST') badgeColor = '#fff';
        if(p.format === 'ALL') badgeColor = '#ffd700';

        let textColor = (p.format === 'TEST' || p.format === 'ALL') ? '#000' : '#fff';

        tbody.innerHTML += `
        <tr>
            <td>
                <span style="font-weight:500; color:white;">${p.name}</span>
                <span style="font-size:10px; color:#888;">(${p.team})</span>
            </td>
            <td><span style="background:${badgeColor}; color:${textColor}; padding:2px 6px; border-radius:3px; font-size:10px; font-weight:bold;">${p.format}</span></td>
            <td>${p.mat}</td>
            <td>${p.inns}</td>
            <td style="font-weight:bold; color:#fff;">${p.runs}</td>
            <td>${p.avg}</td>
            <td>${p.sr}</td>
            <td>${p.fours}</td>
            <td>${p.sixes}</td>
        </tr>`;
    });
}

// --- 6. SIDEBAR CLICK ---
function loadView(viewType) {
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('filter-sort').value = viewType;
    
    const titles = { 'runs': 'Most Runs', 'wickets': 'Most Wickets', 'sixes': 'Most Sixes', 'avg': 'Best Average', 'sr': 'Best Strike Rate' };
    document.getElementById('page-heading').innerText = titles[viewType] || 'Stats';
    
    applyFilters();
}

// Start
init();