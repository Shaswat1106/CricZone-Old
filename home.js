/* --- home.js : FAIL-SAFE LIVE SCORES --- */

// ✅ YOUR API KEY
const API_KEY = "f42f69a8-02ca-4650-a69b-484c22879c80"; 

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    
    // Loading State
    strip.innerHTML = '<div style="color:#00ff88; padding:20px; font-weight:bold;">📡 Connecting to Satellite...</div>';

    try {
        // 1. Koshish karo API se data lene ki
        const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
        const json = await response.json();

        // 2. Agar API fail ho gayi ya limit khatam ho gayi
        if (json.status !== "success" || !json.data) {
            throw new Error("API Limit Reached"); // Error feko taaki Backup chal sake
        }

        // 3. Agar Data aa gaya
        renderMatches(json.data.slice(0, 10)); // Top 10 matches dikhao

    } catch (error) {
        console.warn("API Error, Switching to Demo Mode:", error);
        // 4. BACKUP PLAN: Demo Matches dikhao (Site khali nahi dikhegi)
        renderMatches(getDemoMatches());
    }
}

// --- RENDER FUNCTION (Card Banane Wala) ---
function renderMatches(matches) {
    const strip = document.querySelector('.match-strip');
    strip.innerHTML = ""; // Clear Loading

    matches.forEach(match => {
        // Logic Setup
        let isLive = match.matchStarted && !match.matchEnded;
        let statusColor = isLive ? '#00ff88' : '#aaa'; 
        let borderClass = isLive ? 'live' : '';
        
        // Team Names & Flags
        let t1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].shortname : (match.t1 || "Team A");
        let t2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].shortname : (match.t2 || "Team B");
        
        let img1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].img : "https://via.placeholder.com/20";
        let img2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].img : "https://via.placeholder.com/20";

        // Score Handling
        let s1 = "-";
        let s2 = "-";

        if (match.score) {
            match.score.forEach(inning => {
                if (inning.inning.includes(match.teamInfo[0].name)) s1 = `${inning.r}/${inning.w} (${inning.o})`;
                if (inning.inning.includes(match.teamInfo[1].name)) s2 = `${inning.r}/${inning.w} (${inning.o})`;
            });
        } else {
            // Backup for Demo Data
            s1 = match.s1 || "-";
            s2 = match.s2 || "-";
        }

        let card = `
        <div class="mini-card ${borderClass}">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase; max-width:150px; overflow:hidden; white-space:nowrap;">
                    ${match.name || match.series}
                </span>
                <span style="font-size:10px; color:${isLive ? '#ff4444' : '#ccc'}; font-weight:bold;">
                    ${isLive ? '<span class="blink-dot"></span> LIVE' : match.status}
                </span>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${img1}" style="width:20px; height:20px; border-radius:50%;">
                    <span>${t1}</span>
                </div>
                <span style="color:#fff;">${s1}</span>
            </div>

            <div style="display:flex; justify-content:space-between; margin-top:8px; font-weight:bold; font-size:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${img2}" style="width:20px; height:20px; border-radius:50%;">
                    <span>${t2}</span>
                </div>
                <span style="color:#fff;">${s2}</span>
            </div>

            <span style="font-size:11px; color:${statusColor}; display:block; margin-top:12px; font-weight:500;">
                ${match.status}
            </span>
        </div>`;
        
        strip.innerHTML += card;
    });
}

// --- BACKUP DATA (Jab API fail ho jaye) ---
function getDemoMatches() {
    return [
        {
            name: "IND vs AUS • 1st Test",
            series: "Border Gavaskar Trophy",
            t1: "IND", s1: "320/4",
            t2: "AUS", s2: "177",
            status: "India lead by 143 runs",
            matchStarted: true, matchEnded: false
        },
        {
            name: "IPL 2025 • Match 1",
            series: "IPL 2025",
            t1: "CSK", s1: "-",
            t2: "MI", s2: "-",
            status: "Starts Tomorrow, 7:30 PM",
            matchStarted: false, matchEnded: false
        },
        {
            name: "SA vs ENG • 2nd ODI",
            series: "England tour of SA",
            t1: "SA", s1: "287/8",
            t2: "ENG", s2: "240",
            status: "South Africa won by 47 runs",
            matchStarted: true, matchEnded: true
        }
    ];
}

// --- NEWS SECTION ---
function loadNews() {
    const container = document.getElementById('news-container');
    if(!container) return;
    
    container.innerHTML = `
    <div class="hero-card">
        <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370500/370560.jpg" class="hero-img">
        <div class="hero-content">
            <span class="news-tag">BORDER-GAVASKAR TROPHY</span>
            <h1 class="headline">King Kohli Silences Critics with Majestic 80th Century</h1>
            <p class="summary">Virat Kohli produced a masterclass on a spicy Perth wicket, guiding India to a commanding position on Day 2 against Australia.</p>
        </div>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px;">
        <div class="hero-card" style="padding:20px;">
            <span class="news-tag">IPL 2025</span>
            <h3 style="margin:10px 0; color:#fff; font-size:20px; font-family:'Teko'">Rishabh Pant sold for record ₹27 Crores</h3>
        </div>
        <div class="hero-card" style="padding:20px;">
            <span class="news-tag">ANALYSIS</span>
            <h3 style="margin:10px 0; color:#fff; font-size:20px; font-family:'Teko'">Why Bumrah is the tactical genius India needs</h3>
        </div>
    </div>`;
}

// START ENGINE
window.onload = function() {
    loadLiveScores();
    loadNews();
};
