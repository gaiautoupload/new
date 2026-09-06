const data = window.STRATEGY_DATA;

document.querySelector("#liveCards").innerHTML = data.live.map((stock) => `
  <article class="live-card ${stock.tone}">
    <div class="live-card-top"><span class="stage">${stock.stage}</span><b>T+${stock.t}</b></div>
    <div class="stock-name"><div><h3>${stock.name}</h3><small>${stock.id}</small></div><strong>${stock.last.toLocaleString()}</strong></div>
    <div class="live-metrics">
      <span>較T0<strong class="${stock.fromT0 >= 0 ? "positive" : "negative"}">${stock.fromT0 > 0 ? "+" : ""}${stock.fromT0}%</strong></span>
      <span>BR雷達<strong>${stock.radar}家</strong></span>
      <span>前三大持有<strong>${stock.holderShare}%</strong></span>
    </div>
    <p>${stock.detail}</p>
  </article>`).join("");

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
  if (typeA) return { tone: "green", code: "TYPE A", title: "洗盤收復型成立", note: "T+2收盤確認；依回測紀律於下一交易日評估成交。", radar };
  if (typeB) return { tone: "amber", code: "TYPE B", title: "強勢整理型成立", note: "價格守住T0且成交量再次收斂；下一交易日評估成交。", radar };
  const misses = [];
  if (vr1 > .75) misses.push("V1/V0過高");
  if (clv2 < .55) misses.push("CLV2偏低");
  if (c2c0 < .9) misses.push("未守住T0價格區");
  if (!misses.length) misses.push("漲跌幅組合不屬於A/B型");
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
