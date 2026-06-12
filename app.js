const storageKey = "careerboard-state-v2";

const taskTypes = [
  { id: "briefing", label: "説明会", color: "#cfe0ff" },
  { id: "es", label: "ES締切", color: "#f6d9a8" },
  { id: "webtest", label: "WEBテスト", color: "#c9ead4" },
  { id: "testcenter", label: "テストセンター", color: "#e7d3a1" },
  { id: "interview", label: "面接", color: "#d7e0b8" },
  { id: "final", label: "最終面接", color: "#f3c0a9" },
  { id: "gd", label: "グループディスカッション", color: "#c9d7e8" }
];

const selectionStatuses = [
  { id: "", label: "未定" },
  { id: "briefing", label: "説明会" },
  { id: "esSubmitted", label: "ES" },
  { id: "webtest", label: "Web" },
  { id: "testcenter", label: "TC" },
  { id: "gd", label: "GD" },
  { id: "interview", label: "面接" },
  { id: "final", label: "最終" }
];

const taskStatusMap = {
  briefing: "briefing",
  es: "esSubmitted",
  webtest: "webtest",
  testcenter: "testcenter",
  gd: "gd",
  interview: "interview",
  final: "final"
};

const industries = [
  "IT / Web",
  "メーカー",
  "商社",
  "金融",
  "コンサル",
  "広告 / メディア",
  "人材",
  "不動産 / 建設",
  "インフラ / 交通",
  "小売 / 流通",
  "食品 / 消費財",
  "医療 / 福祉",
  "教育",
  "エンタメ",
  "官公庁 / 団体",
  "その他"
];

const demoState = {
  activeView: "tasks",
  search: "",
  taskSearch: "",
  companySort: "priority",
  calendarView: "month",
  calendarMonth: localMonthValue(new Date()),
  calendarWeekStart: offsetDate(0),
  companies: [
    {
      id: "c1",
      name: "株式会社ブルーリンク",
      mypageUrl: "https://example.com/mypage",
      personalId: "BL-2026-1042",
      industry: "IT / SaaS",
      priority: "5",
      internStart: offsetDate(6),
      internEnd: offsetDate(10),
      internResult: "pass",
      mainResult: "none",
      selectionStatus: "interview",
      memo: "プロダクト志向が強い。一次面接では学生時代に工夫した経験を深掘りされそう。"
    },
    {
      id: "c2",
      name: "東都メディア",
      mypageUrl: "https://example.com/mypage",
      personalId: "TM-58391",
      industry: "広告 / メディア",
      priority: "3",
      internStart: offsetDate(8),
      internEnd: offsetDate(12),
      internResult: "none",
      mainResult: "none",
      selectionStatus: "esSubmitted",
      memo: "説明会で事業領域を確認。志望理由はまだ弱い。"
    },
    {
      id: "c3",
      name: "ミナト製作所",
      mypageUrl: "https://example.com/mypage",
      personalId: "MN-ENTRY-77",
      industry: "メーカー",
      priority: "4",
      internStart: "",
      internEnd: "",
      internResult: "fail",
      mainResult: "none",
      selectionStatus: "webtest",
      memo: "勤務地と職種別採用の違いを確認する。"
    }
  ],
  tasks: [
    { id: "t1", companyId: "c1", type: "interview", date: offsetDate(2), time: "10:00", memo: "Zoom。逆質問を3つ用意", done: false },
    { id: "t2", companyId: "c2", type: "es", date: offsetDate(1), time: "23:59", memo: "学生時代に力を入れたこと 400字", done: false },
    { id: "t3", companyId: "c3", type: "webtest", date: offsetDate(4), time: "", memo: "SPI。性格検査も忘れない", done: false },
    { id: "t4", companyId: "c1", type: "briefing", date: offsetDate(10), time: "18:00", memo: "社員座談会", done: false }
  ],
  notes: [
    { id: "n1", companyId: "c1", type: "research", body: "主力事業は中小企業向けSaaS。プロダクト改善の文化が強い。", createdAt: offsetDate(-1) },
    { id: "n2", companyId: "c1", type: "interview", body: "一次面接では、課題に対して自分で仮説を立てた経験を話す。", createdAt: offsetDate(0) },
    { id: "n3", companyId: "c2", type: "es", body: "広告に興味を持った原体験と、生活者理解への関心を軸にする。", createdAt: offsetDate(0) }
  ]
};

let state = loadState();

const viewTitle = document.querySelector("#viewTitle");
const topActions = document.querySelector(".top-actions");
const companyGrid = document.querySelector("#companyGrid");
const companySearch = document.querySelector("#companySearch");
const companySort = document.querySelector("#companySort");
const companyForm = document.querySelector("#companyForm");
const selectionFields = document.querySelector("#selectionFields");
const toggleSelectionFields = document.querySelector("#toggleSelectionFields");
const industrySelect = document.querySelector("#industrySelect");
const taskForm = document.querySelector("#taskForm");
const taskSearch = document.querySelector("#taskSearch");
const taskCompanySelect = document.querySelector("#taskCompanySelect");
const taskTypeSelect = document.querySelector("#taskTypeSelect");
const noteForm = document.querySelector("#noteForm");
const noteCompanySelect = document.querySelector("#noteCompanySelect");
const noteCount = document.querySelector("#noteCount");
const noteList = document.querySelector("#noteList");
const noteSearch = document.querySelector("#noteSearch");
const noteFilterCompany = document.querySelector("#noteFilterCompany");
const noteFilterType = document.querySelector("#noteFilterType");
const noteFormTitle = document.querySelector("#noteFormTitle");
const weekTaskCount = document.querySelector("#weekTaskCount");
const weekTaskList = document.querySelector("#weekTaskList");
const openWeekTasks = document.querySelector("#openWeekTasks");
const weekModal = document.querySelector("#weekModal");
const weekModalList = document.querySelector("#weekModalList");
const settingsModal = document.querySelector("#settingsModal");
const exportCode = document.querySelector("#exportCode");
const importCode = document.querySelector("#importCode");
const importCodeFile = document.querySelector("#importCodeFile");
const calendarTitle = document.querySelector("#calendarTitle");
const calendarGrid = document.querySelector("#calendarGrid");
const calendarViewButtons = document.querySelectorAll("[data-calendar-view]");
const companyModal = document.querySelector("#companyModal");
const toast = document.querySelector("#toast");
const dayModal = document.querySelector("#dayModal");
const dayModalTitle = document.querySelector("#dayModalTitle");
const dayTaskList = document.querySelector("#dayTaskList");
const useDayForTask = document.querySelector("#useDayForTask");
const taskModal = document.querySelector("#taskModal");
const openTaskForm = document.querySelector("#openTaskForm");
const noteModal = document.querySelector("#noteModal");
const openNoteForm = document.querySelector("#openNoteForm");
const confirmModal = document.querySelector("#confirmModal");
const confirmModalTitle = document.querySelector("#confirmModalTitle");
const confirmTaskText = document.querySelector("#confirmTaskText");
const confirmCompleteTask = document.querySelector("#confirmCompleteTask");
let selectedCalendarDate = offsetDate(0);
let pendingCompleteTaskId = "";
let pendingDeleteNoteId = "";

