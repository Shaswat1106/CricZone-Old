/* logic.js - Stats database loader (uses CSV sheet) */

/*
 Notes:
 - Replace SHEET_URL with your published Google Sheet CSV link if you want dynamic updates.
 - If you prefer a different data source (JSON API), update fetch logic accordingly.
*/

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7PduoezqweZgS1aT_Whp1zfLOfEUwA7D76Kmbhw7c9C6DF-GOwMukmhVMprtlh356CXuxvaGI4ShH/pub?output=csv";
// <-- Replace above URL with your published CSV sheet if needed.

let database = [];
let currentView = 'runs';

async function init() {
    const tbody = document.getElementById('stats-body');
    if (!tbody) return;

    tbody.innerHTML = "<tr><td colspan='10' class='center' style='padding:40px; color:var(--accent); font-weight:700;'>♻️ Connecting to Server...</td></tr>";

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Sheet fetch failed');
        const text = await response.text();
        database = parseCSV(text);

        if (!database || database.length === 0) {
            tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; color:#ff6b6b; padding:20px;'>Error: Sheet is empty or URL incorrect.</td></tr>";
            return;
        }

        // populate filters for teams (if any)
        populateTeamFilter(database);
        applyFilters();
    } catch (err) {
        console.error('Init error:', err);
        tbody.innerHTML = "<tr><td colspan='10' style='text-align:center; color:#ff6b6b; padding:20px;'>Internet Error. Failed to load data.</td></tr>";
    }
}

function parseCSV(csvText) {
    const rows = csvText.trim().split(/\r?\n/);
    if (rows.length <= 1) return [];

    // parse header to know column indexes (flexible)
    const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
    const parsed = [];

    for (let i = 1; i < rows.length; i++) {
        const line = rows[i].trim();
        if (!line) continue;
        // split respecting simple CSV (no quoted commas handling here)
        const cols = rows[i].split(',').map(c => c.trim());
        // build object by header name if exists, otherwise fallback by position
        const obj = {
            name: cols[0] || `Player ${i}`,
            team: cols[1] || 'N/A',
            format: cols[2] || 'ALL',
            mat: parseInt(cols[3]) || 0,
            inns: parseInt(cols[4]) || 0,
            runs: parseInt(cols[5]) || 0,
            avg: parseFloat(cols[6]) || 0,
            sr: parseFloat(cols[7]) || 0,
            fours: parseInt(cols[8]) || 0,
            sixes: parseInt(cols[9]) || 0,
            fifties: parseInt(cols[10]) || 0,
            hundreds: parseInt(cols[11]) || 0,
            wickets: parseInt(cols[12]) || 0,
            econ: parseFloat(cols[13]) || 0
        };
        parsed.push(obj);
    }
    return parsed;
}

function populateTeamFilter(data) {
    const teamSet = new Set();
    data.forEach(p => { if (p.team) teamSet.add(p.team); });
    const select = document.getElementById('filter-team');
    if (!select) return;
    // keep the first "ALL" option intact, then append detected teams
    const existing = Array.from(select.options).map(o => o.value);
    teamSet.forEach(team => {
        if (!existing.includes(team)) {
            const opt = document.createElement('option');
            opt.value = team;
            opt.textContent = team;
            select.appendChild(opt);
        }
    });
}

function applyFilters() {
    const selectedFormat = (document.getElementById('filter-format') || { value: 'ALL' }).value;
    const selectedTeam = (document.getElementById('filter-team') || { value: 'ALL' }).value;

    let finalData = database.slice();

    if (selectedTeam !== 'ALL') finalData = finalData.filter(p => p.team === selectedTeam);
    if (selectedFormat !== 'ALL') finalData = finalData.filter(p => p.format === selectedFormat);

    if (selectedFormat === 'ALL') finalData = calculateOverallStats(finalData);

    // sort by currentView (descending); fallback to runs
    finalData.sort((a, b) => {
        const key = currentView || 'runs';
        const av = parseFloat(a[key]) || 0;
        const bv = parseFloat(b[key]) || 0;
        return bv - av;
    });

    updateTableHeaders();
    renderTable(finalData);
}

function updateTableHeaders() {
    const thead = document.getElementById('stats-head');
    if (!thead) return;

    let headers = `<tr>
        <th style="text-align:left">Player</th>
        <th>Fmt</th>
        <th>Mat</th>
        <th>Inns</th>`;

    if (currentView === 'wickets' || currentView === 'econ') {
        headers += `<th class="stat-highlight">Wkts</th><th>Econ</th><th>Best</th><th>5W</th></tr>`;
    } else {
        headers += `<th class="stat-highlight">Runs</th><th>Avg</th><th>SR</th><th>4s</th><th>6s</th><th>50s</th><th>100s</th></tr>`;
    }

    thead.innerHTML = headers;
}

function renderTable(data) {
    const tbody = document.getElementById('stats-body');
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='10' class='center p-muted' style='padding:20px;'>No Players Found</td></tr>";
        return;
    }

    data.forEach(p => {
        let row = `<tr>
            <td><div style="font-weight:700;">${p.name}</div><div class="p-muted">${p.team}</div></td>
            <td><span class="badge">${p.format}</span></td>
            <td>${p.mat}</td>
            <td>${p.inns}</td>`;

        if (currentView === 'wickets' || currentView === 'econ') {
            row += `<td class="stat-highlight">${p.wickets}</td><td>${p.econ}</td><td>-</td><td>-</td>`;
        } else {
            row += `<td class="stat-highlight">${p.runs}</td><td>${p.avg}</td><td>${p.sr}</td><td>${p.fours}</td><td>${p.sixes}</td><td>${p.fifties}</td><td>${p.hundreds}</td>`;
        }

        row += `</tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function calculateOverallStats(data) {
    const map = {};
    data.forEach(p => {
        if (!map[p.name]) {
            map[p.name] = {
                name: p.name, team: p.team, format: "ALL",
                mat: 0, inns: 0, runs: 0, fours: 0, sixes: 0, fifties: 0, hundreds: 0, wickets: 0, totalBalls: 0
            };
        }
        const m = map[p.name];
        m.mat += (p.mat || 0);
        m.inns += (p.inns || 0);
        m.runs += (p.runs || 0);
        m.fours += (p.fours || 0);
        m.sixes += (p.sixes || 0);
        m.fifties += (p.fifties || 0);
        m.hundreds += (p.hundreds || 0);
        m.wickets += (p.wickets || 0);

        if (p.sr && p.sr > 0) {
            m.totalBalls += (p.runs * 100) / p.sr;
        }
    });

    return Object.values(map).map(p => {
        const avg = p.inns > 0 ? (p.runs / p.inns) : 0;
        const sr = p.totalBalls > 0 ? ((p.runs / p.totalBalls) * 100) : 0;
        return { ...p, avg: +avg.toFixed(2), sr: +sr.toFixed(2), econ: "-" };
    });
}

function loadView(viewType) {
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active-tab'));
    // try safe event target handling
    try { if (event && event.target) event.target.classList.add('active-tab'); } catch(e) {}

    currentView = viewType;
    const titles = {
        'runs': 'Most Career Runs', 'wickets': 'Most Wickets', 'sixes': 'Most Sixes',
        'avg': 'Highest Average', 'sr': 'Best Strike Rate', 'hundreds': 'Most Centuries',
        'fifties': 'Most Fifties', 'econ': 'Best Economy'
    };
    const titleEl = document.getElementById('page-heading');
    if (titleEl) titleEl.innerText = titles[viewType] || 'Stats';
    applyFilters();
}

// start on load
window.addEventListener('load', init);
