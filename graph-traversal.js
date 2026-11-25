const graphTraversal = (() => {
  "use strict";

  const graph = { A: ["B", "C"], B: ["D"], C: ["E"], D: ["E", "A"], E: [] };
  const notes = {
    bfs: {
      A: "Aから見つけたBとCをキューに入れます。",
      B: "BからDを発見。先に並んでいたCが次です。",
      C: "Cから見つけたEをキューの末尾に入れます。",
      D: "Dの行き先AとEは発見済みです。",
      E: "Eを調べ、キューが空になったところで探索完了です。"
    },
    dfs: {
      A: "Aに入り、最初の分岐はBへ進みます。",
      B: "Bからまだ訪ねていないDへ進みます。",
      D: "Dの隣接先はEとAです。未訪問のEへ進みます。",
      E: "Eは行き止まり。Aまで戻ると、Cが残っています。",
      C: "Cの行き先Eは訪問済みです。Aまで戻ると探索完了です。"
    }
  };

  function breadthFirst(graph, start, visit) {
    const queue = [start];
    const parent = new Map([[start, null]]);
    for (let head = 0; head < queue.length; head++) {
      const node = queue[head];
      for (const next of graph[node]) {
        if (parent.has(next)) continue;
        parent.set(next, node);
        queue.push(next);
      }
      visit(node, parent.get(node), queue, head + 1);
    }
    return parent;
  }

  function depthFirst(graph, start, visit) {
    const seen = new Set();
    const stack = [];
    function walk(node, parent) {
      seen.add(node);
      stack.push(node);
      visit(node, parent, stack);
      for (const next of graph[node]) {
        if (!seen.has(next)) walk(next, node);
      }
      stack.pop();
    }
    walk(start, null);
  }

  const positions = { A: [29, 75], B: [111, 29], C: [111, 120], D: [203, 29], E: [283, 75] };
  const edges = [
    ["A", "B", "M47 65 L91 40"], ["A", "C", "M47 85 L91 109"],
    ["B", "D", "M130 29 H181"], ["C", "E", "M129 115 L261 81"],
    ["D", "E", "M220 39 L263 63"], ["D", "A", "M189 44 Q135 91 51 76"]
  ];
  const figure = `<figure class="graph-traversal">
    <p class="diagram-title">同じ地図を、2通りでたどる</p>
    <p>AからEまで、通る矢印が最も少ない道を考えてみましょう。BFSとDFSを切り替えて「次へ」を押し、Eに着くまでの訪問順と、その時点で残っている候補を比べてください。</p>
    <div class="diagram-buttons graph-modes" role="group" aria-label="探索方法">
      <button type="button" data-mode="bfs" aria-pressed="true">BFS（幅優先）</button>
      <button type="button" data-mode="dfs" aria-pressed="false">DFS（深さ優先）</button>
    </div>
    <svg viewBox="0 0 312 148" role="img" aria-label="AからBとC、BからD、CとDからE、DからAに向かう有向グラフ">
      <defs>
        <marker id="traversal-arrow" viewBox="0 0 8 8" markerWidth="7" markerHeight="7" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z"/>
        </marker>
      </defs>
      <g class="graph-edges" marker-end="url(#traversal-arrow)">${edges
        .map(([from, to, path]) => `<path data-edge="${from}${to}" d="${path}"/>`).join("")}</g>
      ${Object.entries(positions).map(([node, [x, y]]) => `<g class="graph-node" data-node="${node}" transform="translate(${x} ${y})">
        <circle r="18"/><text>${node}</text>
      </g>`).join("")}
    </svg>
    <div class="diagram-buttons graph-steps" role="group" aria-label="探索のステップ">
      <button type="button" data-step="-1" aria-disabled="true">戻る</button>
      <button type="button" data-step="1">次へ</button>
      <span data-counter>0 / 5</span>
    </div>
    <div class="graph-readout" aria-live="polite" aria-atomic="true">
      <p data-detail></p>
      <dl>
        <div><dt data-memory-label></dt><dd data-memory></dd></div>
        <div><dt>訪問順</dt><dd data-order></dd></div>
      </dl>
    </div>
    <figcaption>丸は頂点、矢印は進める向きです。AではBを先に調べるので、DFSはA→B→D→Eと進みます。BFSでEを最初に発見する経路はA→C→Eです。</figcaption>
  </figure>`;

  function initialize(figure) {
    const frames = { bfs: [], dfs: [] };
    breadthFirst(graph, "A", (node, parent, queue, head) => {
      frames.bfs.push({ node, parent, memory: queue.slice(head) });
    });
    depthFirst(graph, "A", (node, parent, stack) => {
      frames.dfs.push({ node, parent, memory: [...stack] });
    });
    const nodes = [...figure.querySelectorAll("[data-node]")];
    const arrows = [...figure.querySelectorAll("[data-edge]")];
    const modes = [...figure.querySelectorAll("[data-mode]")];
    const steps = [...figure.querySelectorAll("[data-step]")];
    const readout = (name) => figure.querySelector(`[data-${name}]`);
    let mode = "bfs";
    let step = 0;

    function render() {
      const isBfs = mode === "bfs";
      const trace = frames[mode];
      const current = trace[step - 1];
      const visited = trace.slice(0, step).map(({ node }) => node);
      const initialMemory = isBfs ? ["A"] : [];
      const memory = current?.memory ?? initialMemory;
      modes.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
      steps[0].setAttribute("aria-disabled", String(step === 0));
      steps[1].setAttribute("aria-disabled", String(step === trace.length));
      readout("counter").textContent = `${step} / ${trace.length}`;
      readout("detail").textContent = current ? `訪問中 ${current.node}　${notes[mode][current.node]}`
        : isBfs ? "先に見つけた頂点から調べます。" : "行けるところまで枝をたどり、行き止まりで戻ります。";
      readout("memory-label").textContent = isBfs ? "キュー（先頭 → 末尾）" : "再帰スタック（底 → 頂上）";
      readout("memory").textContent = memory.join(" → ") || "空";
      readout("order").textContent = visited.join(" → ") || "未訪問";
      nodes.forEach((element) => {
        const name = element.dataset.node;
        element.classList.toggle("graph-current", name === current?.node);
        element.classList.toggle("graph-visited", visited.includes(name));
      });
      arrows.forEach((edge) => {
        edge.classList.toggle("graph-edge-current", edge.dataset.edge === `${current?.parent}${current?.node}`);
      });
    }

    modes.forEach((button) => button.addEventListener("click", () => {
      if (mode === button.dataset.mode) return;
      mode = button.dataset.mode;
      step = 0;
      render();
    }));
    steps.forEach((button) => button.addEventListener("click", () => {
      if (button.getAttribute("aria-disabled") === "true") return;
      step += Number(button.dataset.step);
      render();
    }));
    render();
  }

  const lab = `const graph = ${JSON.stringify(graph)};

${breadthFirst.toString().replace(/^ {2}/gm, "")}

${depthFirst.toString().replace(/^ {2}/gm, "")}

const bfsOrder = [];
const parent = breadthFirst(graph, "A", (node) => bfsOrder.push(node));
const dfsOrder = [];
depthFirst(graph, "A", (node) => dfsOrder.push(node));

console.log("BFS:", bfsOrder.join(" → "));
console.log("DFS:", dfsOrder.join(" → "));

if (parent.has("E")) {
  const path = [];
  for (let node = "E"; node !== null; node = parent.get(node)) {
    path.push(node);
  }
  console.log("辺が最少の経路:", path.reverse().join(" → "));
} else {
  console.log("Eには到達できません。");
}
`;

  return { figure, initialize, lab };
})();