function offsetDate(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return localDateValue(date);
}

function localDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localMonthValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return migrateState(structuredClone(demoState));
  try {
    return migrateState({ ...structuredClone(demoState), ...JSON.parse(saved) });
  } catch {
    return migrateState(structuredClone(demoState));
  }
}

function migrateState(nextState) {
  nextState.companySort ||= "priority";
  nextState.taskSearch ||= "";
  nextState.calendarView ||= "month";
  if (!["month", "week"].includes(nextState.calendarView)) nextState.calendarView = "month";
  nextState.calendarWeekStart ||= offsetDate(0);
  if (!nextState.tasksFirstReady) {
    nextState.activeView = "tasks";
    nextState.tasksFirstReady = true;
  }
  nextState.notes ||= [];
  nextState.companies = (nextState.companies || []).map((company) => ({
    personalId: "",
    internStart: "",
    internEnd: "",
    internResult: "none",
    mainResult: "none",
    selectionStatus: "",
    ...company
  }));
  nextState.tasks = (nextState.tasks || []).map((task) => ({
    ...task,
    type: ["first", "second", "third"].includes(task.type) ? "interview" : task.type
  }));
  return nextState;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function companyById(id) {
  return state.companies.find((company) => company.id === id);
}

function taskTypeById(id) {
  return taskTypes.find((type) => type.id === id) || taskTypes[0];
}

function priorityLabel(priority) {
  return `${priority} / 5`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short"
  }).format(new Date(`${value}T00:00:00`));
}

function daysUntil(value) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${value}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

function dateDistance(value) {
  const days = daysUntil(value);
  if (days === 0) return "今日";
  if (days === 1) return "明日";
  if (days > 1) return `${days}日後`;
  return `${Math.abs(days)}日前`;
}

function filteredCompanies() {
  const query = state.search.trim().toLowerCase();
  return state.companies
    .filter((company) => {
      if (!query) return true;
      return [company.name, company.industry, company.memo].join(" ").toLowerCase().includes(query);
    })
    .sort(sortCompanies);
}

function sortCompanies(a, b) {
  if (state.companySort === "industry") {
    return normalizeIndustry(a.industry).localeCompare(normalizeIndustry(b.industry), "ja")
      || Number(b.priority) - Number(a.priority)
      || a.name.localeCompare(b.name, "ja");
  }
  return Number(b.priority) - Number(a.priority)
    || normalizeIndustry(a.industry).localeCompare(normalizeIndustry(b.industry), "ja")
    || a.name.localeCompare(b.name, "ja");
}

function weekTasks() {
  return state.tasks
    .filter((task) => !task.done)
    .filter(matchesTaskSearch)
    .filter((task) => {
      const days = daysUntil(task.date);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || "99:99").localeCompare(b.time || "99:99"));
}

