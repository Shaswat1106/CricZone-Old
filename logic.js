/* --- logic.js : Premium Version --- */

// ⚠️ PASTE YOUR GOOGLE SHEET LINK HERE:
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7PduoezqweZgS1aT_Whp1zfLOfEUwA7D76Kmbhw7c9C6DF-GOwMukmhVMprtlh356CXuxvaGI4ShH/pub?output=csv";

let database = [];

async function init() {
    const tbody = document.getElementById('stats-body');
    tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding:40px; color:#e1b12c;'>⚡ Accessing Mainframe Database...</td></tr>";

    try {
        const response = await fetch(SHEET_URL);
        const dataText = await response.text();
        database = parseCSV(dataText);
        applyFilters();
    } catch (error) {
        console.error(error);
        tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; color:red;'>Connection Failed.</td></tr>";
    }
}

function parseCSV(csvText) {
    const rows = csvText.split('\n');
    const parsedData = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        const cols = row.split(',');

        parsedData.push({
            name: cols[0], team: cols[1], format: cols[2],
            mat: parseInt(cols[3])||0, inns: parseInt(cols[4])||0, runs: parseInt(cols[5])||0,
            avg: parseFloat(cols[6])||0, sr: parseFloat(cols[7])||0,
            fours: parseInt(cols[8])||0, sixes: parseInt(cols[9])||0,
            hundreds: parseInt(cols[10])||0, wickets: parseInt(cols[11])||0, econ: parseFloat(cols[12])||0
        });
    }
    return parsedData;
}

function applyFilters() {
    const selectedFormat = document.getElementById('filter-format').value;
    const selectedTeam = document.getElementById('filter-team').value;
    const selectedSort = document.getElementById('filter-sort').value;

    let finalData = database.filter(p => selectedTeam === 'ALL' || p.team === selectedTeam);

    if (selectedFormat === 'ALL') {
        finalData = calculateOverallStats(finalData);
    } else {
        finalData = finalData.filter(p => p.format === selectedFormat);
    }

    finalData.sort((a, b) => b[selectedSort] - a[selectedSort]);
    renderTable(finalData);
}

function calculateOverallStats(data) {
    const playerMap = {};
    data.forEach(p => {
        if (!playerMap[p.name]) {
            playerMap[p.name] = {
                name: p.name, team: p.team, format: "ALL",
                mat: 0, inns: 0, runs: 0, fours: 0, sixes: 0, hundreds: 0, wickets: 0, totalBalls: 0
            };
        }
        playerMap[p.name].mat += p.mat;
        playerMap[p.name].inns += p.inns;
        playerMap[p.name].runs += p.runs;
        playerMap[p.name].fours += p.fours;
        playerMap[p.name].sixes += p.sixes;
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

function renderTable(data) {
    const tbody = document.getElementById('stats-body');
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding:20px; color:#555;'>No Data Found.</td></tr>";
        return;
    }

    data.forEach(p => {
        tbody.innerHTML += `
        <tr>
            <td>
                <span class="p-name">${p.name}</span>
                <span class="p-team">${p.team}</span>
            </td>
            <td><span class="badge ${p.format}">${p.format}</span></td>
            <td>${p.mat}</td>
            <td>${p.inns}</td>
            <td class="stat-main">${p.runs}</td>
            <td>${p.avg}</td>
            <td>${p.sr}</td>
            <td>${p.fours}</td>
            <td>${p.sixes}</td>
        </tr>`;
    });
}

function loadView(viewType) {
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('filter-sort').value = viewType;
    
    const titles = { 'runs': 'Most Career Runs', 'wickets': 'Most Wickets', 'sixes': 'Most Sixes', 'avg': 'Highest Average' };
    document.getElementById('page-heading').innerText = titles[viewType] || 'Stats Database';
    applyFilters();
}

init();
