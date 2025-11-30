/* --- home.js : AUTOMATIC LIVE SCORES (API) --- */

// ✅ YOUR API KEY
const API_KEY = "f42f69a8-02ca-4650-a69b-484c22879c80"; 

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    
    // 1. Loading State
    strip.innerHTML = '<div style="color:#aaa; padding:20px; font-size:14px; font-weight:bold;">📡 Connecting to Stadium (Live)...</div>';

    try {
        // 2. Fetch Data from API
        const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
        const json = await response.json();

        // 3. Check if API worked
        if (json.status !== "success" || !json.data) {
            console.error("API Error:", json);
            strip.innerHTML = '<div style="color:#ff4444; padding:20px;">API Limit Reached (Try tomorrow) or Key Error.</div>';
            return;
        }

        // 4. Success - Clear Loading & Build Cards
        strip.innerHTML = ""; 
        
        // Sirf Top 10 Matches dikhayenge jo abhi chal rahe hain ya recent hain
        const matches = json.data.slice(0, 10);

        matches.forEach(match => {
            // --- LOGIC START ---
            
            // Check Live Status
            let isLive = match.matchStarted && !match.matchEnded;
            let statusColor = isLive ? '#00ff88' : '#aaa'; // Green for Live, Grey for others
            let liveBadge = isLive ? '<span class="blink-dot"></span> LIVE' : match.status;
            let borderClass = isLive ? 'live' : '';

            // Team Names (Short names prefer karenge)
            let t1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].shortname : "T1";
            let t2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].shortname : "T2";
            
            // Team Images (Agar API me nahi hai to default flag)
            let img1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].img : "https://via.placeholder.com/20";
            let img2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].img : "https://via.placeholder.com/20";

            // Score Handling (Score array hota hai, use loop karke nikalenge)
            let s1 = "-";
            let s2 = "-";

            if (match.score) {
                match.score.forEach(inning => {
                    if (inning.inning.includes(match.teamInfo[0].name)) {
                        s1 = `${inning.r}/${inning.w} <span style="font-size:10px; color:#888;">(${inning.o})</span>`;
                    }
                    if (inning.inning.includes(match.teamInfo[1].name)) {
                        s2 = `${inning.r}/${inning.w} <span style="font-size:10px; color:#888;">(${inning.o})</span>`;
                    }
                });
            }

            // --- HTML CARD ---
            let card = `
            <div class="mini-card ${borderClass}">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${match.name}
                    </span>
                    <span style="font-size:10px; color:${isLive ? '#ff4444' : '#ccc'}; font-weight:bold;">
                        ${isLive ? '● LIVE' : ''}
                    </span>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${img1}" style="width:20px; height:20px; border-radius:50%; object-fit:cover;">
                        <span>${t1}</span>
                    </div>
                    <span style="color:#fff;">${s1}</span>
                </div>

                <div style="display:flex; justify-content:space-between; margin-top:8px; font-weight:bold; font-size:14px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${img2}" style="width:20px; height:20px; border-radius:50%; object-fit:cover;">
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

    } catch (error) {
        console.error(error);
        strip.innerHTML = '<div style="color:red; padding:20px;">Network Error. Check Internet.</div>';
    }
}

// --- NEWS SECTION (Static for now - High Quality) ---
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

// --- START ENGINE ---
window.onload = function() {
    loadLiveScores();
    loadNews();
};
