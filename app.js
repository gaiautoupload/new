const data = window.STRATEGY_DATA;
const daily = window.DAILY_STRATEGY;
data.layers.cross.label = '正式執行策略';
data.layers.cross.verdict = '已採用，持續驗證';
data.layers.cross.description = 'A/B價量與分點退出正式執行；C型複合條件亦正式採用，獨立記錄。採用前交易仍屬回溯模擬。';
if (daily) {
  data.live = daily.live;
  data.trades = daily.trades;
  for (const key of Object.keys(daily.layers)) Object.assign(data.layers[key], daily.layers[key]);
  document.querySelector('.as-of').textContent = 'v1.4 · 每日策略';
  document.querySelector('#freshness').textContent = `行情 ${daily.priceDate} ｜籌碼 ${daily.brokerDate} ｜研究快照，請核對交易日期`;
  document.querySelector('.live-title p').textContent = `產生時間 ${daily.generated}`;
  document.querySelector('#dailyNotice').textContent = `🆕 今日新登錄興櫃｜${daily.today}：${daily.todayListingStatus} BR名單凍結於9/4，買賣明細更新至${daily.brokerDate}；舊標的標為回溯觀察。`;
  document.querySelector('#population').textContent = daily.eventCount;
  document.querySelector('#mature').textContent = daily.matureCount;
}

// Counts come directly from the closed rows, matching the backtest definition.
if (daily) data.layers.cross.closed = data.trades.filter(t => t.status === 'closed').length;
function category(stock) {
  if (/退出訊號/.test(stock.stage)) return 'sell';
  if (/確認待執行/.test(stock.stage)) return 'buy';
  return 'wait';
}
function decision(stock) {
  const key = category(stock);
  if (key === 'sell') return ['賣出', '已持有者：下一交易日執行退出；未持有者不買'];
  if (key === 'buy') return ['買進', '新訊號成立：下一交易日執行，先核對成交價差'];
  if (/持有/.test(stock.stage)) return ['觀望｜續抱', '已持有者續抱；未持有者等待新買點，不追補歷史進場'];
  if (/已退出/.test(stock.stage)) return ['觀望', '本輪已退出，等待新的進場訊號'];
  return ['觀望', '買進條件尚未成立，暫不進場'];
}
function nextStep(stock) {
  if (/退出訊號/.test(stock.stage)) return '下一交易日：依退出規則評估成交';
  if (/確認待執行/.test(stock.stage)) return '下一交易日：評估進場與成交價差';
  if (/已退出/.test(stock.stage)) return '本輪已結束，保留交易紀錄';
  if (/C型/.test(stock.stage)) return 'C型正式規則：每日檢查回撤8%、分點派發與T+9到期';
  if (/持有/.test(stock.stage)) return '盤後：檢查回撤、分點派發與到期條件';
  if (stock.t < 2) return '等待T+2完整價量資料';
  return '尚無進場指示，繼續觀察';
}
const order = {sell:0,buy:1,wait:2};
const stocks = [...data.live].sort((a,b) => order[category(a)]-order[category(b)] || a.t-b.t);
document.querySelector('#actionSummary').innerHTML = [['buy','買進'],['wait','觀望'],['sell','賣出']].map(([key,label]) => `<div><strong>${stocks.filter(s=>category(s)===key).length}</strong><span>${label}</span></div>`).join('');
function renderWatch(filter = 'all') {
const selected = stocks.filter(s => filter === 'all' || category(s) === filter);
document.querySelector("#liveCards").innerHTML = selected.map((stock) => `
  <article class="live-card ${stock.tone}">
    <div class="decision decision-${category(stock)}">${decision(stock)[0]}</div>
    <div class="live-card-top"><span class="stage">${stock.stage}</span><b>${stock.t === 0 ? 'T0' : `T+${stock.t}`}</b></div>
    <div class="stock-name"><div><h3>${stock.name}</h3><small>${stock.id}</small></div><strong>${stock.last.toLocaleString()}</strong></div>
    <div class="next-step">${decision(stock)[1]}<small class="decision-date">依 ${daily ? daily.priceDate : '未確認日期'} 盤後資料判定 · 策略訊號，非實際委託紀錄</small></div>
    <details class="stock-detail"><summary>價量、籌碼與判定依據</summary><div class="live-metrics">
      <span>較T0<strong class="${stock.fromT0 >= 0 ? "positive" : "negative"}">${stock.fromT0 > 0 ? "+" : ""}${stock.fromT0}%</strong></span>
      <span>前三日BR命中<strong>${stock.radar == null ? '資料缺漏' : stock.radar}${typeof stock.radar === 'number' ? '/5家' : ''}</strong></span>
      <span>前三大持有<strong>${stock.holderShare}%</strong></span>
    </div>
    <p>${stock.detail}</p>
    <p>${stock.radarMode || ''} · ${stock.radarDate || '日期待確認'}<br>${stock.radarNote || '尚無雷達明細'}</p>
    ${(stock.radarEvidence || []).map(e => `<p><strong>${e.alias}（${e.role}）</strong><br>前三日淨買 ${e.earlyNetShares.toLocaleString()} 股；最新日淨買 ${e.todayNetShares.toLocaleString()} 股／${Math.round(e.todayNetAmount).toLocaleString()} 元</p>`).join('')}
    </details>
  </article>`).join("") || '<p class="empty-state">本快照沒有此類標的。</p>';
}
renderWatch();
document.querySelectorAll('[data-watch]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-watch]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  renderWatch(button.dataset.watch);
}));
document.querySelectorAll('[data-open-research], .site-header nav a, .hero-actions a').forEach(link => link.addEventListener('click', () => { document.querySelector('.research-details').open = true; }));
if (location.hash && location.hash !== '#live' && location.hash !== '#top') document.querySelector('.research-details').open = true;

