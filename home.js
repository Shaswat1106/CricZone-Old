/* home.js - CricZone live + news (fallback ready) */

/*
  Notes:
  - The code first attempts to load an RSS->JSON feed (free RSS->JSON used as demo).
  - If the feed fails or is empty, fallback mock matches are rendered.
  - You can replace the feed URL / logic with a proper cricket API later.
*/

function getUpcomingMatches() {
    return [
        { title: "IPL 2025 • CSK vs MI", description: "Tomorrow • 7:30 PM IST", series: "IPL 2025", status: "UPCOMING" },
        { title: "Big Bash League • Final", description: "Sydney Thunder won by 5 runs", series: "BBL", status: "RESULT" },
        { title: "U19 World Cup • India U19 vs Pak U19", description: "Tomorrow • Day 1", series: "U19 WC", status: "UPCOMING" }
    ];
}

function renderCards(matches, containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = "";
    matches.forEach(match => {
        const title = match.title || match.series || "Match";
        const description = match.description || match.status || "";
        const statusText = (description || "").toLowerCase();
        const isFinished = statusText.includes('won by') || statusText.includes('result') || statusText.includes('draw');
        const isLive = !isFinished && statusText.includes('live');
        const card = document.createElement('div');
        card.className = `mini-card ${isLive ? 'live' : ''}`;
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; border-bottom:1px solid #27272a; padding-bottom:6px;">
                <span style="font-size:11px; color:#a1a1aa; font-weight:700; text-transform:uppercase;">${match.series || 'CRICKET'}</span>
                <span style="font-size:12px; color:${isLive ? '#ff6b6b' : '#a1a1aa'}">${isLive ? '<span class="blink-dot"></span> LIVE' : (isFinished ? 'RESULT' : 'UPDATE')}</span>
            </div>
            <div style="font-weight:700; color:#fff; font-size:14px; line-height:1.4;">${title}</div>
            <div style="color:${isLive ? '#00ff88' : '#a1a1aa'}; margin-top:8px; font-size:13px;">${description}</div>
        `;
        containerEl.appendChild(card);
    });
}

async function loadLiveScores() {
    const strip = document.getElementById('match-strip');
    const loader = document.getElementById('feed-loader');

    // show temporary loader
    if (loader) loader.innerHTML = `<div style="color:var(--accent); padding:12px 18px; font-weight:700;">♻️ Checking Global Feeds...</div>`;

    // Example: a free RSS->JSON proxy; replace with a true cricket API later
    const rssProxy = "https://api.rss2json.com/v1/api.json?rss_url=http://static.cricinfo.com/rss/livescores.xml";

    try {
        const res = await fetch(rssProxy, { cache: "no-store" });
        if (!res.ok) throw new Error('Feed not OK');
        const data = await res.json();

        // items may be present in data.items; use slice for top results
        if (data && Array.isArray(data.items) && data.items.length > 0) {
            // map items to our card format
            const items = data.items.slice(0, 8).map(it => ({
                title: it.title,
                description: it.description || it.pubDate || '',
                series: it.author || 'Live'
            }));
            // clear strip and render
            strip.innerHTML = "";
            renderCards(items, strip);
            return;
        }

        // fallback
        strip.innerHTML = "";
        renderCards(getUpcomingMatches(), strip);
    } catch (err) {
        console.warn('Live feed error:', err);
        strip.innerHTML = "";
        renderCards(getUpcomingMatches(), strip);
    }
}

function loadNews() {
    const left = document.getElementById('news-container');
    if (!left) return;

    left.innerHTML = `
        <div class="hero-news">
            <img class="hero-img-large" src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/370500/370560.jpg" alt="hero">
            <div class="hero-content">
                <div class="news-tag">BORDER GAVASKAR TROPHY</div>
                <h2 class="hero-title">King Kohli's Masterclass: A Century to Remember in Perth</h2>
                <p class="hero-desc">Virat Kohli silenced his critics with a magnificent century, guiding India to a commanding position on Day 2 of the first Test.</p>
            </div>
        </div>

        <div class="section-heading">LATEST STORIES</div>

        <div class="news-item">
            <img class="news-thumb" src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/370400/370489.jpg" alt="thumb">
            <div class="news-info">
                <h2>Rishabh Pant Shatters Records: Sold for ₹27 Cr</h2>
                <div class="news-meta">2 Hours Ago • IPL 2025</div>
            </div>
        </div>

        <div class="news-item">
            <img class="news-thumb" src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/353400/353429.jpg" alt="thumb">
            <div class="news-info">
                <h2>Why Bumrah is the best captain India never had</h2>
                <div class="news-meta">5 Hours Ago • Analysis</div>
            </div>
        </div>
    `;
}

window.addEventListener('load', function () {
    loadNews();
    loadLiveScores();

    // auto refresh live scores every 60 seconds (safe default)
    setInterval(loadLiveScores, 60 * 1000);
});
