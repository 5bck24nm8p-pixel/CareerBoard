const storageKey = "careerboard-state-v2";

const taskTypes = [
  { id: "briefing", label: "説明会", color: "#cde7ff" },
  { id: "es", label: "ES締切", color: "#ffe0e6" },
  { id: "webtest", label: "WEBテスト", color: "#d9f5df" },
  { id: "testcenter", label: "テストセンター", color: "#fff0c7" },
  { id: "first", label: "1次面接", color: "#e3ddff" },
  { id: "second", label: "2次面接", color: "#d7f4f0" },
  { id: "third", label: "3次面接", color: "#ffe4c7" },
  { id: "final", label: "最終面接", color: "#ffd6d1" },
  { id: "gd", label: "グループディスカッション", color: "#e8edf3" }
];

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
  activeView: "companies",
  search: "",
  companySort: "priority",
  calendarMonth: localMonthValue(new Date()),
  companies: [
    {
      id: "c1",
      name: "株式会社ブルーリンク",
      mypageUrl: "https://example.com/mypage",
      personalId: "BL-2026-1042",
      industry: "IT / SaaS",
      priority: "5",
      internResult: "pass",
      mainResult: "none",
      memo: "プロダクト志向が強い。一次面接では学生時代に工夫した経験を深掘りされそう。"
    },
    {
      id: "c2",
      name: "東都メディア",
      mypageUrl: "https://example.com/mypage",
      personalId: "TM-58391",
      industry: "広告 / メディア",
      priority: "3",
      internResult: "none",
      mainResult: "none",
      memo: "説明会で事業領域を確認。志望理由はまだ弱い。"
    },
    {
      id: "c3",
      name: "ミナト製作所",
      mypageUrl: "https://example.com/mypage",
      personalId: "MN-ENTRY-77",
      industry: "メーカー",
      priority: "4",
      internResult: "fail",
      mainResult: "none",
      memo: "勤務地と職種別採用の違いを確認する。"
    }
  ],
  tasks: [
    { id: "t1", companyId: "c1", type: "first", date: offsetDate(2), time: "10:00", memo: "Zoom。逆質問を3つ用意", done: false },
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
const companyGrid = document.querySelector("#companyGrid");
const companySearch = document.querySelector("#companySearch");
const companySort = document.querySelector("#companySort");
const companyForm = document.querySelector("#companyForm");
const industrySelect = document.querySelector("#industrySelect");
const taskForm = document.querySelector("#taskForm");
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
const calendarTitle = document.querySelector("#calendarTitle");
const calendarGrid = document.querySelector("#calendarGrid");
const drawer = document.querySelector("#drawer");
const toast = document.querySelector("#toast");
const dayModal = document.querySelector("#dayModal");
const dayModalTitle = document.querySelector("#dayModalTitle");
const dayTaskList = document.querySelector("#dayTaskList");
const useDayForTask = document.querySelector("#useDayForTask");
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
  nextState.notes ||= [];
  nextState.companies = (nextState.companies || []).map((company) => ({
    personalId: "",
    internResult: "none",
    mainResult: "none",
    ...company
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
    .filter((task) => {
      const days = daysUntil(task.date);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || "99:99").localeCompare(b.time || "99:99"));
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
  taskCompanySelect.innerHTML = `<option value="" disabled selected>企業を選択</option>` + state.companies
    .sort((a, b) => Number(b.priority) - Number(a.priority))
    .map((company) => `<option value="${company.id}">${escapeHtml(company.name)}</option>`)
    .join("");
  taskTypeSelect.innerHTML = `<option value="" disabled selected>タスク状況を選択</option>` + taskTypes
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
  noteCompanySelect.innerHTML = `<option value="" disabled selected>企業を選択</option>` + options;
  noteFilterCompany.innerHTML = `<option value="all">すべて</option>` + options;
  noteCompanySelect.value = "";
}

function renderCompanies() {
  const companies = filteredCompanies();
  companyGrid.innerHTML = companies.length ? companies.map((company) => `
    <article class="company-card">
      <header>
        <div>
          <h3>${escapeHtml(company.name)}</h3>
          <span class="meta">${escapeHtml(company.industry || "業界未設定")}</span>
        </div>
        <span class="priority-pill" data-priority="${company.priority}">志望度 ${priorityLabel(company.priority)}</span>
      </header>
      <div class="result-row">
        ${resultPill("intern", company.internResult)}
        ${resultPill("main", company.mainResult)}
      </div>
      <p>${escapeHtml(company.memo || "メモなし")}</p>
      <div class="card-actions">
        ${company.mypageUrl ? linkButton(company.mypageUrl, "マイページ") : `<button class="small-button" type="button" data-edit-company="${company.id}">URL設定</button>`}
        ${company.personalId ? `<button class="small-button" type="button" data-copy-personal-id="${company.id}">個人ID</button>` : `<button class="small-button" type="button" data-edit-company="${company.id}">個人ID設定</button>`}
        <button class="small-button" type="button" data-edit-company="${company.id}">編集</button>
        <button class="small-button" type="button" data-create-task="${company.id}">タスク追加</button>
        <button class="small-button" type="button" data-note-company="${company.id}">メモ欄</button>
      </div>
      ${latestNotePreview(company.id)}
    </article>
  `).join("") : emptyState("企業がまだありません。");
}

function resultPill(kind, value = "none") {
  const labels = {
    intern: { none: "インターン未設定", pass: "インターン合格", fail: "インターン不合格" },
    main: { none: "本選考未設定", pass: "本選考合格", fail: "本選考不合格" }
  };
  const className = value === "pass" ? "is-pass" : value === "fail" ? "is-fail" : "";
  return `<span class="result-pill ${className}">${labels[kind][value || "none"]}</span>`;
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
      <p>${escapeHtml(note.body)}</p>
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

function renderWeekTasks() {
  const tasks = weekTasks();
  weekTaskCount.textContent = `${tasks.length}件`;
  weekTaskList.innerHTML = tasks.length ? tasks.map((task) => taskRow(task)).join("") : emptyState("直近1週間の未完了タスクはありません。");
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
            <h4>${escapeHtml(company?.name || "企業未設定")}</h4>
          </div>
          <span class="date-pill">${formatDate(task.date)}${task.time ? ` ${escapeHtml(task.time)}` : ""} / ${dateDistance(task.date)}</span>
        </header>
        <p>${escapeHtml(task.memo || "メモなし")}</p>
      </div>
    </article>
  `;
}

function renderCalendar() {
  const [year, month] = state.calendarMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());
  calendarTitle.textContent = `${year}年 ${month}月`;

  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const value = localDateValue(date);
    const tasks = state.tasks.filter((task) => !task.done && task.date === value);
    const isCurrentMonth = date.getMonth() === month - 1;
    const isToday = value === offsetDate(0);
    cells.push(`
      <button class="calendar-day ${isCurrentMonth ? "" : "is-muted"} ${isToday ? "is-today" : ""}" type="button" data-pick-date="${value}">
        <strong>${date.getDate()}</strong>
        ${tasks.slice(0, 3).map((task) => {
          const type = taskTypeById(task.type);
          return `<span class="calendar-task" style="--task-color:${type.color}">${task.time ? `${escapeHtml(task.time)} ` : ""}${type.label}</span>`;
        }).join("")}
      </button>
    `);
  }
  calendarGrid.innerHTML = cells.join("");
}

function openDayModal(date) {
  selectedCalendarDate = date;
  dayModalTitle.textContent = `${formatDate(date)} のタスク`;
  const tasks = state.tasks
    .filter((task) => !task.done && task.date === date)
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99") || taskTypeById(a.type).label.localeCompare(taskTypeById(b.type).label, "ja"));

  dayTaskList.innerHTML = tasks.length ? tasks.map((task) => {
    const company = companyById(task.companyId);
    const type = taskTypeById(task.type);
    return `
      <article class="day-task-item" style="--task-color:${type.color}">
        <button class="task-check" type="button" data-complete-task="${task.id}" aria-label="完了にする"></button>
        <div>
          <span class="task-type-pill">${type.label}</span>
          <h3>${escapeHtml(company?.name || "企業未設定")}</h3>
          <span class="date-pill">${task.time ? `${escapeHtml(task.time)} 締切` : "時間未設定"}</span>
          <p>${escapeHtml(task.memo || "メモなし")}</p>
        </div>
      </article>
    `;
  }).join("") : emptyState("この日の未完了タスクはありません。");

  dayModal.classList.add("is-open");
  dayModal.setAttribute("aria-hidden", "false");
}

function closeDayModal() {
  dayModal.classList.remove("is-open");
  dayModal.setAttribute("aria-hidden", "true");
}

function openConfirmModal(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  const company = task ? companyById(task.companyId) : null;
  const type = task ? taskTypeById(task.type) : null;
  pendingCompleteTaskId = taskId;
  pendingDeleteNoteId = "";
  confirmModalTitle.textContent = "タスクを完了にしますか？";
  confirmTaskText.textContent = task
    ? `${company?.name || "企業未設定"} / ${type?.label || "タスク"} を完了にします。`
    : "このタスクを完了にします。";
  confirmCompleteTask.textContent = "完了にする";
  confirmModal.classList.add("is-open");
  confirmModal.setAttribute("aria-hidden", "false");
}

function openDeleteNoteConfirm(noteId) {
  const note = state.notes.find((item) => item.id === noteId);
  const company = note ? companyById(note.companyId) : null;
  pendingDeleteNoteId = noteId;
  pendingCompleteTaskId = "";
  confirmModalTitle.textContent = "メモを削除しますか？";
  confirmTaskText.textContent = note
    ? `${company?.name || "企業未設定"} / ${noteTypeLabel(note.type)} のメモを削除します。`
    : "このメモを削除します。";
  confirmCompleteTask.textContent = "削除する";
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

function linkButton(url, label) {
  return `<a class="small-button" href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">
    ${label}
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5h-2V8.4l-6.3 6.3-1.4-1.4L15.6 7H14V5ZM5 7h6v2H7v8h8v-4h2v6H5V7Z"></path></svg>
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

async function copyToClipboard(text) {
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
    showToast("個人IDをコピーしました");
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
  viewTitle.textContent = { companies: "企業一覧", tasks: "タスク一覧", notes: "ES/面接メモ" }[view] || "企業一覧";
}

function openDrawer(company) {
  companyForm.elements.id.value = company?.id || "";
  companyForm.elements.name.value = company?.name || "";
  companyForm.elements.mypageUrl.value = company?.mypageUrl || "";
  companyForm.elements.personalId.value = company?.personalId || "";
  companyForm.elements.industry.value = normalizeIndustry(company?.industry);
  companyForm.elements.priority.value = company?.priority || "3";
  companyForm.elements.internResult.value = company?.internResult || "none";
  companyForm.elements.mainResult.value = company?.mainResult || "none";
  companyForm.elements.memo.value = company?.memo || "";
  drawer.classList.add("is-open");
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

function closeDrawer() {
  drawer.classList.remove("is-open");
}

function resetTaskForm(date = offsetDate(1)) {
  taskForm.elements.companyId.value = "";
  taskForm.elements.type.value = "";
  taskForm.elements.date.value = date;
  taskForm.elements.time.value = "";
  taskForm.elements.memo.value = "";
}

function resetNoteForm() {
  noteForm.elements.id.value = "";
  noteForm.elements.companyId.value = "";
  noteForm.elements.type.value = "";
  noteForm.elements.body.value = "";
  noteFormTitle.textContent = "メモを追加";
}

function shiftMonth(amount) {
  const [year, month] = state.calendarMonth.split("-").map(Number);
  const next = new Date(year, month - 1 + amount, 1);
  state.calendarMonth = localMonthValue(next);
  saveState();
  renderCalendar();
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

  if (nav) {
    setView(nav.dataset.view);
    if (nav.dataset.view === "notes") renderNotes();
  }
  if (editCompany) openDrawer(companyById(editCompany.dataset.editCompany));
  if (copyPersonalId) {
    const company = companyById(copyPersonalId.dataset.copyPersonalId);
    if (company?.personalId) copyToClipboard(company.personalId);
  }
  if (createTask) {
    setView("tasks");
    resetTaskForm();
    taskForm.elements.companyId.focus();
  }
  if (noteCompany) {
    setView("notes");
    noteForm.elements.companyId.value = noteCompany.dataset.noteCompany;
    noteForm.elements.type.value = "";
    noteForm.elements.body.focus();
    noteFilterCompany.value = noteCompany.dataset.noteCompany;
    noteFilterType.value = "all";
    noteSearch.value = "";
    renderNotes(noteCompany.dataset.noteCompany);
  }
  if (editNote) {
    const note = state.notes.find((item) => item.id === editNote.dataset.editNote);
    if (note) {
      setView("notes");
      noteForm.elements.id.value = note.id;
      noteForm.elements.companyId.value = note.companyId;
      noteForm.elements.type.value = note.type;
      noteForm.elements.body.value = note.body;
      noteFormTitle.textContent = "メモを編集";
      noteForm.elements.body.focus();
    }
  }
  if (deleteNote) {
    openDeleteNoteConfirm(deleteNote.dataset.deleteNote);
  }
  if (completeTask) {
    openConfirmModal(completeTask.dataset.completeTask);
  }
});

document.querySelector("#openCompanyForm").addEventListener("click", () => openDrawer());
document.querySelector("#closeDrawer").addEventListener("click", closeDrawer);
document.querySelector("#prevMonth").addEventListener("click", () => shiftMonth(-1));
document.querySelector("#nextMonth").addEventListener("click", () => shiftMonth(1));
document.querySelector("#closeDayModal").addEventListener("click", closeDayModal);
useDayForTask.addEventListener("click", () => {
  closeDayModal();
  setView("tasks");
  resetTaskForm(selectedCalendarDate);
  taskForm.elements.companyId.focus();
});
dayModal.addEventListener("click", (event) => {
  if (event.target === dayModal) closeDayModal();
});
document.querySelector("#cancelCompleteTask").addEventListener("click", closeConfirmModal);
document.querySelector("#confirmCompleteTask").addEventListener("click", completePendingTask);
confirmModal.addEventListener("click", (event) => {
  if (event.target === confirmModal) closeConfirmModal();
});

document.querySelector("#resetDemo").addEventListener("click", () => {
  state = migrateState(structuredClone(demoState));
  companySearch.value = "";
  companySort.value = state.companySort;
  noteSearch.value = "";
  noteFilterCompany.value = "all";
  noteFilterType.value = "all";
  noteFormTitle.textContent = "メモを追加";
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

noteSearch.addEventListener("input", () => renderNotes());
noteFilterCompany.addEventListener("change", () => renderNotes());
noteFilterType.addEventListener("change", () => renderNotes());

companyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(companyForm);
  const id = data.get("id");
  const company = {
    id: id || crypto.randomUUID(),
    name: data.get("name").trim(),
    mypageUrl: data.get("mypageUrl").trim(),
    personalId: data.get("personalId").trim(),
    industry: data.get("industry"),
    priority: data.get("priority"),
    internResult: data.get("internResult"),
    mainResult: data.get("mainResult"),
    memo: data.get("memo").trim()
  };
  const index = state.companies.findIndex((item) => item.id === id);
  if (index >= 0) state.companies[index] = company;
  else state.companies.push(company);
  saveState();
  render();
  closeDrawer();
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
  showToast("タスクを追加しました");
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
  showToast(index >= 0 ? "メモを更新しました" : "メモを追加しました");
});

companySearch.value = state.search;
companySort.value = state.companySort;
resetTaskForm();
render();
noteSearch.value = "";
noteFilterCompany.value = "all";
noteFilterType.value = "all";
renderNotes();
setView(state.activeView);