function matchesTaskSearch(task) {
  const query = state.taskSearch.trim().toLowerCase();
  if (!query) return true;
  const company = companyById(task.companyId);
  const type = taskTypeById(task.type);
  return [company?.name, company?.industry, type.label, task.memo, task.date, task.time]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function render() {
  renderIndustryOptions();
  renderCompanySelects();
  renderNoteCompanySelect();
  renderCompanies();
  renderWeekTasks();
  renderCalendar();
  renderNotes();
}

function renderIndustryOptions() {
  industrySelect.innerHTML = industries
    .map((industry) => `<option value="${industry}">${industry}</option>`)
    .join("");
}

function renderCompanySelects() {
  taskCompanySelect.innerHTML = `<option value="" disabled selected>企業</option>` + state.companies
    .sort((a, b) => Number(b.priority) - Number(a.priority))
    .map((company) => `<option value="${company.id}">${escapeHtml(company.name)}</option>`)
    .join("");
  taskTypeSelect.innerHTML = `<option value="" disabled selected>種類</option>` + taskTypes
    .map((type) => `<option value="${type.id}">${type.label}</option>`)
    .join("");
  taskCompanySelect.value = "";
  taskTypeSelect.value = "";
}

function renderNoteCompanySelect() {
  const options = state.companies
    .sort((a, b) => Number(b.priority) - Number(a.priority))
    .map((company) => `<option value="${company.id}">${escapeHtml(company.name)}</option>`)
    .join("");
  noteCompanySelect.innerHTML = `<option value="" disabled selected>企業</option>` + options;
  noteFilterCompany.innerHTML = `<option value="all">すべて</option>` + options;
  noteCompanySelect.value = "";
}

function renderCompanies() {
  const companies = filteredCompanies();
  companyGrid.innerHTML = companies.length ? companies.map((company) => `
    <article class="company-card" id="company-${company.id}">
      <header>
        <div>
          <div class="company-title-row">
            <h3>${escapeHtml(company.name)}</h3>
            ${selectionStatusBadge(company)}
          </div>
          <span class="meta">${escapeHtml(company.industry || "業界未設定")}</span>
        </div>
        <span class="priority-pill" data-priority="${company.priority}">志望度 ${priorityLabel(company.priority)}</span>
      </header>
      <div class="result-row">
        ${resultPill("intern", company.internResult)}
        ${resultPill("main", company.mainResult)}
      </div>
      ${selectionStatusControl(company)}
      ${internPeriodText(company)}
      ${collapsibleText(company.memo || "メモなし", "企業メモ")}
      <div class="card-actions">
        ${company.mypageUrl ? linkButton(company.mypageUrl, "URL", "external") : actionButton("URL", "link", `data-edit-company="${company.id}"`)}
        ${company.personalId ? actionButton("ID", "id", `data-copy-personal-id="${company.id}"`) : actionButton("ID", "id", `data-edit-company="${company.id}"`)}
        ${actionButton("編集", "edit", `data-edit-company="${company.id}"`)}
        ${actionButton("予定", "calendar", `data-create-task="${company.id}"`)}
        ${actionButton("メモ", "note", `data-note-company="${company.id}"`)}
      </div>
      ${latestNotePreview(company.id)}
    </article>
  `).join("") : emptyState("企業がまだありません。");
}

function selectionStatusControl(company) {
  const inferred = inferCompanyStatus(company.id);
  const current = company.selectionStatus || inferred;
  const index = selectionStatusIndex(current);
  const prev = selectionStatuses[Math.max(0, index - 1)];
  const next = selectionStatuses[Math.min(selectionStatuses.length - 1, index + 1)];
  return `
    <div class="selection-status-block">
      <div class="mini-label">
        <span>現在地</span>
        ${!company.selectionStatus && inferred ? `<small>予定から</small>` : ""}
      </div>
      <div class="status-stepper" aria-label="${escapeAttribute(company.name)}の選考状況">
        <button class="status-move" type="button" data-status-company="${company.id}" data-shift-status="-1" ${index === 0 ? "disabled" : ""} aria-label="前の状況へ">‹ ${prev.label}</button>
        <button class="status-move" type="button" data-status-company="${company.id}" data-shift-status="1" ${index === selectionStatuses.length - 1 ? "disabled" : ""} aria-label="次の状況へ">${next.label} ›</button>
      </div>
    </div>
  `;
}

function selectionStatusBadge(company) {
  const current = company.selectionStatus || inferCompanyStatus(company.id);
  return `<span class="current-status-badge">${selectionStatusLabel(current)}</span>`;
}

function selectionStatusLabel(id) {
  return selectionStatuses.find((status) => status.id === id)?.label || "未定";
}

function selectionStatusIndex(id) {
  return Math.max(0, selectionStatuses.findIndex((status) => status.id === id));
}

function inferCompanyStatus(companyId) {
  const order = ["briefing", "esSubmitted", "webtest", "testcenter", "gd", "interview", "final"];
  return state.tasks
    .filter((task) => task.companyId === companyId)
    .map((task) => taskStatusMap[task.type] || "")
    .filter(Boolean)
    .sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] || "";
}

function resultPill(kind, value = "none") {
  const labels = {
    intern: { none: "IS -", pass: "IS 合格", fail: "IS 不合格" },
    main: { none: "本選考 -", pass: "本選考 合格", fail: "本選考 不合格" }
  };
  const className = value === "pass" ? "is-pass" : value === "fail" ? "is-fail" : "";
  return `<span class="result-pill ${className}">${labels[kind][value || "none"]}</span>`;
}

function internPeriodText(company) {
  if (!hasInternPeriod(company)) return "";
  return `<span class="intern-period">インターン期間 ${formatDate(company.internStart)} - ${formatDate(company.internEnd)}</span>`;
}

function latestNotePreview(companyId) {
  const note = state.notes
    .filter((item) => item.companyId === companyId)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))[0];
  if (!note) return "";
  return `<p class="note-preview">${noteTypeLabel(note.type)}: ${escapeHtml(note.body.slice(0, 58))}${note.body.length > 58 ? "..." : ""}</p>`;
}

function renderNotes(filterCompanyId = "") {
  const selectedCompany = filterCompanyId || (noteFilterCompany?.value === "all" ? "" : noteFilterCompany?.value || "");
  const selectedType = noteFilterType?.value === "all" ? "" : noteFilterType?.value || "";
  const query = (noteSearch?.value || "").trim().toLowerCase();
  const notes = state.notes
    .map((note) => ({ ...note, company: companyById(note.companyId) }))
    .filter((note) => note.company)
    .filter((note) => !selectedCompany || note.companyId === selectedCompany)
    .filter((note) => !selectedType || note.type === selectedType)
    .filter((note) => {
      if (!query) return true;
      return [note.company.name, noteTypeLabel(note.type), note.body].join(" ").toLowerCase().includes(query);
    })
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  noteCount.textContent = `${notes.length}件`;
  if (!notes.length) {
    noteList.innerHTML = emptyState("条件に合うメモがありません。");
    return;
  }

  const grouped = notes.reduce((groups, note) => {
    const key = `${note.company.name} / ${noteTypeLabel(note.type)}`;
    groups[key] ||= [];
    groups[key].push(note);
    return groups;
  }, {});

  noteList.innerHTML = Object.entries(grouped).map(([title, groupNotes]) => `
    <section class="note-group">
      <h4 class="note-group-title">${escapeHtml(title)}</h4>
      ${groupNotes.map((note) => `
    <article class="note-card">
      <header>
        <div>
          <span class="note-type-pill ${note.type === "es" ? "is-es" : note.type === "interview" ? "is-interview" : ""}">${noteTypeLabel(note.type)}</span>
          <h4>${escapeHtml(note.company.name)}</h4>
        </div>
        <span class="date-pill">${escapeHtml(note.createdAt || "")}</span>
      </header>
      ${collapsibleText(note.body, "メモ")}
      <div class="note-card-actions">
        <button class="small-button" type="button" data-edit-note="${note.id}">編集</button>
        <button class="small-button" type="button" data-delete-note="${note.id}">削除</button>
      </div>
    </article>
      `).join("")}
    </section>
  `).join("");
}

