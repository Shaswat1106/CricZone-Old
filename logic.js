/* --- logic.js : Auto-Switching Table --- */

// ⚠️ PASTE YOUR GOOGLE SHEET LINK HERE:
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7PduoezqweZgS1aT_Whp1zfLOfEUwA7D76Kmbhw7c9C6DF-GOwMukmhVMprtlh356CXuxvaGI4ShH/pub?output=csv";

let database = [];
let currentView = 'runs'; // Default View

async function init() {
    const tbody = document.getElementById('stats-body');
    tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; padding:50px; color:#00ff88;'>⚡ LOADNG DATA...</td></tr>";

    try {
        const response = await fetch(SHEET_URL);
        const dataText = await response.text();
        database = parseCSV(dataText);
        applyFilters(); // Start
    } catch (error) {
        console.error(error);
        tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; color:red;'>Data Error. Check Sheet Link.</td></tr>";
    }
}

function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const parsedData = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        const cols = row.split(',');

        // NEW ORDER: Name, Team, Fmt, Mat, Inns, Runs, Avg, SR, 4s, 6s, 50s, 100s, Wkts, Econ
        parsedData.push({
            name: cols[0], team: cols[1], format: cols[2],
            mat: parseInt(cols[3])||0, inns: parseInt(cols[4])||0, runs: parseInt(cols[5])||0,
            avg: parseFloat(cols[6])||0, sr: parseFloat(cols[7])||0,
            fours: parseInt(cols[8])||0, sixes: parseInt(cols[9])||0,
            fifties: parseInt(cols[10])||0, hundreds: parseInt(cols[11])||0, 
            wickets: parseInt(cols[12])||0, econ: parseFloat(cols[13])||0
        });
    }
    return parsedData;
}

function applyFilters() {
    const selectedFormat = document.getElementById('filter-format').value;
    const selectedTeam = document.getElementById('filter-team').value;
    
    // Filter Data
    let finalData = database.filter(p => selectedTeam === 'ALL' || p.team === selectedTeam);

    if (selectedFormat === 'ALL') {
        finalData = calculateOverallStats(finalData);
    } else {
        finalData = finalData.filter(p => p.format === selectedFormat);
    }

    // Sort Data
    finalData.sort((a, b) => b[currentView] - a[currentView]);

    // Draw Headers & Table
    updateTableHeaders(); 
    renderTable(finalData);
}

// --- DYNAMIC HEADERS (Batting vs Bowling) ---
function updateTableHeaders() {
    const thead = document.getElementById('stats-head');
    let headers = `<tr><th style="text-align:left">Player</th><th>Fmt</th><th>Mat</th>`;

    // Agar Bowling view hai (Wickets ya Economy)
    if (currentView === 'wickets' || currentView === 'econ') {
        headers += `<th>Wickets</th><th>Econ</th><th>Best</th><th>5W</th></tr>`;
    } else {
        // Batting view
        headers += `<th>Inns</th><th>Runs</th><th>Avg</th><th>SR</th><th>4s</th><th>6s</th><th>50s</th><th>100s</th></tr>`;
    }
    thead.innerHTML = headers;
}

function renderTable(data) {
    const tbody = document.getElementById('stats-body');
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; padding:20px; color:#555;'>No Players Found</td></tr>";
        return;
    }

    data.forEach(p => {
        let row = `<tr>
            <td><span class="p-name">${p.name}</span><span class="p-team">${p.team}</span></td>
            <td><span class="badge ${p.format}">${p.format}</span></td>
            <td>${p.mat}</td>`;

        if (currentView === 'wickets' || currentView === 'econ') {
            // Bowling Rows
            row += `<td class="stat-highlight">${p.wickets}</td><td>${p.econ}</td><td>-</td><td>-</td>`;
        } else {
            // Batting Rows
            row += `<td>${p.inns}</td><td class="stat-highlight">${p.runs}</td><td>${p.avg}</td><td>${p.sr}</td>
                    <td>${p.fours}</td><td>${p.sixes}</td><td>${p.fifties}</td><td>${p.hundreds}</td>`;
        }
        
        row += `</tr>`;
        tbody.innerHTML += row;
    });
}

function calculateOverallStats(data) {
    const playerMap = {};
    data.forEach(p => {
        if (!playerMap[p.name]) {
            playerMap[p.name] = {
                name: p.name, team: p.team, format: "ALL",
                mat: 0, inns: 0, runs: 0, fours: 0, sixes: 0, fifties: 0, hundreds: 0, wickets: 0, totalBalls: 0
            };
        }
        playerMap[p.name].mat += p.mat;
        playerMap[p.name].inns += p.inns;
        playerMap[p.name].runs += p.runs;
        playerMap[p.name].fours += p.fours;
        playerMap[p.name].sixes += p.sixes;
        playerMap[p.name].fifties += p.fifties;
        playerMap[p.name].hundreds += p.hundreds;
        playerMap[p.name].wickets += p.wickets;
        
        if (p.sr > 0) playerMap[p.name].totalBalls += (p.runs * 100) / p.sr;
    });

    return Object.values(playerMap).map(p => {
        let newAvg = p.inns > 0 ? (p.runs / p.inns).toFixed(2) : 0;
        let newSR = p.totalBalls > 0 ? ((p.runs / p.totalBalls) * 100).toFixed(2) : 0;
        return { ...p, avg: newAvg, sr: newSR, econ: "-" }; 
    });
}

function loadView(viewType) {
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    
    currentView = viewType; // Set Global View
    
    const titles = { 
        'runs': 'Most Runs', 'wickets': 'Most Wickets', 'sixes': 'Most Sixes', 
        'avg': 'Best Average', 'sr': 'Best Strike Rate', 'hundreds': 'Most Centuries', 'econ': 'Best Economy'
    };
    document.getElementById('page-heading').innerText = titles[viewType] || 'Stats';
    applyFilters();
}

init();
