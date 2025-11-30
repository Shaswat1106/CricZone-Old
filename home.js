/* --- home.js : REAL LIVE SCORES (Powered by CricAPI) --- */

// ✅ TUMHARI API KEY:
const API_KEY = "f42f69a8-02ca-4650-a69b-484c22879c80"; 

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    // Loading Animation
    strip.innerHTML = '<div style="color:#aaa; padding:20px; font-size:14px;">📡 Connecting to Stadium...</div>';

    try {
        // 1. API se Data maango
        const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
        const json = await response.json();

        // 2. Agar Data nahi aaya
        if (json.status !== "success" || !json.data) {
            strip.innerHTML = '<div style="color:red; padding:20px;">API Limit Reached or Error.</div>';
            return;
        }

        // 3. Data aa gaya - Ab Card banao
        strip.innerHTML = ""; // Purana Loading text hatao
        const matches = json.data.slice(0, 6); // Sirf top 6 matches dikhao

        matches.forEach(match => {
            // Logic: Match Live hai ya nahi?
            let isLive = match.matchStarted && !match.matchEnded;
            let liveClass = isLive ? 'live' : '';
            let statusColor = isLive ? '#00ff88' : '#aaa';
            let liveBadge = isLive ? '<span class="blink-dot"></span> LIVE' : match.status;

            // Score Logic (Kabhi kabhi score null hota hai agar match shuru nahi hua)
            let team1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].shortname : "T1";
            let team2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].shortname : "T2";
            
            let score1 = "-";
            let score2 = "-";

            if(match.score) {
                // Score Array check karo
                match.score.forEach(s => {
                    if(s.inning.includes(match.teamInfo[0].name)) score1 = `${s.r}/${s.w} (${s.o})`;
                    if(s.inning.includes(match.teamInfo[1].name)) score2 = `${s.r}/${s.w} (${s.o})`;
                });
            }

            // HTML Structure (Style.css se match karega)
            let card = `
            <div class="mini-card ${liveClass}">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase;">${match.matchType.toUpperCase()} • ${match.venue}</span>
                    <span style="font-size:10px; color:${isLive ? '#ff4444' : '#aaa'}; font-weight:bold;">${isLive ? '● LIVE' : match.status}</span>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${match.teamInfo[0].img || 'https://via.placeholder.com/20'}" style="width:20px; border-radius:50%;">
                        <span>${team1}</span>
                    </div>
                    <span style="color:#fff;">${score1}</span>
                </div>

                <div style="display:flex; justify-content:space-between; margin-top:8px; font-weight:bold; font-size:14px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${match.teamInfo[1].img || 'https://via.placeholder.com/20'}" style="width:20px; border-radius:50%;">
                        <span>${team2}</span>
                    </div>
                    <span style="color:#fff;">${score2}</span>
                </div>

                <span style="font-size:11px; color:${statusColor}; display:block; margin-top:12px; font-weight:500;">
                    ${match.status}
                </span>
            </div>`;
            
            strip.innerHTML += card;
        });

    } catch (error) {
        console.error(error);
        strip.innerHTML = '<div style="color:red; padding:20px;">Network Error.</div>';
    }
}

// --- NEWS DATA (Static for Design - Ise Google Sheet se bhi jod sakte hain) ---
const newsData = [
    {
        tag: "BORDER-GAVASKAR TROPHY",
        headline: "King Kohli Silences Critics with Majestic 80th Century",
        img: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370500/370560.jpg",
        summary: "Virat Kohli produced a masterclass on a spicy Perth wicket, guiding India to a commanding position."
    },
    {
        tag: "IPL AUCTION",
        headline: "Rishabh Pant sold for record ₹27 Crores to PBKS",
        img: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370400/370489.jpg",
        summary: "Punjab Kings broke the bank for the wicketkeeper batter, making him the most expensive player in history."
    }
];

function loadNews() {
    const container = document.getElementById('news-container');
    if(!container) return;
    container.innerHTML = "";

    const hero = newsData[0];
    let html = `
    <div class="hero-card">
        <img src="${hero.img}" class="hero-img">
        <div class="hero-content">
            <span class="news-tag">${hero.tag}</span>
            <h1 class="headline">${hero.headline}</h1>
            <p class="summary">${hero.summary}</p>
        </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">`;
    
    for(let i=1; i<newsData.length; i++) {
        html += `
        <div class="hero-card" style="padding:20px;">
            <span class="news-tag">${newsData[i].tag}</span>
            <h3 style="margin:10px 0; color:#fff; font-size:20px; font-family:'Teko'">${newsData[i].headline}</h3>
        </div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
}

// --- START ENGINE ---
window.onload = function() {
    loadLiveScores();
    loadNews();
};
