window.STRATEGY_DATA = {
  layers: {
    baseline: { number: "01", name: "基礎價量", label: "核心對照組", tone: "green", mean: 11.9, median: 11.3, winRate: 70.0, closed: 10, open: 1, description: "只依T0～T+2價格與相對量進場；退出採8%收盤回撤與T+9事件期限。", verdict: "主要Alpha來源" },
    broker: { number: "02", name: "純分點", label: "研究控制組", tone: "red", mean: -1.5, median: -1.7, winRate: 46.2, closed: 13, open: 2, description: "不使用v0.5價量型態，單靠買方集中、前三大持有者與淨買行為發出訊號。", verdict: "不可獨立使用" },
    cross: { number: "03", name: "價量 × 分點", label: "現行候選", tone: "amber", mean: 12.3, median: 11.3, winRate: 70.0, closed: 10, open: 1, description: "價量決定進場資格，BR雷達負責排序，持有分點共同派發可提前退出。", verdict: "目前最佳架構" }
  },
  brokers: [
    { id: "BR-0EC3E025", status: "核心", hits: 6, total: 16, precision: 37.5 },
    { id: "BR-2F94567C", status: "前瞻候選", hits: 5, total: 15, precision: 33.3 },
    { id: "BR-264EC224", status: "前瞻候選", hits: 6, total: 20, precision: 30.0 },
    { id: "BR-DB4642B5", status: "前瞻候選", hits: 5, total: 17, precision: 29.4 },
    { id: "BR-9D055819", status: "前瞻候選", hits: 5, total: 20, precision: 25.0 }
  ],
  consensus: [
    { label: "全體基準", value: 9.0, n: 89 },
    { label: "至少1家", value: 15.6, n: 45 },
    { label: "至少2家", value: 27.3, n: 22 },
    { label: "至少3家", value: 50.0, n: 10 },
    { label: "至少4家", value: 83.3, n: 6 }
  ],
  trades: [
    { id:"3644", name:"凌嘉科", date:"2026-06-15", entry:3, exit:9, ret:9.38, reason:"移動退出", status:"closed" },
    { id:"7824", name:"智寶", date:"2025-09-18", entry:3, exit:9, ret:14.47, reason:"移動退出", status:"closed" },
    { id:"7862", name:"聚泰", date:"2025-10-22", entry:3, exit:7, ret:-9.85, reason:"移動退出", status:"closed" },
    { id:"7870", name:"聯剛科技", date:"2025-11-21", entry:3, exit:9, ret:23.35, reason:"事件到期", status:"closed" },
    { id:"7871", name:"安立璽榮-KY", date:"2026-01-13", entry:3, exit:6, ret:-15.57, reason:"移動退出", status:"closed" },
    { id:"7892", name:"元鈦科", date:"2026-01-16", entry:3, exit:9, ret:52.01, reason:"事件到期", status:"closed" },
    { id:"7899", name:"景美", date:"2026-02-25", entry:3, exit:5, ret:3.09, reason:"移動退出", status:"closed" },
    { id:"7909", name:"鈺祥", date:"2026-03-25", entry:3, exit:4, ret:-1.73, reason:"分點派發", status:"closed" },
    { id:"7914", name:"碩明綠能", date:"2026-08-26", entry:3, exit:7, ret:-2.25, reason:"未平倉", status:"open" },
    { id:"7917", name:"源傑科技", date:"2026-07-29", entry:3, exit:8, ret:34.32, reason:"分點派發", status:"closed" },
    { id:"7918", name:"創鉅材料", date:"2026-05-11", entry:3, exit:6, ret:13.17, reason:"移動退出", status:"closed" }
  ]
};
