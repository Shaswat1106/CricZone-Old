/* --- home.js : FAIL-SAFE VERSION --- */

// 1. NEWS LOADER (Static & Fast)
function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

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

// 2. LIVE SCORES (RSS with Backup)
async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    strip.innerHTML = '<div style="color:#e1b12c; padding:20px; font-weight:bold;">♻️ Syncing Matches...</div>';

    try {
        // RSS Feed Try Karo
        const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml");
        const json = await response.json();

        // Agar items nahi mile
        if (!json.items) throw new Error("Feed Error");

        strip.innerHTML = ""; // Clear Loading
        renderCards(json.items.slice(0, 10), strip);

    } catch (error) {
        console.warn("Feed Failed, Loading Demo Data");
        // Backup Data Load Karo
        renderDemoData(strip);
    }
}

// Card Banane ka Logic
function renderCards(matches, container) {
    matches.forEach(match => {
        let title = match.title.replace('&amp;', '&');
        let description = match.description;
        
        // Smart Status Logic
        let statusLower = description.toLowerCase();
        let isFinished = statusLower.includes('won by') || statusLower.includes('drawn') || statusLower.includes('tied');
        let isLive = !isFinished; 

        let borderClass = isLive ? 'live' : '';
        let statusColor = isLive ? '#00ff88' : '#3b94fd'; 
        let badgeHTML = isLive ? '<span class="blink-dot"></span> LIVE' : '<span style="color:#aaa">RESULT</span>';

        // Teams Parse
        let parts = title.split(' v ');
        let t1 = parts[0] || "Team A";
        let t2 = parts[1] || "Team B";

        let card = `
        <div class="mini-card ${borderClass}">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #27272a; padding-bottom:5px;">
                <span style="font-size:10px; color:#888; font-weight:bold;">MATCH CENTER</span>
                <span class="live-badge">${badgeHTML}</span>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:13px;">
                <span style="color:#fff;">${t1}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:5px; font-weight:bold; font-size:13px;">
                <span style="color:#fff;">${t2}</span>
            </div>

            <span style="font-size:11px; color:${statusColor}; display:block; margin-top:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${description}
            </span>
        </div>`;
        
        container.innerHTML += card;
    });
}

// Backup Data (Agar Internet/API slow ho)
function renderDemoData(container) {
    container.innerHTML = "";
    const demos = [
        { title: "IND 320/4 v AUS 177", description: "India lead by 143 runs" },
        { title: "CSK v MI", description: "Match starts tomorrow at 7:30 PM" },
        { title: "SA 287/8 v ENG 240", description: "South Africa won by 47 runs" }
    ];
    renderCards(demos, container);
}

// Start Engine
window.onload = function() {
    loadNews(); // News pehle load hogi
    loadLiveScores(); // Phir Score
};