const layerPanel = document.querySelector("#layerPanel");
const layerButtons = [...document.querySelectorAll("[data-layer]")];

function renderLayer(key) {
  const item = data.layers[key];
  layerPanel.innerHTML = `
    <div class="layer-copy">
      <span class="layer-number">${item.number}</span>
      <div><span class="pill ${item.tone}">${item.label}</span><h3>${item.name}</h3><p>${item.description}</p><strong>${item.verdict}</strong></div>
    </div>
    <div class="metric"><span>平均報酬</span><strong class="${item.mean >= 0 ? "positive" : "negative"}">${item.mean > 0 ? "+" : ""}${item.mean}%</strong><small>已平倉 ${item.closed} 筆</small></div>
    <div class="metric"><span>中位數</span><strong class="${item.median >= 0 ? "positive" : "negative"}">${item.median > 0 ? "+" : ""}${item.median}%</strong><small>未平倉 ${item.open} 筆</small></div>
    <div class="metric"><span>勝率</span><strong>${item.winRate}%</strong><small>未計未平倉</small></div>`;
}

layerButtons.forEach((button) => button.addEventListener("click", () => {
  layerButtons.forEach((item) => item.setAttribute("aria-selected", "false"));
  button.setAttribute("aria-selected", "true");
  renderLayer(button.dataset.layer);
}));

document.querySelector("#brokerList").innerHTML = data.brokers.map((broker, index) => `
  <article class="broker-row">
    <span class="rank">0${index + 1}</span>
    <div><strong>${broker.id}</strong><small>${broker.status} · ${broker.hits}/${broker.total} 次</small></div>
    <div class="precision"><strong>${broker.precision}%</strong><span><i style="width:${broker.precision}%"></i></span></div>
  </article>`).join("");

const maxConsensus = Math.max(...data.consensus.map((item) => item.value));
document.querySelector("#consensusBars").innerHTML = data.consensus.map((item) => `
  <div class="bar-row"><span>${item.label}<small>N=${item.n}</small></span><div><i style="width:${item.value / maxConsensus * 100}%"></i></div><strong>${item.value}%</strong></div>`).join("");

