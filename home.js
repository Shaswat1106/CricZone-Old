/* --- home.js : PROXY FIXED LIVE SCORES --- */

const API_KEY = "f42f69a8-02ca-4650-a69b-484c22879c80"; 

// ✅ PROXY URL (Ye CORS error ko bypass karega)
const PROXY = "https://api.allorigins.win/raw?url=";
const TARGET_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`;

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    
    // Loading Indicator
    strip.innerHTML = '<div style="color:#e1b12c; padding:20px; font-weight:bold; font-size:14px;">📡 Establishing Secure Connection...</div>';

    try {
        // Proxy ke through call karo
        const response = await fetch(PROXY + encodeURIComponent(TARGET_URL));
        const json = await response.json();

        // Check if Data exists
        if (json.status !== "success" || !json.data) {
            console.error("API Issue:", json);
            // Agar API fail hui, to Error dikhao (Demo nahi, taaki pata chale issue kya hai)
            strip.innerHTML = `<div style="color:#ff4444; padding:20px; font-size:12px;">
                API Error: ${json.status || "Limit Exceeded"}. <br>Try again tomorrow or use new Key.
            </div>`;
            return;
        }

        strip.innerHTML = ""; // Clear Loading
        
        // Sirf wahi match dikhao jo chalu hain ya abhi khatam huye
        // Aur faltu matches filter karo
        const matches = json.data.filter(m => m.name.length < 50).slice(0, 10);

        if(matches.length === 0) {
            strip.innerHTML = '<div style="color:#aaa; padding:20px;">No International Matches Live right now.</div>';
            return;
        }

        matches.forEach(match => {
            // Logic
            let isLive = match.matchStarted && !match.matchEnded;
            let liveClass = isLive ? 'live' : '';
            let statusColor = isLive ? '#00ff88' : '#aaa'; 
            
            // Score Handling
            let t1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].shortname : "T1";
            let t2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].shortname : "T2";
            let img1 = match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].img : "";
            let img2 = match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].img : "";
            
            let s1 = "-";
            let s2 = "-";

            if (match.score) {
                match.score.forEach(inning => {
                    if (inning.inning.includes(match.teamInfo[0].name)) s1 = `${inning.r}/${inning.w} <span style="font-size:10px; color:#888;">(${inning.o})</span>`;
                    if (inning.inning.includes(match.teamInfo[1].name)) s2 = `${inning.r}/${inning.w} <span style="font-size:10px; color:#888;">(${inning.o})</span>`;
                });
            }

            let card = `
            <div class="mini-card ${liveClass}">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase; max-width:150px; overflow:hidden; white-space:nowrap;">
                        ${match.matchType ? match.matchType.toUpperCase() : 'MATCH'}
                    </span>
                    <span style="font-size:10px; color:${isLive ? '#ff4444' : '#ccc'}; font-weight:bold;">
                        ${isLive ? '● LIVE' : match.status}
                    </span>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${img1}" style="width:20px; height:20px; border-radius:50%; object-fit:cover;" onerror="this.style.display='none'">
                        <span>${t1}</span>
                    </div>
                    <span style="color:#fff;">${s1}</span>
                </div>

                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${img2}" style="width:20px; height:20px; border-radius:50%; object-fit:cover;" onerror="this.style.display='none'">
                        <span>${t2}</span>
                    </div>
                    <span style="color:#fff;">${s2}</span>
                </div>

                <span style="font-size:11px; color:${statusColor}; display:block; margin-top:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${match.status}
                </span>
            </div>`;
            
            strip.innerHTML += card;
        });

    } catch (error) {
        console.error(error);
        // Agar Proxy bhi fail ho, tabhi Demo dikhao
        strip.innerHTML = '<div style="color:red; padding:20px;">Connection Error. Showing Demo Data...</div>';
        renderDemoData(); // Fallback
    }
}

// --- NEWS SECTION ---
function loadNews() {
    const container = document.getElementById('news-container');
    if(!container) return;
    
    container.innerHTML = `
    <div class="hero-card">
        <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370500/370560.jpg" class="hero-img">
        <div class="hero-content">
            <span class="news-tag">TOP STORY</span>
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

// Fallback Function (Agar API na chale to ye chalega)
function renderDemoData() {
    const strip = document.querySelector('.match-strip');
    const demoHTML = `
        <div class="mini-card live">
            <span style="font-size:10px; color:#aaa;">DEMO MODE • API LIMIT REACHED</span>
            <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold;"><span>IND</span> <span style="color:#fff;">320/4</span></div>
            <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold;"><span>AUS</span> <span style="color:#fff;">177</span></div>
            <span style="font-size:11px; color:#00ff88; margin-top:8px; display:block;">India lead by 143 runs</span>
        </div>`;
    strip.innerHTML = demoHTML;
}

window.onload = function() {
    loadLiveScores();
    loadNews();
};
