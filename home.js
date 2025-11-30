/* --- home.js : SMART STATUS FIX --- */

async function loadLiveScores() {
    const container = document.getElementById('live-score-container');
    
    // Cache Buster (Taaki browser purana data na dikhaye)
    const time = new Date().getTime();
    
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml&t=${time}`);
        const json = await response.json();

        if (!json.items) throw new Error("No Data");

        container.innerHTML = ""; 

        // Top 15 Matches
        json.items.slice(0, 15).forEach(match => {
            let title = match.title; 
            let description = match.description; // e.g. "India won by 17 runs"
            
            // --- 1. SMART STATUS LOGIC (Yahan fix kiya hai) ---
            let statusLower = description.toLowerCase();
            
            // Check karo ki match khatam hua ya nahi
            let isFinished = statusLower.includes('won by') || 
                             statusLower.includes('drawn') || 
                             statusLower.includes('tied') || 
                             statusLower.includes('abandoned') ||
                             statusLower.includes('no result');

            // Agar Finished hai to Live nahi ho sakta
            let isLive = !isFinished;

            // Visual Settings
            let liveDot = isLive ? '<span class="live-indicator">●</span>' : '';
            let statusColor = isLive ? '#ff4444' : '#3b94fd'; // Live=Red, Result=Blue
            
            // --- 2. TEAM & SCORE PARSING ---
            let parts = title.split(' v ');
            let t1_Name = "Team A", t1_Score = "-", t1_Overs = "";
            let t2_Name = "Team B", t2_Score = "-", t2_Overs = "";

            if (parts.length >= 2) {
                let left = parseTeamData(parts[0]);
                t1_Name = left.name;
                t1_Score = left.score;
                t1_Overs = left.overs;

                let right = parseTeamData(parts[1].replace('*', ''));
                t2_Name = right.name;
                t2_Score = right.score;
                t2_Overs = right.overs;
            } else {
                t1_Name = title;
            }

            // --- 3. HTML CARD ---
            let card = `
            <div class="score-card-vertical" onclick="window.location.href='stats.html'">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span class="series-name" style="font-size:10px; color:#888;">MATCH UPDATE</span>
                    ${liveDot}
                </div>
                
                <div class="team-row">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:#e0e0e0; font-weight:700;">${t1_Name}</span>
                    </div>
                    <div style="text-align:right;">
                        <span style="color:#fff; font-weight:bold;">${t1_Score}</span>
                        <span style="color:#888; font-size:11px; margin-left:4px;">${t1_Overs}</span>
                    </div>
                </div>

                <div class="team-row">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:#e0e0e0; font-weight:700;">${t2_Name}</span>
                    </div>
                    <div style="text-align:right;">
                        <span style="color:#fff; font-weight:bold;">${t2_Score}</span>
                        <span style="color:#888; font-size:11px; margin-left:4px;">${t2_Overs}</span>
                    </div>
                </div>
                
                <span style="font-size:11px; color:${statusColor}; margin-top:8px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${description}
                </span>
            </div>`;
            
            container.innerHTML += card;
        });

    } catch (error) {
        container.innerHTML = '<div style="color:red; font-size:12px;">Data Error.</div>';
    }
}

// Helper to Format Score (349/8 -> 349-8)
function parseTeamData(rawString) {
    rawString = rawString.trim();
    let match = rawString.match(/(\d+\/\d+|\d+-\d+|\d+)/);
    
    if (match) {
        let scoreIndex = match.index;
        let name = rawString.substring(0, scoreIndex).trim();
        let rawScore = match[0];
        let finalScore = rawScore.replace('/', '-'); 
        
        let overs = "";
        if (rawString.includes('(')) {
            overs = rawString.match(/\((.*?)\)/)[0];
        }

        return { name: name, score: finalScore, overs: overs };
    }
    return { name: rawString, score: "", overs: "" };
}

window.onload = function() {
    loadLiveScores();
};
