/* --- home.js : THE ESPN RSS TRICK (No API Key Needed) --- */

// ✅ MAGIC LINK (ESPN ka Data -> JSON me convert karke layega)
const FEED_URL = "https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml";

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    
    // Loading Animation
    strip.innerHTML = '<div style="color:#00ff88; padding:20px; font-weight:bold;">📡 Hacking ESPN Data...</div>';

    try {
        const response = await fetch(FEED_URL);
        const json = await response.json();

        // Agar data nahi aaya
        if (!json.items) {
            strip.innerHTML = '<div style="color:red; padding:20px;">No Live Matches found via Feed.</div>';
            return;
        }

        strip.innerHTML = ""; // Clear Loading
        
        // ESPN ke feed me bahut saare match hote hain, top 10 uthao
        const matches = json.items.slice(0, 10);

        matches.forEach(match => {
            // --- DATA PARSING (Trick to separate Score from Title) ---
            // Title format usually: "IND 320/4 v AUS 177" OR "CSK v MI"
            let title = match.title;
            let status = match.description; // Example: "India lead by 143 runs"
            
            // Teams aur Score alag karne ki koshish
            let parts = title.split(' v ');
            let t1 = "Team A", s1 = "-";
            let t2 = "Team B", s2 = "-";

            if (parts.length === 2) {
                // Team 1 Data
                let leftSide = parts[0].trim(); // e.g. "IND 320/4"
                let lastSpace1 = leftSide.lastIndexOf(' ');
                if(lastSpace1 > 0 && /\d/.test(leftSide)) { // Agar score (number) hai
                    t1 = leftSide.substring(0, lastSpace1);
                    s1 = leftSide.substring(lastSpace1);
                } else {
                    t1 = leftSide;
                    s1 = "-";
                }

                // Team 2 Data
                let rightSide = parts[1].replace('*', '').trim(); // Remove * symbol
                let lastSpace2 = rightSide.lastIndexOf(' ');
                if(lastSpace2 > 0 && /\d/.test(rightSide)) {
                    t2 = rightSide.substring(0, lastSpace2);
                    s2 = rightSide.substring(lastSpace2);
                } else {
                    t2 = rightSide;
                    s2 = "-";
                }
            } else {
                t1 = title; // Fallback agar format alag ho
            }

            // Live Check (Agar '*' hai title me ya description me 'Live' hai)
            let isLive = title.includes('*') || status.toLowerCase().includes('live');
            let borderClass = isLive ? 'live' : '';
            let statusColor = isLive ? '#00ff88' : '#aaa'; 
            let liveBadge = isLive ? '<span class="blink-dot"></span> LIVE' : 'MATCH CENTER';

            // --- HTML CARD ---
            let card = `
            <div class="mini-card ${borderClass}">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase;">MATCH UPDATE</span>
                    <span style="font-size:10px; color:${isLive ? '#ff4444' : '#ccc'}; font-weight:bold;">
                        ${liveBadge}
                    </span>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <span style="color:#fff;">${t1}</span>
                    <span style="color:#fff;">${s1}</span>
                </div>

                <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:14px;">
                    <span style="color:#fff;">${t2}</span>
                    <span style="color:#fff;">${s2}</span>
                </div>

                <span style="font-size:11px; color:${statusColor}; display:block; margin-top:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${status}
                </span>
            </div>`;
            
            strip.innerHTML += card;
        });

    } catch (error) {
        console.error(error);
        strip.innerHTML = '<div style="color:red; padding:20px;">Feed Error.</div>';
    }
}

// --- NEWS SECTION (High Quality Static) ---
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

// Start
window.onload = function() {
    loadLiveScores();
    loadNews();
};