function noteTypeLabel(type) {
  return { research: "企業研究", es: "ES", interview: "面接" }[type] || "メモ";
}

function collapsibleText(text, label = "メモ") {
  const raw = String(text || "");
  const shouldCollapse = raw.length > 90 || raw.includes("\n");
  return `
    <div class="collapsible-memo ${shouldCollapse ? "is-collapsed" : ""}">
      <p>${escapeHtml(raw)}</p>
      ${shouldCollapse ? `<button class="text-button memo-toggle" type="button" data-toggle-memo>表示</button>` : ""}
    </div>
  `;
}

function renderWeekTasks() {
  const tasks = weekTasks();
  weekTaskCount.textContent = `${tasks.length}件`;
  weekTaskList.innerHTML = tasks.length ? tasks.slice(0, 4).map((task) => compactTaskItem(task)).join("") : emptyState("なし");
  openWeekTasks.hidden = tasks.length === 0;
}

function compactTaskItem(task) {
  const company = companyById(task.companyId);
  const type = taskTypeById(task.type);
  return `
    <article class="compact-task" style="--task-color:${type.color}">
      <button class="task-check compact-check" type="button" data-complete-task="${task.id}" aria-label="完了にする"></button>
      <span class="compact-task-date">${formatDate(task.date)}${task.time ? ` ${escapeHtml(task.time)}` : ""}</span>
      <button class="compact-company" type="button" data-open-company="${task.companyId}">${escapeHtml(company?.name || "企業未設定")}</button>
      <span class="compact-type">${type.label}</span>
    </article>
  `;
}

function taskRow(task) {
  const company = companyById(task.companyId);
  const type = taskTypeById(task.type);
  return `
    <article class="task-row" style="--task-color:${type.color}">
      <button class="task-check" type="button" data-complete-task="${task.id}" aria-label="完了にする"></button>
      <div>
        <header>
          <div>
            <span class="task-type-pill">${type.label}</span>
            ${companyNameButton(company)}
          </div>
          <span class="date-pill">${formatDate(task.date)}${task.time ? ` ${escapeHtml(task.time)}` : ""} / ${dateDistance(task.date)}</span>
        </header>
        <p>${escapeHtml(task.memo || "メモなし")}</p>
      </div>
    </article>
  `;
}

function renderCalendar() {
  const isWeekView = state.calendarView === "week";
  const [year, month] = state.calendarMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const start = isWeekView ? new Date(`${state.calendarWeekStart}T00:00:00`) : new Date(firstDay);
  if (!isWeekView) start.setDate(firstDay.getDate() - firstDay.getDay());
  const dayCount = isWeekView ? 7 : 42;
  const end = new Date(start);
  end.setDate(start.getDate() + dayCount - 1);
  calendarTitle.textContent = isWeekView ? `${formatDate(localDateValue(start))} - ${formatDate(localDateValue(end))}` : `${year}年 ${month}月`;
  calendarGrid.classList.toggle("is-week-view", isWeekView);
  calendarViewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.calendarView === state.calendarView);
  });

  const cells = [];
  for (let i = 0; i < dayCount; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const value = localDateValue(date);
    const tasks = state.tasks.filter((task) => !task.done && task.date === value && matchesTaskSearch(task));
    const interns = state.companies.filter((company) => isInternDay(company, value) && matchesInternSearch(company));
    const isCurrentMonth = isWeekView || date.getMonth() === month - 1;
    const isToday = value === offsetDate(0);
    cells.push(`
      <button class="calendar-day ${isCurrentMonth ? "" : "is-muted"} ${isToday ? "is-today" : ""}" type="button" data-pick-date="${value}">
        <strong>${date.getDate()}</strong>
        ${interns.slice(0, 2).map((company) => internCalendarChip(company)).join("")}
        ${interns.length > 2 ? `<span class="calendar-intern" style="--intern-color:#eef1f4;--intern-text:#526170">+${interns.length - 2}件</span>` : ""}
        ${tasks.slice(0, 3).map((task) => {
          const type = taskTypeById(task.type);
          return `<span class="calendar-task" style="--task-color:${type.color}">${task.time ? `${escapeHtml(task.time)} ` : ""}${type.label}</span>`;
        }).join("")}
      </button>
    `);
  }
  calendarGrid.innerHTML = cells.join("");
}

function internCalendarChip(company) {
  const tone = internTone(company);
  return `<span class="calendar-intern ${tone}" style="${internStyle(company)}">インターン ${escapeHtml(company.name)}</span>`;
}

