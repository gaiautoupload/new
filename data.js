window.STRATEGY_DATA = {
  live: [
    { id:"7914", name:"碩明綠能", t:7, stage:"持有監控", tone:"green", last:38.0, fromT0:-4.0, radar:0, holderShare:57.5, flow:43.0, detail:"A型於T+2成立，T+3進場；前三大持有者目前仍為淨買。" },
    { id:"7686", name:"捷立康", t:4, stage:"雷達觀察・不追", tone:"amber", last:802.0, fromT0:54.2, radar:2, holderShare:33.0, flow:8.6, detail:"T0有2家候選BR，但T+2價量未成立；後續噴出不回補訊號。" },
    { id:"7932", name:"昱鐳應材", t:5, stage:"未進場觀察", tone:"amber", last:404.5, fromT0:2.4, radar:1, holderShare:44.6, flow:6.7, detail:"T+2跌幅略超過B型範圍；目前回到T0上方，保留為反例樣本。" },
    { id:"6950", name:"科科科技-KY", t:4, stage:"價量淘汰", tone:"red", last:24.9, fromT0:-11.5, radar:0, holderShare:22.0, flow:14.2, detail:"T+2續跌且量比放大，未通過A/B型；即使分點承接也不單獨買。" },
    { id:"7945", name:"廣盛科技", t:11, stage:"事件結束", tone:"red", last:214.0, fromT0:-27.5, radar:0, holderShare:25.4, flow:23.1, detail:"T+2價量結構未成立，且已超過T+9事件期限。" }
  ],
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
