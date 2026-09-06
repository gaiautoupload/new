const data = window.STRATEGY_DATA;

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
