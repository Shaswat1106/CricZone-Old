/* --- home.js : FINAL FAIL-SAFE SYSTEM --- */

function getDemoMatches() {
    return [
        { name: "IND 320/4 v AUS 177", series: "BGT 1st Test", description: "India lead by 143 runs", status: "LIVE" },
        { name: "SA 287/8 v ENG 240", series: "2nd ODI", description: "South Africa won by 47 runs", status: "RESULT" },
        { name: "IPL 2025 • CSK v MI", series: "UPCOMING", description: "Match starts tomorrow at 7:30 PM", status: "UPCOMING" }
    ];
}

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    strip.innerHTML = '<div style="color:#e1b12c; padding:20px; font-weight:bold;">📡 Connecting to Feed...</div>';

    try {
        // RSS Feed (Fastest Free Source)
        const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml");
        const json = await response.json();

        if (json.items && json.items.length > 0) {
            renderCards(json.items.slice(0, 10), strip);
        } else {
            // API se kuch nahi aaya, to Demo dikhao
            renderCards(getDemoMatches(), strip); 
        }

    } catch (error) {
        // Error aane par bhi Demo dikhao (Never leave it blank)
        renderCards(getDemoMatches(), strip);
    }
}

function renderCards(matches, container) {
    container.innerHTML = "";
    matches.forEach(match => {
        let title = match.title ? match.title.replace('&amp;', '&') : match.series || "Match";
        let description = match.description || match.status;

        // Logic
        let statusLower = description.toLowerCase();
        let isFinished = statusLower.includes('won by') || statusLower.includes('tied') || statusLower.includes('result');
        let isLive = !isFinished && statusLower.includes('live');
        
        let borderClass = isLive ? 'live' : '';
        let statusColor = isLive ? '#00ff88' : '#3b94fd'; 
        let badgeText = isLive ? 'LIVE' : (isFinished ? 'RESULT' : 'UPDATE');
        
        // Final Card HTML (Horizontal Slider Style)
        let card = `
        <div class="mini-card ${borderClass}">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #27272a; padding-bottom:5px;">
                <span style="font-size:10px; color:#aaa; font-weight:bold;">MATCH CENTER</span>
                <span style="font-size:10px; color:${isLive ? '#ff4444' : '#ccc'}; font-weight:bold;">${badgeText}</span>
            </div>
            
            <div style="margin-top:5px; font-weight:bold; font-size:13px; color:#fff; line-height:1.4;">${title}</div>
            
            <span style="font-size:11px; color:${statusColor}; display:block; margin-top:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${description}
            </span>
        </div>`;
        
        container.innerHTML += card;
    });
}

function loadNews() {
    const container = document.getElementById('news-container');
    if(!container) return;
    
    // News Section Structure (Static Demo)
    container.innerHTML = `
    <div class="hero-card">
        <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370500/370560.jpg" class="hero-img-large">
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

window.onload = function() {
    loadNews(); 
    loadLiveScores(); 
};
