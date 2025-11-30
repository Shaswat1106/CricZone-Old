/* --- home.js : API LIVE SCORES --- */

// ✅ YOUR API KEY
const API_KEY = "f42f69a8-02ca-4650-a69b-484c22879c80"; 

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    if(!strip) return;

    // Loading State
    strip.innerHTML = '<div style="color:#00ff88; padding:20px; font-weight:bold;">📡 Connecting to Stadium...</div>';

    try {
        const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
        const json = await response.json();

        if (json.status !== "success" || !json.data) {
            strip.innerHTML = '<div style="color:#ff4444; padding:20px;">API Quota Exceeded. Scores will update tomorrow.</div>';
            return;
        }

        strip.innerHTML = ""; // Clear Loading
        const matches = json.data.slice(0, 10);

        matches.forEach(match => {
            let isLive = match.matchStarted && !match.matchEnded;
            let statusColor = isLive ? '#00ff88' : '#aaa'; 
            let borderClass = isLive ? 'live' : '';

            let t1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].shortname : "T1";
            let t2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].shortname : "T2";
            
            let s1 = "-";
            let s2 = "-";

            if (match.score) {
                match.score.forEach(inning => {
                    if (inning.inning.includes(match.teamInfo[0].name)) s1 = `${inning.r}/${inning.w} (${inning.o})`;
                    if (inning.inning.includes(match.teamInfo[1].name)) s2 = `${inning.r}/${inning.w} (${inning.o})`;
                });
            }

            let card = `
            <div class="mini-card ${borderClass}">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase; max-width:150px; overflow:hidden; white-space:nowrap;">
                        ${match.matchType.toUpperCase()}
                    </span>
                    <span style="font-size:10px; color:${isLive ? '#ff4444' : '#ccc'}; font-weight:bold;">
                        ${isLive ? '● LIVE' : match.status}
                    </span>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <span style="color:#fff;">${t1}</span> <span style="color:#fff;">${s1}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <span style="color:#fff;">${t2}</span> <span style="color:#fff;">${s2}</span>
                </div>

                <span style="font-size:11px; color:${statusColor}; display:block; margin-top:10px;">${match.status}</span>
            </div>`;
            
            strip.innerHTML += card;
        });

    } catch (error) {
        console.error(error);
        strip.innerHTML = '<div style="color:red; padding:20px;">Connection Error.</div>';
    }
}

// News Loader
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

window.onload = function() {
    loadLiveScores();
    loadNews();
};