function matchesInternSearch(company) {
  const query = state.taskSearch.trim().toLowerCase();
  if (!query) return true;
  return [company.name, company.industry, company.memo, "インターン", "is"]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function openDayModal(date) {
  selectedCalendarDate = date;
  dayModalTitle.textContent = formatDate(date);
  const tasks = state.tasks
    .filter((task) => !task.done && task.date === date && matchesTaskSearch(task))
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99") || taskTypeById(a.type).label.localeCompare(taskTypeById(b.type).label, "ja"));
  const interns = state.companies
    .filter((company) => isInternDay(company, date) && matchesInternSearch(company))
    .sort((a, b) => internToneOrder(a) - internToneOrder(b) || a.name.localeCompare(b.name, "ja"));

  const taskItems = tasks.map((task) => {
    const company = companyById(task.companyId);
    const type = taskTypeById(task.type);
    return `
      <article class="day-task-item" style="--task-color:${type.color}">
        <button class="task-check" type="button" data-complete-task="${task.id}" aria-label="完了にする"></button>
        <div>
          <span class="task-type-pill">${type.label}</span>
          ${companyNameButton(company, "h3")}
          <span class="date-pill">${task.time ? `${escapeHtml(task.time)} 締切` : "時間未設定"}</span>
          <p>${escapeHtml(task.memo || "メモなし")}</p>
        </div>
      </article>
    `;
  }).join("");
  const internItems = interns.map((company) => `
    <article class="day-intern-item" style="${internStyle(company)}">
      <span class="task-type-pill" style="--task-color: var(--intern-color)">インターン期間</span>
      ${companyNameButton(company, "h3")}
      <p>${formatDate(company.internStart)} - ${formatDate(company.internEnd)} / ${internResultLabel(company.internResult)}</p>
    </article>
  `).join("");

  dayTaskList.innerHTML = taskItems + internItems || emptyState("なし");

  dayModal.classList.add("is-open");
  dayModal.setAttribute("aria-hidden", "false");
}

function closeDayModal() {
  dayModal.classList.remove("is-open");
  dayModal.setAttribute("aria-hidden", "true");
}

function openWeekModal() {
  const tasks = weekTasks();
  weekModalList.innerHTML = tasks.length ? tasks.map((task) => taskRow(task)).join("") : emptyState("なし");
  weekModal.classList.add("is-open");
  weekModal.setAttribute("aria-hidden", "false");
}

function closeWeekModal() {
  weekModal.classList.remove("is-open");
  weekModal.setAttribute("aria-hidden", "true");
}

function companyNameButton(company, tag = "h4") {
  if (!company) return `<${tag}>企業未設定</${tag}>`;
  return `<${tag}><button class="company-jump" type="button" data-open-company="${company.id}">${escapeHtml(company.name)}</button></${tag}>`;
}

function openTaskModal({ companyId = "", date = offsetDate(1) } = {}) {
  resetTaskForm(date);
  taskForm.elements.companyId.value = companyId;
  taskModal.classList.add("is-open");
  taskModal.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    (companyId ? taskForm.elements.type : taskForm.elements.companyId).focus();
  }, 0);
}

function closeTaskModal() {
  taskModal.classList.remove("is-open");
  taskModal.setAttribute("aria-hidden", "true");
}

function openNoteModal({ companyId = "", noteId = "" } = {}) {
  if (noteId) {
    const note = state.notes.find((item) => item.id === noteId);
    if (!note) return;
    noteForm.elements.id.value = note.id;
    noteForm.elements.companyId.value = note.companyId;
    noteForm.elements.type.value = note.type;
    noteForm.elements.body.value = note.body;
    noteFormTitle.textContent = "編集";
  } else {
    resetNoteForm();
    noteForm.elements.companyId.value = companyId;
  }
  noteModal.classList.add("is-open");
  noteModal.setAttribute("aria-hidden", "false");
  window.setTimeout(() => {
    (companyId || noteId ? noteForm.elements.type : noteForm.elements.companyId).focus();
  }, 0);
}

function closeNoteModal() {
  noteModal.classList.remove("is-open");
  noteModal.setAttribute("aria-hidden", "true");
}

function openConfirmModal(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  const company = task ? companyById(task.companyId) : null;
  const type = task ? taskTypeById(task.type) : null;
  pendingCompleteTaskId = taskId;
  pendingDeleteNoteId = "";
  confirmModalTitle.textContent = "完了？";
  confirmTaskText.textContent = task
    ? `${company?.name || "企業未設定"} / ${type?.label || "予定"}`
    : "この予定";
  confirmCompleteTask.textContent = "完了";
  confirmModal.classList.add("is-open");
  confirmModal.setAttribute("aria-hidden", "false");
}

function openDeleteNoteConfirm(noteId) {
  const note = state.notes.find((item) => item.id === noteId);
  const company = note ? companyById(note.companyId) : null;
  pendingDeleteNoteId = noteId;
  pendingCompleteTaskId = "";
  confirmModalTitle.textContent = "削除？";
  confirmTaskText.textContent = note
    ? `${company?.name || "企業未設定"} / ${noteTypeLabel(note.type)}`
    : "このメモ";
  confirmCompleteTask.textContent = "削除";
  confirmModal.classList.add("is-open");
  confirmModal.setAttribute("aria-hidden", "false");
}

function closeConfirmModal() {
  pendingCompleteTaskId = "";
  pendingDeleteNoteId = "";
  confirmModal.classList.remove("is-open");
  confirmModal.setAttribute("aria-hidden", "true");
}

function completePendingTask() {
  if (pendingDeleteNoteId) {
    const deletedNoteId = pendingDeleteNoteId;
    state.notes = state.notes.filter((note) => note.id !== pendingDeleteNoteId);
    if (noteForm.elements.id.value === deletedNoteId) {
      resetNoteForm();
    }
    saveState();
    render();
    closeConfirmModal();
    showToast("メモを削除しました");
    return;
  }

  const task = state.tasks.find((item) => item.id === pendingCompleteTaskId);
  if (!task) {
    closeConfirmModal();
    return;
  }
  task.done = true;
  saveState();
  render();
  closeConfirmModal();
  if (dayModal.classList.contains("is-open")) openDayModal(selectedCalendarDate);
  showToast("タスクを完了しました");
}

function iconSvg(name) {
  const paths = {
    external: "M14 5h5v5h-2V8.4l-6.3 6.3-1.4-1.4L15.6 7H14V5ZM5 7h6v2H7v8h8v-4h2v6H5V7Z",
    link: "M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a3 3 0 1 1 4.2 4.2l-2 2-1.4-1.4 2-2a1 1 0 1 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0ZM8.5 15.5a1 1 0 0 0 1.4 0l3.5-3.5a1 1 0 0 0-1.4-1.4l-3.5 3.5a1 1 0 1 1-1.4-1.4l2-2-1.4-1.4-2 2a3 3 0 1 0 4.2 4.2Z",
    id: "M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2h4v2H8V9Zm0 4h8v2H8v-2Z",
    edit: "M5 17.6 16.6 6 18 7.4 6.4 19H5v-1.4ZM17.3 3.9a1.5 1.5 0 0 1 2.1 0l.7.7a1.5 1.5 0 0 1 0 2.1l-.7.7L16.6 4.6l.7-.7Z",
    calendar: "M7 3h2v2h6V3h2v2h3v16H4V5h3V3Zm11 8H6v8h12v-8ZM6 9h12V7H6v2Z",
    note: "M5 3h14v18H5V3Zm2 2v14h10V5H7Zm2 4h6v2H9V9Zm0 4h6v2H9v-2Z"
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]}"></path></svg>`;
}

