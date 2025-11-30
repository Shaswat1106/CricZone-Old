/* --- home.js : FAST RSS FEED TRICK --- */

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    
    // Loading State
    strip.innerHTML = '<div style="color:#e1b12c; padding:20px; font-weight:bold;">♻️ Refreshing Live Feed...</div>';

    try {
        // Method: RSS to JSON Converter
        const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml");
        const json = await response.json();

        // Agar data nahi aaya
        if (!json.items) {
            strip.innerHTML = '<div style="color:red; padding:20px;">No Live Matches found via Feed.</div>';
            return;
        }

        strip.innerHTML = ""; // Clear Loading
        
        // Data Loop
        const matches = json.items.slice(0, 10);

        matches.forEach(match => {
            // Title clean karo
            let title = match.title.replace('&amp;', '&');
            let status = match.description;
            
            // Live Check
            let isLive = title.includes('*') || status.toLowerCase().includes('live');
            let borderClass = isLive ? 'live' : '';
            let statusColor = isLive ? '#00ff88' : '#aaa'; 
            let liveBadge = isLive ? '<span class="blink-dot"></span> LIVE' : 'MATCH CENTER';

            let card = `
            <div class="mini-card ${borderClass}">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:10px; color:#aaa; font-weight:bold; text-transform:uppercase; max-width:180px; overflow:hidden; white-space:nowrap;">
                        ${liveBadge}
                    </span>
                    <span style="font-size:10px; color:${isLive ? '#ff4444' : '#ccc'}; font-weight:bold;">
                       ${isLive ? '●' : ''}
                    </span>
                </div>
                
                <div style="margin-top:5px; font-weight:bold; font-size:13px; color:#fff; line-height:1.4;">
                    ${title}
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

// News Section (Static High Quality)
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
    loadLiveScores();
    loadNews();
};
