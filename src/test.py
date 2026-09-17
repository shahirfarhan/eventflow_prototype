<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Gaffers — Vendor Profiles</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #EEF1F7;
    --card: #FFFFFF;
    --ink: #171B23;
    --muted: #6B7280;
    --hairline: rgba(23,27,35,0.08);
    --tag-bg: #EEF1F6;
    --tag-ink: #4B5566;
    --star: #E7A339;
    --accent: #2F5D50;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--ink);
    padding: 48px 24px 64px;
  }
  .wrap { max-width: 900px; margin: 0 auto; }
  .header {
    margin-bottom: 40px;
  }
  .eyebrow-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .logo-mark {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #F4F1E8;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 15px;
  }
  .logo-word {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.01em;
    color: var(--ink);
  }
  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 30px;
    line-height: 1.25;
    margin: 0 0 10px;
    max-width: 480px;
    letter-spacing: -0.01em;
  }
  .sub {
    color: var(--muted);
    font-size: 15px;
    max-width: 440px;
    line-height: 1.55;
    margin: 0;
  }

  .grid {
    display: flex;
    gap: 22px;
    align-items: flex-start;
  }
  .col { display: flex; flex-direction: column; gap: 22px; flex: 1; min-width: 0; }
  .col.offset { margin-top: 56px; }

  .card {
    background: var(--card);
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid var(--hairline);
    box-shadow: 0 1px 2px rgba(23,27,35,0.04);
  }
  .card .photo {
    width: 100%;
    display: block;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    background: #DEE2E9;
  }
  .card.short .photo { aspect-ratio: 4 / 3.2; }

  .info { padding: 16px 18px 18px; }
  .name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 18px;
    margin: 0 0 2px;
    letter-spacing: -0.01em;
  }
  .location {
    font-size: 13.5px;
    color: var(--muted);
    margin: 0 0 12px;
  }
  .rating-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 13px;
  }
  .stars { display: flex; gap: 2px; }
  .stars svg { width: 14px; height: 14px; }
  .rating-value {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ink);
  }
  .rating-count {
    font-size: 13px;
    color: var(--muted);
  }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag {
    font-size: 12.5px;
    font-weight: 500;
    color: var(--tag-ink);
    background: var(--tag-bg);
    padding: 5px 11px;
    border-radius: 100px;
  }

  @media (max-width: 620px) {
    .grid { flex-direction: column; }
    .col.offset { margin-top: 0; }
    h1 { font-size: 25px; }
  }
</style>
</head>
<body>
<div class="wrap">

  <div class="header">
    <div class="eyebrow-row">
      <div class="logo-mark">G</div>
      <div class="logo-word">Gaffers</div>
    </div>
    <h1>Find vendors your event can count on</h1>
    <p class="sub">Browse photographers, venues, caterers and more — vetted by planners who've booked them before.</p>
  </div>

  <div class="grid">
    <div class="col">
      <div class="card">
        <img class="photo" src="">
        <div class="info">
          <p class="name">Flashpoint Studio</p>
          <p class="location">Kuala Lumpur</p>
          <div class="rating-row">
            <div class="stars"><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg></div>
            <span class="rating-value">4.9</span>
            <span class="rating-count">(214 reviews)</span>
          </div>
          <div class="tags"><span class="tag">Photography</span></div>
        </div>
      </div>

      <div class="card short">
        <img class="photo" src="">
        <div class="info">
          <p class="name">Kanan Kitchen</p>
          <p class="location">Petaling Jaya</p>
          <div class="rating-row">
            <div class="stars"><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg></div>
            <span class="rating-value">4.8</span>
            <span class="rating-count">(97 reviews)</span>
          </div>
          <div class="tags"><span class="tag">Food Catering</span></div>
        </div>
      </div>
    </div>

    <div class="col offset">
      <div class="card short">
        <img class="photo" src="">
        <div class="info">
          <p class="name">Vasanta Hall</p>
          <p class="location">KLCC, Kuala Lumpur</p>
          <div class="rating-row">
            <div class="stars"><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="var(--star)"/><stop offset="50%" stop-color="#D9DDE4"/></linearGradient></defs><path fill="url(#half)" d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg></div>
            <span class="rating-value">4.6</span>
            <span class="rating-count">(58 reviews)</span>
          </div>
          <div class="tags"><span class="tag">Venue</span></div>
        </div>
      </div>

      <div class="card">
        <img class="photo" src=""/>
        <div class="info">
          <p class="name">Arabelle Bridal</p>
          <p class="location">Shah Alam, Selangor</p>
          <div class="rating-row">
            <div class="stars"><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg><svg viewBox="0 0 20 20" fill="var(--star)"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8z"/></svg></div>
            <span class="rating-value">5.0</span>
            <span class="rating-count">(142 reviews)</span>
          </div>
          <div class="tags"><span class="tag">Attire</span></div>
        </div>
      </div>
    </div>
  </div>

</div>
</body>
</html>