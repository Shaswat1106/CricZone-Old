/* --- home.js : ULTIMATE FAIL-SAFE (Final Code) --- */

// --- BACKUP DATA (Upcoming Matches) ---
function getUpcomingMatches() {
    return [
        { title: "IPL 2025 • Match 1", description: "CSK vs MI starts tomorrow, 7:30 PM", status: "UPCOMING", matchStarted: false, matchEnded: false },
        { title: "Big Bash League • Final", description: "Sydney Thunder won by 5 runs", status: "RESULT", matchStarted: true, matchEnded: true },
        { title: "U19 World Cup • Day 1", description: "India U19 vs Pak U19 (Starting tomorrow)", status: "UPCOMING", matchStarted: false, matchEnded: false }
    ];
}

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    strip.innerHTML = '<div style="color:#00ff88; padding:20px; font-weight:bold;">♻️ Checking Global Feeds...</div>';

    try {
        const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml");
        const json = await response.json();

        // Check 1: Agar Feed empty hai (yaani items.length < 1)
        if (!json.items || json.items.length === 0) {
            // Agar empty hai, to UPCOMING matches load karo
            renderCards(getUpcomingMatches(), strip);
            return; 
        }

        // Check 2: Agar Live data mil gaya
        renderCards(json.items.slice(0, 10), strip);

    } catch (error) {
        // Check 3: Agar internet block hua to bhi UPCOMING data load karo
        console.error("Critical Fetch Error:", error);
        renderCards(getUpcomingMatches(), strip);
    }
}

// Card Renderer (Purana code, ab demo data ko bhi use karega)
function renderCards(matches, container) {
    container.innerHTML = "";
    matches.forEach(match => {
        let title = match.title ? match.title.replace('&amp;', '&') : match.series || "Match";
        let description = match.description || match.status;
        
        let statusLower = description.toLowerCase();
        let isFinished = statusLower.includes('won by') || statusLower.includes('tied') || statusLower.includes('result');
        let isLive = !isFinished && statusLower.includes('live'); // Only LIVE if explicitly says 'live' and not finished

        let borderClass = isLive ? 'live' : '';
        let statusColor = isLive ? '#00ff88' : '#aaa'; 
        let badgeHTML = isLive ? '<span class="blink-dot"></span> LIVE' : 'UPDATE';

        let card = `
        <div class="mini-card ${borderClass}">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #27272a; padding-bottom:5px;">
                <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase;">${match.series || 'CRICKET MATCH'}</span>
                <span class="live-badge" style="color:${isLive ? '#ff4444' : '#aaa'};">${badgeHTML}</span>
            </div>
            
            <div style="margin-top:5px; font-weight:bold; font-size:13px; color:#fff; line-height:1.4;">
                ${title}
            </div>

            <span style="font-size:11px; color:${statusColor}; display:block; margin-top:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${description}
            </span>
        </div>`;
        
        container.innerHTML += card;
    });
}

// News Loader (Same as before)
function loadNews() {
    const centerCol = document.querySelector('.col-center');
    if(!centerCol) return;
    
    // Yahan pura news code
    centerCol.innerHTML = `
        <div class="hero-news">
            <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370500/370560.jpg" class="hero-img-large">
            <div style="color:#00ff88; font-weight:bold; font-size:12px; margin-bottom:5px;">BORDER GAVASKAR TROPHY</div>
            <h1 class="hero-title">King Kohli's Masterclass: A Century to Remember in Perth</h1>
            <p style="color:#aaa; line-height:1.6;">Virat Kohli silenced his critics with a magnificent 80th international century, guiding India to a commanding position on Day 2 of the first Test.</p>
        </div>
        <div class="section-heading">LATEST STORIES</div>
        <div class="news-item">
            <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/370400/370489.jpg" class="news-thumb">
            <div class="news-info">
                <h2>Rishabh Pant Shatters Records: Sold for ₹27 Cr</h2>
                <span class="news-meta">2 Hours Ago • IPL 2025</span>
            </div>
        </div>
        <div class="news-item">
            <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/353400/353429.jpg" class="news-thumb">
            <div class="news-info">
                <h2>Why Bumrah is the best captain India never had</h2>
                <span class="news-meta">5 Hours Ago • Analysis</span>
            </div>
        </div>
    `;
}

window.onload = function() {
    loadNews(); 
    loadLiveScores(); 
};