function actionButton(label, icon, attrs) {
  return `<button class="small-button" type="button" ${attrs}>${iconSvg(icon)}<span>${label}</span></button>`;
}

function linkButton(url, label, icon = "external") {
  return `<a class="small-button" href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">
    ${iconSvg(icon)}
    ${label}
  </a>`;
}

function emptyState(message) {
  return `<div class="empty-state">${message}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 1700);
}

function buildTransferCode() {
  const payload = {
    app: "CareerBoard",
    version: 2,
    exportedAt: new Date().toISOString(),
    state
  };
  return `CAREERBOARD:${bytesToBase64(new TextEncoder().encode(JSON.stringify(payload)))}`;
}

function parseTransferCode(value) {
  const text = value.trim();
  const compact = text.replace(/\s+/g, "");
  const token = compact.match(/CAREERBOARD:[A-Za-z0-9+/=_-]+/)?.[0];
  if (token) {
    const encoded = token.replace("CAREERBOARD:", "").replaceAll("-", "+").replaceAll("_", "/");
    const json = new TextDecoder().decode(base64ToBytes(encoded));
    const payload = JSON.parse(json);
    return payload.state || payload;
  }
  const payload = JSON.parse(text);
  return payload.state || payload;
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function refreshExportCode() {
  exportCode.value = buildTransferCode();
}

function openSettingsModal() {
  refreshExportCode();
  importCode.value = "";
  importCodeFile.value = "";
  settingsModal.classList.add("is-open");
  settingsModal.setAttribute("aria-hidden", "false");
}

function closeSettingsModal() {
  settingsModal.classList.remove("is-open");
  settingsModal.setAttribute("aria-hidden", "true");
}

function importStateCode() {
  if (!importCode.value.trim()) {
    showToast("移行コードを貼ってください");
    return;
  }
  if (!window.confirm("今の管理情報を上書きして読み込みますか？")) return;
  try {
    state = migrateState({ ...structuredClone(demoState), ...parseTransferCode(importCode.value) });
    saveState();
    companySearch.value = state.search || "";
    taskSearch.value = state.taskSearch || "";
    companySort.value = state.companySort || "priority";
    noteSearch.value = "";
    noteFilterCompany.value = "all";
    noteFilterType.value = "all";
    render();
    setView(state.activeView || "tasks");
    closeSettingsModal();
    showToast("読み込みました");
  } catch {
    showToast("コードを読み込めませんでした");
  }
}

function readImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    importCode.value = String(reader.result || "");
    showToast("ファイルを読み込みました");
  });
  reader.addEventListener("error", () => showToast("ファイルを読めませんでした"));
  reader.readAsText(file);
}

async function copyToClipboard(text, message = "コピーしました") {
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        fallbackCopyToClipboard(text);
      }
    } else {
      fallbackCopyToClipboard(text);
    }
    showToast(message);
  } catch {
    showToast("コピーできませんでした");
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Copy failed");
}

function setView(view) {
  state.activeView = view;
  saveState();
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.toggle("is-visible", panel.id === `${view}View`);
  });
  document.body.dataset.view = view;
  viewTitle.textContent = { companies: "企業", tasks: "予定", notes: "メモ" }[view] || "企業";
  topActions.hidden = view !== "companies";
}

function openCompanyModal(company) {
  companyForm.elements.id.value = company?.id || "";
  companyForm.elements.name.value = company?.name || "";
  companyForm.elements.mypageUrl.value = company?.mypageUrl || "";
  companyForm.elements.personalId.value = company?.personalId || "";
  companyForm.elements.internStart.value = company?.internStart || "";
  companyForm.elements.internEnd.value = company?.internEnd || "";
  companyForm.elements.industry.value = normalizeIndustry(company?.industry);
  companyForm.elements.priority.value = company?.priority || "3";
  companyForm.elements.internResult.value = company?.internResult || "none";
  companyForm.elements.mainResult.value = company?.mainResult || "none";
  companyForm.elements.memo.value = company?.memo || "";
  setSelectionFieldsOpen(hasSelectionDetails(company));
  companyModal.classList.add("is-open");
  companyModal.setAttribute("aria-hidden", "false");
  window.setTimeout(() => companyForm.elements.name.focus(), 0);
}

function normalizeIndustry(value) {
  if (!value) return industries[0];
  if (industries.includes(value)) return value;
  if (/IT|SaaS|Web|ソフト|システム/i.test(value)) return "IT / Web";
  if (/広告|メディア|出版|テレビ|新聞/i.test(value)) return "広告 / メディア";
  if (/メーカー|製造|素材|機械|電機|自動車/i.test(value)) return "メーカー";
  if (/銀行|証券|保険|金融/i.test(value)) return "金融";
  if (/コンサル/i.test(value)) return "コンサル";
  return "その他";
}

function closeCompanyModal() {
  companyModal.classList.remove("is-open");
  companyModal.setAttribute("aria-hidden", "true");
}

function setSelectionFieldsOpen(isOpen) {
  selectionFields.hidden = !isOpen;
  toggleSelectionFields.setAttribute("aria-expanded", String(isOpen));
}

function hasSelectionDetails(company) {
  return Boolean(
    company?.internStart ||
    company?.internEnd ||
    (company?.internResult && company.internResult !== "none") ||
    (company?.mainResult && company.mainResult !== "none")
  );
}

function resetTaskForm(date = offsetDate(1)) {
  taskForm.elements.companyId.value = "";
  taskForm.elements.type.value = "";
  taskForm.elements.date.value = date;
  taskForm.elements.time.value = "";
  taskForm.elements.memo.value = "";
}

function hasInternPeriod(company) {
  return Boolean(company.internStart && company.internEnd);
}

function isInternDay(company, value) {
  return company.internResult !== "fail" && hasInternPeriod(company) && company.internStart <= value && value <= company.internEnd;
}

function internTone(company) {
  if (company.internResult === "pass") return "is-pass";
  if (company.internResult === "fail") return "is-fail";
  return "is-none";
}

function internToneOrder(company) {
  return { "is-pass": 0, "is-none": 1, "is-fail": 2 }[internTone(company)];
}

function internStyle(company) {
  if (company.internResult === "pass") return "--intern-color:#7be3a8;--intern-text:#0f513b";
  if (company.internResult === "fail") return "--intern-color:#ffd8dc;--intern-text:#9f2838";
  return "--intern-color:#e8edf3;--intern-text:#526170";
}

function internResultLabel(value) {
  return { pass: "インターン合格", fail: "インターン不合格", none: "インターン未設定" }[value || "none"];
}

function resetNoteForm() {
  noteForm.elements.id.value = "";
  noteForm.elements.companyId.value = "";
  noteForm.elements.type.value = "";
  noteForm.elements.body.value = "";
  noteFormTitle.textContent = "メモ";
}

function shiftMonth(amount) {
  if (state.calendarView === "week") {
    const next = new Date(`${state.calendarWeekStart}T00:00:00`);
    next.setDate(next.getDate() + amount * 7);
    state.calendarWeekStart = localDateValue(next);
  } else {
    const [year, month] = state.calendarMonth.split("-").map(Number);
    const next = new Date(year, month - 1 + amount, 1);
    state.calendarMonth = localMonthValue(next);
  }
  saveState();
  renderCalendar();
}

function jumpToCompany(companyId) {
  const company = companyById(companyId);
  if (!company) return;
  closeDayModal();
  closeWeekModal();
  setView("companies");
  state.search = "";
  companySearch.value = "";
  saveState();
  renderCompanies();
  window.setTimeout(() => {
    const card = document.querySelector(`#company-${CSS.escape(companyId)}`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("is-focus");
    window.setTimeout(() => card.classList.remove("is-focus"), 2200);
  }, 0);
}

