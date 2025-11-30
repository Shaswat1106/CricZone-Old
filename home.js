/* --- home.js : FAIL-SAFE VERSION --- */

async function loadLiveScores() {
    const container = document.getElementById('live-score-container');
    
    // Loading Text
    container.innerHTML = '<div style="color:#e1b12c; font-size:12px;">♻️ Syncing Data...</div>';

    try {
        // 1. Try Fetching Data (HTTPS Proxy use kar rahe hain)
        const response = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("http://static.cricinfo.com/rss/livescores.xml"));
        const data = await response.json();
        
        // XML Parse karna padega kyunki AllOrigins XML text deta hai
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        if (items.length === 0) throw new Error("No Data");

        container.innerHTML = ""; // Clear Loading

        // Top 10 Matches Process Karo
        for (let i = 0; i < Math.min(items.length, 10); i++) {
            let title = items[i].getElementsByTagName("title")[0].textContent;
            let description = items[i].getElementsByTagName("description")[0].textContent;
            renderMatchCard(container, title, description);
        }

    } catch (error) {
        console.warn("Feed Blocked/Failed, Loading Demo Data...");
        // 2. ERROR AANE PAR DEMO DATA DIKHAO (Empty nahi chodna)
        loadDemoMatches(container);
    }
}

// --- HELPER: CARD BANANE WALA FUNCTION ---
function renderMatchCard(container, title, description) {
    // Logic: Live hai ya nahi
    let isLive = description.includes('Live') || title.includes('*');
    let liveDot = isLive ? '<span class="live-indicator">●</span>' : '';
    let statusColor = isLive ? '#ff4444' : '#00ff88'; // Red for Live
    
    // Team Names aur Score alag karo
    let parts = title.split(' v ');
    let t1 = parts[0] || "Team A";
    let t2 = parts[1] || "Team B";

    // Card HTML
    let card = `
    <div class="score-card-vertical">
        <span class="series-name">MATCH UPDATE ${liveDot}</span>
        
        <div class="team-row">
            <span>${t1}</span>
        </div>
        <div class="team-row">
            <span>${t2}</span>
        </div>
        
        <span style="font-size:11px; color:${statusColor}; margin-top:8px; display:block;">
            ${description}
        </span>
    </div>`;
    
    container.innerHTML += card;
}

// --- BACKUP: DEMO DATA (Agar Internet/API fail ho) ---
function loadDemoMatches(container) {
    container.innerHTML = "";
    
    const demos = [
        { t: "IND 349/8 v SA 332", d: "India won by 17 runs" },
        { t: "AUS 177 v IND 320/4*", d: "Stumps - Day 2: India lead by 143 runs" },
        { t: "CSK v MI", d: "Match starts tomorrow at 7:30 PM" }
    ];

    demos.forEach(m => renderMatchCard(container, m.t, m.d));
}

// --- NEWS LOADER (Center Column) ---
function loadNews() {
    // Center column dhoondo
    const centerCol = document.querySelector('.col-center');
    if(!centerCol) return;

    centerCol.innerHTML = `
        <div class="hero-news">
            <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370500/370560.jpg" class="hero-img-large">
            <div style="color:#00ff88; font-weight:bold; font-size:12px; margin-bottom:5px;">BORDER GAVASKAR TROPHY</div>
            <h1 class="hero-title">King Kohli's Masterclass: A Century to Remember in Perth</h1>
            <p style="color:#aaa; line-height:1.6;">Virat Kohli silenced his critics with a magnificent 80th international century, guiding India to a commanding position on Day 2 of the first Test.</p>
        </div>

        <div class="section-heading">LATEST STORIES</div>

        <div class="news-item">
            <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370400/370489.jpg" class="news-thumb">
            <div class="news-info">
                <h2>Rishabh Pant Shatters Records: Sold for ₹27 Cr</h2>
                <p>Punjab Kings went all out for the Indian wicketkeeper, making him the most expensive player in IPL auction history.</p>
                <span class="news-meta">2 Hours Ago • IPL 2025</span>
            </div>
        </div>

        <div class="news-item">
            <img src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/353400/353429.jpg" class="news-thumb">
            <div class="news-info">
                <h2>Why Bumrah is the best captain India never had</h2>
                <p>An in-depth analysis of Jasprit Bumrah's tactical acumen and bowling rotations in SENA countries.</p>
                <span class="news-meta">5 Hours Ago • Analysis</span>
            </div>
        </div>
    `;
}

// START
window.onload = function() {
    loadLiveScores();
    loadNews();
};
