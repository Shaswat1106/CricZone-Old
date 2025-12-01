/* --- home.js : FINAL FAIL-SAFE SYSTEM --- */

function getUpcomingMatches() {
    return [
        { title: "IPL 2025 • CSK vs MI", description: "Tomorrow • 7:30 PM IST", status: "UPCOMING", matchStarted: false, matchEnded: false, series: "IPL 2025" },
        { title: "Big Bash League • Final", description: "Sydney Thunder won by 5 runs", status: "RESULT", matchStarted: true, matchEnded: true, series: "BBL" },
        { title: "U19 World Cup • India U19 vs Pak U19", description: "Tomorrow • Day 1", status: "UPCOMING", matchStarted: false, matchEnded: false, series: "U19 WC" }
    ];
}

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    strip.innerHTML = '<div style="color:#e1b12c; padding:20px; font-weight:bold;">♻️ Checking Global Feeds...</div>';

    try {
        // RSS Feed Try Karo
        const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml");
        const json = await response.json();

        if (!json.items || json.items.length === 0) {
            // Agar API se kuch na mile, to Demo dikhao
            renderCards(getUpcomingMatches(), strip);
            return; 
        }
        
        // Agar data mil gaya to render karo
        renderCards(json.items.slice(0, 10), strip, true);

    } catch (error) {
        // Agar Fetching fail ho to bhi Demo dikhao
        renderCards(getUpcomingMatches(), strip, false);
    }
}

// Card Renderer Logic
function renderCards(matches, container, isApiData) {
    container.innerHTML = "";

    matches.forEach(match => {
        let title = match.title ? match.title.replace('&amp;', '&') : match.series || "Match";
        let description = match.description || match.status;

        // Status Logic (Check ki match khatam hua ya nahi)
        let statusLower = description.toLowerCase();
        let isFinished = statusLower.includes('won by') || statusLower.includes('tied') || statusLower.includes('result') || statusLower.includes('no result');
        let isLive = !isFinished && statusLower.includes('live'); // Only LIVE if status says 'live' and not finished

        let borderClass = isLive ? 'live' : '';
        let statusColor = isLive ? '#00ff88' : (isFinished ? '#3b94fd' : '#aaa'); 
        let badgeText = isLive ? 'LIVE' : (isFinished ? 'RESULT' : 'UPDATE');
        
        // Agar API nahi chali to series name me demo tag lagao
        let seriesTag = isApiData ? (match.series || 'MATCH CENTER') : 'DEMO SCHEDULE';


        let card = `
        <div class="mini-card ${borderClass}">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #27272a; padding-bottom:5px;">
                <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase;">${seriesTag}</span>
                <span style="font-size:10px; color:${isLive ? '#ff4444' : '#aaa'}; font-weight:bold;">${badgeText}</span>
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

window.onload = function() {
    loadNews();
    loadLiveScores(); 
};