document.addEventListener("click", (event) => {
  const pickDate = event.target.closest("[data-pick-date]");
  if (pickDate) {
    event.preventDefault();
    event.stopPropagation();
    openDayModal(pickDate.dataset.pickDate);
    return;
  }

  const nav = event.target.closest("[data-view]");
  const editCompany = event.target.closest("[data-edit-company]");
  const createTask = event.target.closest("[data-create-task]");
  const noteCompany = event.target.closest("[data-note-company]");
  const editNote = event.target.closest("[data-edit-note]");
  const deleteNote = event.target.closest("[data-delete-note]");
  const copyPersonalId = event.target.closest("[data-copy-personal-id]");
  const completeTask = event.target.closest("[data-complete-task]");
  const openCompany = event.target.closest("[data-open-company]");
  const setStatus = event.target.closest("[data-set-status]");
  const shiftStatus = event.target.closest("[data-shift-status]");
  const toggleMemo = event.target.closest("[data-toggle-memo]");

  if (toggleMemo) {
    event.preventDefault();
    event.stopPropagation();
    const block = toggleMemo.closest(".collapsible-memo");
    const isCollapsed = block?.classList.toggle("is-collapsed");
    toggleMemo.textContent = isCollapsed ? "表示" : "閉じる";
    return;
  }

  if (nav) {
    setView(nav.dataset.view);
    if (nav.dataset.view === "notes") renderNotes();
  }
  if (editCompany) openCompanyModal(companyById(editCompany.dataset.editCompany));
  if (copyPersonalId) {
    const company = companyById(copyPersonalId.dataset.copyPersonalId);
    if (company?.personalId) copyToClipboard(company.personalId, "IDコピー");
  }
  if (createTask) {
    setView("tasks");
    openTaskModal({ companyId: createTask.dataset.createTask });
  }
  if (noteCompany) {
    setView("notes");
    noteFilterCompany.value = noteCompany.dataset.noteCompany;
    noteFilterType.value = "all";
    noteSearch.value = "";
    renderNotes(noteCompany.dataset.noteCompany);
    openNoteModal({ companyId: noteCompany.dataset.noteCompany });
  }
  if (editNote) {
    setView("notes");
    openNoteModal({ noteId: editNote.dataset.editNote });
  }
  if (deleteNote) {
    openDeleteNoteConfirm(deleteNote.dataset.deleteNote);
  }
  if (completeTask) {
    openConfirmModal(completeTask.dataset.completeTask);
  }
  if (openCompany) {
    jumpToCompany(openCompany.dataset.openCompany);
  }
  if (shiftStatus) {
    const company = companyById(shiftStatus.dataset.statusCompany);
    if (!company) return;
    const current = company.selectionStatus || inferCompanyStatus(company.id);
    const nextIndex = Math.min(
      selectionStatuses.length - 1,
      Math.max(0, selectionStatusIndex(current) + Number(shiftStatus.dataset.shiftStatus))
    );
    company.selectionStatus = selectionStatuses[nextIndex].id;
    saveState();
    renderCompanies();
    showToast("現在地を更新しました");
  }
  if (setStatus) {
    const company = companyById(setStatus.dataset.statusCompany);
    if (!company) return;
    company.selectionStatus = setStatus.dataset.setStatus;
    saveState();
    renderCompanies();
    showToast("現在地を更新しました");
  }
});

