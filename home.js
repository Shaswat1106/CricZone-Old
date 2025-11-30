/* --- home.js : PUBLIC API (No Vercel Needed) --- */

async function loadLiveScores() {
    const strip = document.querySelector('.match-strip');
    strip.innerHTML = '<div style="color:#00ff88; padding:20px;">📡 Fetching Data...</div>';

    try {
        // Ye ek open public API hai (Testing ke liye)
        const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=f42f69a8-02ca-4650-a69b-484c22879c80&offset=0");
        const json = await response.json();

        if (!json.data) {
            strip.innerHTML = '<div style="color:red; padding:20px;">Server Busy.</div>';
            return;
        }

        strip.innerHTML = ""; 
        const matches = json.data.slice(0, 8);

        matches.forEach(match => {
            let isLive = match.matchStarted && !match.matchEnded;
            let statusColor = isLive ? '#00ff88' : '#aaa'; 
            let liveClass = isLive ? 'live' : '';

            // Score formatting
            let score = "-";
            if(match.score && match.score[0]) {
                score = `${match.score[0].r}/${match.score[0].w} (${match.score[0].o})`;
            }

            let card = `
            <div class="mini-card ${liveClass}">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                    <span style="font-size:10px; color:#aaa; font-weight:bold;">${match.matchType.toUpperCase()}</span>
                    <span style="font-size:10px; color:${isLive ? '#ff4444' : '#aaa'}; font-weight:bold;">${isLive ? '● LIVE' : 'RESULT'}</span>
                </div>
                
                <div style="margin-top:5px; font-weight:bold; font-size:14px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>${match.teamInfo[0].shortname}</span>
                        <span style="color:#fff;">${score}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:5px;">
                        <span>${match.teamInfo[1].shortname}</span>
                        <span style="color:#fff;">-</span>
                    </div>
                </div>
                <span style="font-size:11px; color:${statusColor}; display:block; margin-top:10px;">${match.status}</span>
            </div>`;
            
            strip.innerHTML += card;
        });

    } catch (error) {
        strip.innerHTML = '<div style="color:red; padding:20px;">Error Loading.</div>';
    }
}

function loadNews() {
    // News code same rahega
}

window.onload = function() {
    loadLiveScores();
    loadNews();
};
