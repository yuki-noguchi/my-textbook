(() => {
  "use strict";
  const readStorage = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  };
  const writeStorage = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* file:// で保存が無効でも閲覧は続けます */ }
  };
  const readCompleted = () => {
    try { return JSON.parse(readStorage("utw-completed", "[]")); } catch { return []; }
  };
  const state = {
    completed: new Set(readCompleted()),
    theme: readStorage("utw-theme", "") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    currentId: ""
  };
  const el = (id) => document.getElementById(id);
  const chapterContent = el("chapter-content");
  const searchResults = el("search-results");
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    el("theme-button").textContent = state.theme === "dark" ? "☀" : "☾";
    el("theme-button").setAttribute("aria-label", state.theme === "dark" ? "ライトモードに切り替える" : "ダークモードに切り替える");
  }

  function renderNavigation() {
    const allParts = courseParts.map((part) => {
      const items = part.chapters?.length
        ? part.chapters.map((chapter, index) => `<a class="chapter-link ${chapter.id === state.currentId ? "active" : ""} ${state.completed.has(chapter.id) ? "complete" : ""}" href="#${chapter.id}"><span class="chapter-status">${state.completed.has(chapter.id) ? "✓" : ""}</span><span>${String(chapter.no || index + 1).padStart(2, "0")} ${chapter.shortTitle}</span></a>`).join("")
        : `<div class="part-placeholder">${part.topics}<br><em>今後追加予定</em></div>`;
      return `<section class="part-group"><h2 class="part-heading">${part.title}</h2>${items}</section>`;
    }).join("");
    el("course-navigation").innerHTML = allParts;
    updateProgress();
  }

  function updateProgress() {
    const done = chapters.filter((chapter) => state.completed.has(chapter.id)).length;
    const percent = chapters.length ? Math.round(done / chapters.length * 100) : 0;
    el("progress-percent").textContent = `${percent}%`;
    el("progress-fill").style.width = `${percent}%`;
    el("progress-detail").textContent = `${done} / ${chapters.length} 章 完了`;
  }

  // 章のHTMLは表示のたびに作り直されるため、問題のイベントも毎回初期化します。
  // 正解は fieldset の data-answer（または正解ラジオの data-correct）で指定できます。
  function initializeQuizzes() {
    chapterContent.querySelectorAll(".quiz-question").forEach((question, questionIndex) => {
      const checkButton = question.querySelector(".check-answer");
      const feedback = question.querySelector(".quiz-feedback");
      if (!checkButton || !feedback) return;

      feedback.setAttribute("aria-live", "polite");
      feedback.setAttribute("role", "status");
      if (!feedback.id) feedback.id = `quiz-feedback-${questionIndex + 1}`;
      checkButton.setAttribute("type", "button");
      checkButton.setAttribute("aria-controls", feedback.id);

      const answer = question.dataset.answer ?? question.dataset.correctAnswer ?? question.dataset.correct;
      const explanation = question.dataset.explanation || question.querySelector(".quiz-explanation")?.textContent.trim() || "";
      const radios = [...question.querySelectorAll('input[type="radio"]')];

      checkButton.addEventListener("click", () => {
        const selected = radios.find((radio) => radio.checked);
        if (!selected) {
          feedback.textContent = "選択肢を選んでから、答え合わせをしてください。";
          feedback.className = "quiz-feedback unanswered";
          return;
        }

        const selectedIsCorrect = selected.dataset.correct === "true" || selected.dataset.correct === "1" ||
          (answer != null && (selected.value === answer || selected.dataset.answer === answer ||
            String(radios.indexOf(selected) + 1) === String(answer)));
        const correctRadio = radios.find((radio) => radio.dataset.correct === "true" || radio.dataset.correct === "1");
        question.classList.toggle("is-correct", selectedIsCorrect);
        question.classList.toggle("is-incorrect", !selectedIsCorrect);
        radios.forEach((radio) => {
          const label = radio.closest("label");
          label?.classList.toggle("is-correct", radio === correctRadio);
          label?.classList.toggle("is-incorrect", radio === selected && !selectedIsCorrect);
        });
        feedback.className = `quiz-feedback ${selectedIsCorrect ? "correct" : "incorrect"}`;
        feedback.textContent = selectedIsCorrect
          ? `正解です。${explanation ? ` ${explanation}` : ""}`
          : `不正解です。${explanation ? ` ${explanation}` : " 正解の選択肢と本文を見比べてみましょう。"}`;
      });

      // 選び直したら、前の判定結果を消して再回答できるようにします。
      radios.forEach((radio) => radio.addEventListener("change", () => {
        feedback.textContent = "";
        feedback.className = "quiz-feedback";
        question.classList.remove("is-correct", "is-incorrect");
        radios.forEach((item) => item.closest("label")?.classList.remove("is-correct", "is-incorrect"));
      }));
    });
  }

  const diagramRoles = {
    input: "入力・要求",
    process: "処理",
    wait: "待機・未確定",
    store: "保存・確定",
    error: "失敗・競合"
  };
  const animatedDiagramTitles = new Set([
    "ソースコードから実行まで",
    "Processの状態遷移",
    "AからBへのContext Switch",
    "URLからResponseまで",
    "TLS handshakeの役割",
    "Javaコードの実行階段",
    "認証から認可まで",
    "System Callの往復",
    "3-way Handshake",
    "Mutexで在庫更新"
  ]);

  function directDiagramUnits(figure) {
    const selectors = [
      ".flow-diagram > .flow-node",
      ".visual-sequence > .visual-step",
      ".visual-memory > .visual-memory-cell",
      ".visual-grid > .visual-panel",
      ".concept-rows > .concept-row",
      ".time-comparison td[data-visual-role]",
      ".btree-figure .tree-node",
      ".memory-map > .memory-row",
      ".visual-compare > *"
    ];
    return [...figure.querySelectorAll(selectors.join(","))];
  }

  function sequenceForAnimation(figure) {
    const groups = [...figure.querySelectorAll(".flow-diagram, .visual-sequence, .timeline-figure .concept-rows")];
    return groups
      .map((group) => [...group.children].filter((child) => child.matches(".flow-node, .visual-step, .visual-panel, .visual-chip, .concept-row")))
      .find((steps) => steps.length >= 3) || [];
  }

  function initializeDiagramPlayer(figure, steps) {
    if (figure.getAttribute("role") === "img") figure.removeAttribute("role");
    let current = -1;
    let timer = null;
    const controls = document.createElement("div");
    controls.className = "diagram-controls";
    controls.innerHTML = `<div class="diagram-buttons" role="group" aria-label="図のステップ操作"><button type="button" data-action="reset">全体</button><button type="button" data-action="prev">戻る</button><button type="button" data-action="next">次へ</button><button type="button" data-action="play">再生</button></div><div class="diagram-readout"><p class="diagram-status" aria-live="polite"></p><p class="diagram-next"></p></div>`;
    const [resetButton, prevButton, nextButton, playButton] = controls.querySelectorAll("button");
    const title = figure.querySelector(".diagram-title, .visual-title");
    (figure.querySelector(".diagram-legend") || title).after(controls);
    const status = controls.querySelector(".diagram-status");
    const next = controls.querySelector(".diagram-next");
    const labels = steps.map((step, index) => {
      const label = step.querySelector(".flow-label, .concept-term, strong");
      const detail = step.querySelector("small, .concept-detail");
      const heading = label?.textContent.trim()
        || [...step.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())?.textContent.trim()
        || step.textContent.trim();
      const note = step.dataset.stepNote || detail?.textContent.trim();
      const number = document.createElement("span");
      number.className = "diagram-step-number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = String(index + 1);
      step.prepend(number);
      return { heading, note };
    });

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
      playButton.textContent = "再生";
      playButton.setAttribute("aria-pressed", "false");
    };
    const show = (index) => {
      current = index;
      figure.classList.toggle("is-stepping", current >= 0);
      steps.forEach((step, stepIndex) => {
        step.classList.toggle("is-current", stepIndex === index);
        if (stepIndex === index) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
      });
      resetButton.setAttribute("aria-disabled", String(index < 0));
      prevButton.setAttribute("aria-disabled", String(index < 0));
      nextButton.setAttribute("aria-disabled", String(index === steps.length - 1));
      if (index < 0) {
        status.textContent = `全体を見る（${steps.length}ステップ）`;
      } else {
        const { heading, note } = labels[index];
        status.textContent = `${index + 1} / ${steps.length}　${heading}${note ? ` · ${note}` : ""}`;
      }
      next.textContent = labels[index + 1] ? `次は ${labels[index + 1].heading}` : "最後のステップです。";
    };
    controls.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      const action = button?.dataset.action;
      if (!action || button.getAttribute("aria-disabled") === "true") return;
      if (action === "reset") { stop(); show(-1); }
      if (action === "prev") { stop(); show(current - 1); }
      if (action === "next") { stop(); show(current < 0 ? 0 : Math.min(steps.length - 1, current + 1)); }
      if (action === "play") {
        if (timer) { stop(); return; }
        show(current < 0 || current >= steps.length - 1 ? 0 : current + 1);
        playButton.textContent = "一時停止";
        playButton.setAttribute("aria-pressed", "true");
        timer = setInterval(() => {
          if (!figure.isConnected || current >= steps.length - 1) { stop(); return; }
          show(current + 1);
        }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 1800 : 1100);
      }
    });
    show(-1);
  }

  function initializeDiagrams() {
    chapterContent.querySelectorAll(".diagram, .concept-figure").forEach((figure) => {
      const units = directDiagramUnits(figure);
      units.forEach((unit) => unit.classList.add("diagram-unit"));
      if (units.length) {
        figure.classList.add("diagram-colorized");
        const roles = new Set(units.map((unit) => unit.dataset.visualRole));
        const labels = Object.entries(diagramRoles).filter(([role]) => roles.has(role));
        const title = figure.querySelector(".diagram-title, .visual-title");
        if (labels.length > 1) title?.insertAdjacentHTML("afterend", `<div class="diagram-legend" aria-label="図で使う色の意味">${labels
          .map(([role, label]) => `<span data-visual-role="${role}">${label}</span>`).join("")}</div>`);
      }
      const steps = sequenceForAnimation(figure);
      // アニメーションは、順序を一段ずつ見る価値がある図だけに教材側で明示します。
      // タイトルの単語から自動判定すると、比較図や構造図まで動いて学習の邪魔になるためです。
      const title = figure.querySelector(".diagram-title, .visual-title")?.textContent.trim() || "";
      const shouldAnimate = (figure.dataset.animate ?? String(animatedDiagramTitles.has(title))) === "true";
      if (shouldAnimate && steps.length >= 3) initializeDiagramPlayer(figure, steps);
    });
  }

  function renderChapter(chapter) {
    state.currentId = chapter.id;
    document.title = `${chapter.title} — UNDER THE WEB`;
    searchResults.hidden = true;
    chapterContent.hidden = false;
    chapterContent.innerHTML = chapter.html;
    const sectionElements = chapterContent.querySelectorAll(".chapter-section");
    const chapterFigures = globalThis.chapterVisuals?.[chapter.id] || [];
    chapterFigures.forEach(({ afterSection, html }) => {
      const targetSection = sectionElements[Number(afterSection) - 1];
      if (targetSection && html) targetSection.insertAdjacentHTML("beforeend", html);
    });
    initializeQuizzes();
    initializeDiagrams();
    const traversal = chapterContent.querySelector(".graph-traversal");
    if (traversal) graphTraversal.initialize(traversal);
    const button = chapterContent.querySelector(".complete-button");
    if (button) {
      function showCompletion() {
        const done = state.completed.has(chapter.id);
        button.classList.toggle("done", done);
        button.textContent = done ? "✓ 学習済み" : "この章を学習済みにする";
        button.setAttribute("aria-pressed", String(done));
      }
      showCompletion();
      button.addEventListener("click", () => {
        state.completed.has(chapter.id) ? state.completed.delete(chapter.id) : state.completed.add(chapter.id);
        writeStorage("utw-completed", JSON.stringify([...state.completed]));
        showCompletion();
        renderNavigation();
      });
    }
    chapterContent.querySelectorAll(".copy-code").forEach((copyButton) => copyButton.addEventListener("click", async () => {
      const code = copyButton.closest(".code-block").querySelector("code").textContent;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      copyButton.textContent = "コピーしました";
      setTimeout(() => { copyButton.textContent = "コピー"; }, 1400);
    }));
    const index = chapters.indexOf(chapter);
    setPagination(el("prev-chapter"), chapters[index - 1]);
    setPagination(el("next-chapter"), chapters[index + 1]);
    renderNavigation();
    closeSidebar();
    window.scrollTo(0, 0);
  }

  function setPagination(button, chapter) {
    button.disabled = !chapter;
    button.querySelector("strong").textContent = chapter?.shortTitle || "";
    button.onclick = chapter ? () => { location.hash = chapter.id; } : null;
  }

  function currentChapter() {
    const id = location.hash.slice(1);
    return chapters.find((chapter) => chapter.id === id) || chapters[0];
  }

  function handleRoute() {
    const chapter = currentChapter();
    if (chapter) renderChapter(chapter);
  }

  function performSearch(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) { handleRoute(); return; }
    const searchableText = (chapter) => `${chapter.title} ${chapter.searchText || ""} ${chapter.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")}`;
    const found = chapters.filter((chapter) => searchableText(chapter).toLowerCase().includes(normalized));
    chapterContent.hidden = true;
    searchResults.hidden = false;
    const items = found.map((chapter) => {
      const raw = searchableText(chapter);
      const pos = raw.toLowerCase().indexOf(normalized);
      const excerpt = raw.slice(Math.max(0, pos - 45), Math.max(100, pos + normalized.length + 75));
      return `<a class="result-item" href="#${chapter.id}"><h2>${escapeHtml(chapter.title)}</h2><p>${escapeHtml(excerpt)}…</p></a>`;
    }).join("");
    searchResults.innerHTML = `<h1>「${escapeHtml(query)}」の検索結果</h1><p>${found.length}章で見つかりました。</p>${items || "<p>該当する章はありません。別の言葉で検索してください。</p>"}`;
  }

  function openSidebar() {
    el("sidebar").classList.add("open");
    el("sidebar-backdrop").hidden = false;
    el("menu-button").setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    el("sidebar").classList.remove("open");
    el("sidebar-backdrop").hidden = true;
    el("menu-button").setAttribute("aria-expanded", "false");
  }

  el("theme-button").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    writeStorage("utw-theme", state.theme);
    applyTheme();
  });
  el("menu-button").addEventListener("click", () => el("sidebar").classList.contains("open") ? closeSidebar() : openSidebar());
  el("sidebar-backdrop").addEventListener("click", closeSidebar);
  el("site-search").addEventListener("input", (event) => performSearch(event.target.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== el("site-search")) { event.preventDefault(); el("site-search").focus(); }
    if (event.key === "Escape") { closeSidebar(); el("site-search").blur(); }
  });
  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    el("reading-progress-bar").style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  }, { passive: true });
  applyTheme();
  renderNavigation();
  handleRoute();
})();