document.querySelector("#openCompanyForm").addEventListener("click", () => openCompanyModal());
document.querySelector("#openSettings").addEventListener("click", openSettingsModal);
document.querySelector("#closeSettings").addEventListener("click", closeSettingsModal);
document.querySelector("#refreshExportCode").addEventListener("click", refreshExportCode);
document.querySelector("#copyExportCode").addEventListener("click", () => copyToClipboard(exportCode.value, "コードをコピーしました"));
document.querySelector("#importStateCode").addEventListener("click", importStateCode);
importCodeFile.addEventListener("change", (event) => readImportFile(event.target.files?.[0]));
document.querySelector("#closeCompanyModal").addEventListener("click", closeCompanyModal);
toggleSelectionFields.addEventListener("click", () => {
  setSelectionFieldsOpen(selectionFields.hidden);
});
openTaskForm.addEventListener("click", () => openTaskModal());
document.querySelector("#closeTaskModal").addEventListener("click", closeTaskModal);
openNoteForm.addEventListener("click", () => openNoteModal());
document.querySelector("#closeNoteModal").addEventListener("click", closeNoteModal);
openWeekTasks.addEventListener("click", openWeekModal);
document.querySelector("#closeWeekModal").addEventListener("click", closeWeekModal);
document.querySelector("#prevMonth").addEventListener("click", () => shiftMonth(-1));
document.querySelector("#nextMonth").addEventListener("click", () => shiftMonth(1));
calendarViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.calendarView = button.dataset.calendarView;
    if (state.calendarView === "week" && !state.calendarWeekStart) state.calendarWeekStart = offsetDate(0);
    saveState();
    renderCalendar();
  });
});
document.querySelector("#closeDayModal").addEventListener("click", closeDayModal);
useDayForTask.addEventListener("click", () => {
  closeDayModal();
  setView("tasks");
  openTaskModal({ date: selectedCalendarDate });
});
taskModal.addEventListener("click", (event) => {
  if (event.target === taskModal) closeTaskModal();
});
companyModal.addEventListener("click", (event) => {
  if (event.target === companyModal) closeCompanyModal();
});
noteModal.addEventListener("click", (event) => {
  if (event.target === noteModal) closeNoteModal();
});
dayModal.addEventListener("click", (event) => {
  if (event.target === dayModal) closeDayModal();
});
weekModal.addEventListener("click", (event) => {
  if (event.target === weekModal) closeWeekModal();
});
settingsModal.addEventListener("click", (event) => {
  if (event.target === settingsModal) closeSettingsModal();
});
document.querySelector("#cancelCompleteTask").addEventListener("click", closeConfirmModal);
document.querySelector("#confirmCompleteTask").addEventListener("click", completePendingTask);
confirmModal.addEventListener("click", (event) => {
  if (event.target === confirmModal) closeConfirmModal();
});

document.querySelector("#resetDemo").addEventListener("click", () => {
  state = migrateState(structuredClone(demoState));
  companySearch.value = "";
  taskSearch.value = "";
  companySort.value = state.companySort;
  noteSearch.value = "";
  noteFilterCompany.value = "all";
  noteFilterType.value = "all";
  noteFormTitle.textContent = "メモ";
  closeTaskModal();
  closeNoteModal();
  saveState();
  render();
  setView("companies");
  showToast("デモデータに戻しました");
});

companySearch.addEventListener("input", (event) => {
  state.search = event.target.value;
  saveState();
  renderCompanies();
});

companySort.addEventListener("change", (event) => {
  state.companySort = event.target.value;
  saveState();
  renderCompanies();
});

taskSearch.addEventListener("input", (event) => {
  state.taskSearch = event.target.value;
  saveState();
  renderWeekTasks();
  renderCalendar();
});

noteSearch.addEventListener("input", () => renderNotes());
noteFilterCompany.addEventListener("change", () => renderNotes());
noteFilterType.addEventListener("change", () => renderNotes());

companyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(companyForm);
  const id = data.get("id");
  const existingCompany = state.companies.find((item) => item.id === id);
  const company = {
    id: id || crypto.randomUUID(),
    name: data.get("name").trim(),
    mypageUrl: data.get("mypageUrl").trim(),
    personalId: data.get("personalId").trim(),
    industry: data.get("industry"),
    priority: data.get("priority"),
    internStart: data.get("internStart"),
    internEnd: data.get("internEnd"),
    internResult: data.get("internResult"),
    mainResult: data.get("mainResult"),
    selectionStatus: existingCompany?.selectionStatus || "",
    memo: data.get("memo").trim()
  };
  if ((company.internStart && !company.internEnd) || (!company.internStart && company.internEnd)) {
    showToast("インターン期間は開始日と終了日を両方入れてください");
    return;
  }
  if (company.internStart && company.internEnd && company.internStart > company.internEnd) {
    showToast("インターン終了日は開始日以降にしてください");
    return;
  }
  const index = state.companies.findIndex((item) => item.id === id);
  if (index >= 0) state.companies[index] = company;
  else state.companies.push(company);
  saveState();
  render();
  closeCompanyModal();
  showToast("企業を保存しました");
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(taskForm);
  const companyId = data.get("companyId");
  const type = data.get("type");
  const date = data.get("date");
  if (!companyId || !type || !date) {
    showToast("企業名、タスク状況、日程を選んでください");
    return;
  }
  state.tasks.push({
    id: crypto.randomUUID(),
    companyId,
    type,
    date,
    time: data.get("time"),
    memo: data.get("memo").trim(),
    done: false
  });
  saveState();
  render();
  resetTaskForm();
  closeTaskModal();
  showToast("追加しました");
});

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(noteForm);
  const id = data.get("id");
  const companyId = data.get("companyId");
  const type = data.get("type");
  const body = data.get("body").trim();
  if (!companyId || !type || !body) {
    showToast("企業名、種類、メモを入力してください");
    return;
  }
  const note = {
    id: id || crypto.randomUUID(),
    companyId,
    type,
    body,
    createdAt: offsetDate(0)
  };
  const index = state.notes.findIndex((item) => item.id === id);
  if (index >= 0) state.notes[index] = note;
  else state.notes.push(note);
  saveState();
  render();
  resetNoteForm();
  closeNoteModal();
  showToast(index >= 0 ? "更新しました" : "追加しました");
});

companySearch.value = state.search;
taskSearch.value = state.taskSearch;
companySort.value = state.companySort;
resetTaskForm();
render();
noteSearch.value = "";
noteFilterCompany.value = "all";
noteFilterType.value = "all";
renderNotes();
setView(state.activeView);