const tradeRows = document.querySelector("#tradeRows");
function renderTrades(filter = "all") {
  const rows = data.trades.filter((trade) => filter === "all" || (filter === "win" ? trade.ret > 0 : trade.ret <= 0));
  tradeRows.innerHTML = rows.map((trade) => `
    <tr><td><strong>${trade.name}</strong><small>${trade.id}</small></td><td>${trade.date}</td><td>T+${trade.entry}</td><td>${trade.status === "open" ? "觀察中" : `T+${trade.exit}`}</td><td>${trade.reason}</td><td class="right ${trade.ret >= 0 ? "positive" : "negative"}">${trade.ret > 0 ? "+" : ""}${trade.ret.toFixed(2)}%</td></tr>`).join("");
}

function classifySignal(values) {
  const { r1, r2, vr1, vr2, c2c0, clv2, radarHits } = values;
  const radar = radarHits >= 4 ? "最高雷達" : radarHits >= 3 ? "高優先" : radarHits >= 2 ? "優先觀察" : "一般觀察";
  if (r1 <= -15) return { tone: "red", code: "NO BUY", title: "價格結構已破壞", note: `T+1跌幅達 ${r1.toFixed(1)}%，低於策略容許範圍。`, radar };
  if (r2 > 20) return { tone: "red", code: "OVERHEAT", title: "續強過熱，不追價", note: `T+2單日上漲 ${r2.toFixed(1)}%，超過20%追價上限。`, radar };
  const typeA = r1 > -15 && r1 < 0 && r2 >= 3 && r2 <= 20 && vr1 <= .75 && c2c0 >= .9 && clv2 >= .55;
  const typeB = r1 >= 0 && r1 <= 20 && r2 >= -5 && r2 <= 3 && vr1 <= .75 && vr2 <= .70 && c2c0 >= 1;
  const typeCWatch = r1 >= -10 && r1 < 0 && r2 >= -8 && r2 <= 2 && vr1 <= .60 && vr2 <= .75 && c2c0 >= .90;
  if (typeA) return { tone: "green", code: "TYPE A", title: "洗盤收復型成立", note: "T+2收盤確認；依回測紀律於下一交易日評估成交。", radar };
  if (typeB) return { tone: "amber", code: "TYPE B", title: "強勢整理型成立", note: "價格守住T0且成交量再次收斂；下一交易日評估成交。", radar };
  if (typeCWatch) return { tone: "amber", code: "C SETUP", title: "C型待完整確認", note: "C型已正式採用；此表僅初篩，還需完整VWAP、留倉、分點條件及T+3～T+5突破確認，下一交易日執行。", radar };
  const misses = [];
  if (vr1 > .75) misses.push("V1/V0過高");
  if (clv2 < .55) misses.push("CLV2偏低");
  if (c2c0 < .9) misses.push("未守住T0價格區");
  if (!misses.length) misses.push("漲跌幅組合不屬於A/B/C型");
  return { tone: "muted", code: "WAIT", title: "條件不足，暫不進場", note: misses.join("、") + "。", radar };
}

function updateSignalResult() {
  const values = {
    r1: Number(document.querySelector("#r1").value), r2: Number(document.querySelector("#r2").value),
    vr1: Number(document.querySelector("#vr1").value), vr2: Number(document.querySelector("#vr2").value),
    c2c0: Number(document.querySelector("#c2c0").value), clv2: Number(document.querySelector("#clv2").value),
    radarHits: Number(document.querySelector("#radarHits").value)
  };
  const result = classifySignal(values);
  document.querySelector("#signalResult").innerHTML = `
    <div class="signal-code ${result.tone}">${result.code}</div>
    <div><span>${result.radar}</span><h3>${result.title}</h3><p>${result.note}</p></div>
    <small>訊號僅供研究，仍須考量實際價差與成交能力。</small>`;
}

document.querySelector("#signalForm").addEventListener("submit", (event) => { event.preventDefault(); updateSignalResult(); });

document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderTrades(button.dataset.filter);
}));

const dialog = document.querySelector("#methodDialog");
document.querySelector("#methodButton").addEventListener("click", () => dialog.showModal());
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add("visible");
}), { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

renderLayer("baseline");
renderTrades();
updateSignalResult();
