// ============================================================
//  DATA STORE
// ============================================================
const LETTERS = ['A','B','C','D'];
const DIFF = { easy:'Easy', medium:'Medium', hard:'Hard' };

let store = {
  quizzes: [
    {
      id: 'q1',
      title: 'JavaScript Fundamentals',
      topic: 'Programming',
      description: 'Test your knowledge of core JS concepts including closures, hoisting, and async patterns.',
      timeLimit: 10, // minutes
      difficulty: 'medium',
      questions: [
        { id:1, text:'What does `typeof null` return in JavaScript?', options:['null','undefined','object','boolean'], correct:2, explanation:'This is a famous JavaScript quirk. `typeof null` returns "object" due to a legacy bug in the original JS implementation.' },
        { id:2, text:'Which method is used to remove the last element from an array?', options:['shift()','splice()','pop()','slice()'], correct:2, explanation:'`pop()` removes and returns the last element of an array. `shift()` removes the first element.' },
        { id:3, text:'What is a closure in JavaScript?', options:['A way to close browser windows','A function that remembers variables from its outer scope','A method to close database connections','An error handling mechanism'], correct:1, explanation:'A closure is a function that retains access to variables in its lexical scope even after the outer function has returned.' },
        { id:4, text:'What will `0.1 + 0.2 === 0.3` evaluate to?', options:['true','false','undefined','NaN'], correct:1, explanation:'Due to floating-point precision issues, 0.1 + 0.2 evaluates to 0.30000000000000004, not exactly 0.3, so the comparison is false.' },
        { id:5, text:'Which keyword declares a block-scoped variable?', options:['var','let','function','this'], correct:1, explanation:'`let` (and `const`) are block-scoped. `var` is function-scoped and can lead to unexpected behavior.' },
      ]
    },
    {
      id: 'q2',
      title: 'CSS Mastery',
      topic: 'Web Design',
      description: 'Dive deep into CSS layout, specificity, animations, and modern features.',
      timeLimit: 8,
      difficulty: 'hard',
      questions: [
        { id:1, text:'What CSS property controls the stacking order of elements?', options:['stack-order','layer','z-index','depth'], correct:2, explanation:'`z-index` controls the stacking order along the z-axis. Higher values appear on top, but only on positioned elements.' },
        { id:2, text:'Which value of `display` makes children into flex items?', options:['block','inline-flex','flex','grid'], correct:2, explanation:'`display: flex` turns an element into a flex container, making its direct children flex items.' },
        { id:3, text:'What does the CSS `::before` pseudo-element do?', options:['Targets the first child element','Inserts content before the element\'s content','Applies styles before other rules','Selects the previous sibling'], correct:1, explanation:'`::before` creates a pseudo-element that is the first child of the selected element, often used for decorative content.' },
        { id:4, text:'Which unit is relative to the root element\'s font size?', options:['em','rem','vh','%'], correct:1, explanation:'`rem` (root em) is relative to the font-size of the root `<html>` element, making it predictable across the document.' },
      ]
    },
    {
      id: 'q3',
      title: 'World Geography',
      topic: 'General Knowledge',
      description: 'How well do you know the world? Test your geography IQ with this quick quiz!',
      timeLimit: 5,
      difficulty: 'easy',
      questions: [
        { id:1, text:'What is the capital city of Australia?', options:['Sydney','Melbourne','Canberra','Brisbane'], correct:2, explanation:'Canberra is Australia\'s capital. Many people guess Sydney, but the capital was purpose-built as a compromise between Sydney and Melbourne.' },
        { id:2, text:'Which is the largest ocean on Earth?', options:['Atlantic','Indian','Arctic','Pacific'], correct:3, explanation:'The Pacific Ocean is the largest, covering about 165 million square kilometers — more than all land areas combined.' },
        { id:3, text:'The Amazon River primarily flows through which country?', options:['Colombia','Peru','Brazil','Venezuela'], correct:2, explanation:'About 60% of the Amazon basin lies within Brazil. The river itself flows mostly through Brazil before emptying into the Atlantic.' },
      ]
    }
  ],
  userAnswers: {},
  currentQuiz: null,
  currentQ: 0,
  timerInterval: null,
  timerSecondsLeft: 0,
  timerTotal: 0,
};

// ============================================================
//  NAVIGATION
// ============================================================
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  screen.classList.add('active');
  screen.querySelectorAll('.anim-up, .anim-pop, .anim-in').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });
}

function enterAdmin() {
  goTo('screen-admin');
  renderAdminDashboard();
}

function enterStudent() {
  goTo('screen-student');
  renderStudentLobby();
}

function demoPreview() {
  store.currentQuiz = store.quizzes[0];
  startQuiz();
}

// ============================================================
//  ADMIN DASHBOARD
// ============================================================
function renderAdminDashboard() {
  const el = document.getElementById('admin-content');

  const totalQ = store.quizzes.reduce((a,q) => a + q.questions.length, 0);

  el.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <div class="label" style="margin-bottom:0.3rem;">Dashboard</div>
        <h2 class="heading">My Quizzes</h2>
      </div>
      <button class="btn btn-primary" onclick="openCreateQuiz()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        New Quiz
      </button>
    </div>

    <div class="grid-3" style="margin-bottom:2rem;">
      <div class="card card-sm">
        <div class="label" style="margin-bottom:0.4rem;">Total Quizzes</div>
        <div class="stat-val">${store.quizzes.length}</div>
      </div>
      <div class="card card-sm">
        <div class="label" style="margin-bottom:0.4rem;">Total Questions</div>
        <div class="stat-val">${totalQ}</div>
      </div>
      <div class="card card-sm">
        <div class="label" style="margin-bottom:0.4rem;">Topics Covered</div>
        <div class="stat-val">${new Set(store.quizzes.map(q=>q.topic)).size}</div>
      </div>
    </div>

    <div id="quiz-cards-admin">
      ${store.quizzes.map(renderAdminQuizCard).join('')}
    </div>
  `;
}

function renderAdminQuizCard(quiz) {
  const diffBadge = quiz.difficulty === 'easy'
    ? 'badge-green' : quiz.difficulty === 'hard' ? 'badge-red' : 'badge-yellow';
  return `
    <div class="card" style="margin-bottom:1rem;">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
        <div style="flex:1; min-width:200px;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem; flex-wrap:wrap;">
            <span class="badge badge-purple">${quiz.topic}</span>
            <span class="badge ${diffBadge}">${DIFF[quiz.difficulty]}</span>
            <span style="font-size:0.78rem; color:var(--muted);">⏱ ${quiz.timeLimit} min</span>
          </div>
          <h3 style="font-size:1.1rem; font-weight:600; font-family:var(--serif); margin-bottom:0.3rem;">${quiz.title}</h3>
          <p style="font-size:0.85rem; color:var(--muted); line-height:1.6;">${quiz.description}</p>
        </div>
        <div style="display:flex; gap:0.5rem; flex-shrink:0;">
          <button class="btn btn-secondary btn-sm" onclick="openEditQuiz('${quiz.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteQuiz('${quiz.id}')">Delete</button>
        </div>
      </div>

      <!-- Questions -->
      <div style="margin-top:1.25rem; border-top:1px solid var(--border); padding-top:1.25rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
          <span class="label">${quiz.questions.length} Questions</span>
          <button class="btn btn-ghost btn-sm" onclick="openAddQuestion('${quiz.id}')">+ Add Question</button>
        </div>
        <div id="q-list-${quiz.id}">
          ${quiz.questions.map((q,i) => renderQuestionRow(q, i, quiz.id)).join('')}
        </div>
        ${quiz.questions.length === 0 ? `<div class="empty"><div class="empty-icon">📋</div><div>No questions yet. Add your first question!</div></div>` : ''}
      </div>
    </div>
  `;
}

function renderQuestionRow(q, i, quizId) {
  return `
    <div class="q-card">
      <div class="q-card-header">
        <div style="flex:1;">
          <span class="q-num">Q${i+1}</span>
          <p style="font-size:0.9rem; margin-top:2px; line-height:1.5;">${q.text}</p>
        </div>
        <div style="display:flex; gap:0.4rem; flex-shrink:0;">
          <button class="btn btn-ghost btn-sm" onclick="openEditQuestion('${quizId}', ${q.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteQuestion('${quizId}', ${q.id})">✕</button>
        </div>
      </div>
      <div style="margin-top:0.6rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
        ${q.options.map((opt,idx) => `<span style="font-size:0.78rem; padding:3px 8px; border-radius:6px; background:${idx===q.correct?'rgba(94,207,181,0.15)':'var(--surface2)'}; color:${idx===q.correct?'var(--accent4)':'var(--muted)'}; border:1px solid ${idx===q.correct?'rgba(94,207,181,0.3)':'var(--border)'};">${LETTERS[idx]}. ${opt}</span>`).join('')}
      </div>
    </div>
  `;
}

// ============================================================
//  QUIZ CRUD MODALS
// ============================================================
function openCreateQuiz() {
  openModal(`
    <div class="modal-title">Create New Quiz</div>
    <div class="form-group"><label class="form-label">Quiz Title</label><input class="form-input" id="f-title" placeholder="e.g. Python Basics"/></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Topic</label><input class="form-input" id="f-topic" placeholder="e.g. Programming"/></div>
      <div class="form-group"><label class="form-label">Time Limit (min)</label><input class="form-input" id="f-time" type="number" min="1" max="120" value="10"/></div>
    </div>
    <div class="form-group"><label class="form-label">Difficulty</label>
      <select class="form-select" id="f-diff">
        <option value="easy">Easy</option>
        <option value="medium" selected>Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="f-desc" placeholder="Brief description of the quiz…"></textarea></div>
    <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewQuiz()">Create Quiz</button>
    </div>
  `);
}

function saveNewQuiz() {
  const title = v('f-title'), topic = v('f-topic'), time = parseInt(v('f-time')), diff = v('f-diff'), desc = v('f-desc');
  if (!title || !topic) return toast('Please fill in all required fields','error');
  store.quizzes.push({ id: 'q'+Date.now(), title, topic, description:desc, timeLimit:time||10, difficulty:diff, questions:[] });
  closeModal();
  renderAdminDashboard();
  toast('Quiz created! Now add some questions.','success');
}

function openEditQuiz(qid) {
  const quiz = store.quizzes.find(q=>q.id===qid);
  openModal(`
    <div class="modal-title">Edit Quiz</div>
    <div class="form-group"><label class="form-label">Quiz Title</label><input class="form-input" id="f-title" value="${quiz.title}"/></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Topic</label><input class="form-input" id="f-topic" value="${quiz.topic}"/></div>
      <div class="form-group"><label class="form-label">Time Limit (min)</label><input class="form-input" id="f-time" type="number" value="${quiz.timeLimit}"/></div>
    </div>
    <div class="form-group"><label class="form-label">Difficulty</label>
      <select class="form-select" id="f-diff">
        <option value="easy" ${quiz.difficulty==='easy'?'selected':''}>Easy</option>
        <option value="medium" ${quiz.difficulty==='medium'?'selected':''}>Medium</option>
        <option value="hard" ${quiz.difficulty==='hard'?'selected':''}>Hard</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="f-desc">${quiz.description}</textarea></div>
    <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEditQuiz('${qid}')">Save Changes</button>
    </div>
  `);
}

function saveEditQuiz(qid) {
  const quiz = store.quizzes.find(q=>q.id===qid);
  quiz.title = v('f-title'); quiz.topic = v('f-topic'); quiz.timeLimit = parseInt(v('f-time'));
  quiz.difficulty = v('f-diff'); quiz.description = v('f-desc');
  closeModal(); renderAdminDashboard(); toast('Quiz updated!','success');
}

function deleteQuiz(qid) {
  openModal(`
    <div class="modal-title">Delete Quiz?</div>
    <p class="body" style="margin-bottom:1.5rem;">This will permanently delete the quiz and all its questions. This action cannot be undone.</p>
    <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="confirmDeleteQuiz('${qid}')">Delete</button>
    </div>
  `);
}

function confirmDeleteQuiz(qid) {
  store.quizzes = store.quizzes.filter(q=>q.id!==qid);
  closeModal(); renderAdminDashboard(); toast('Quiz deleted.','success');
}

// ============================================================
//  QUESTION CRUD
// ============================================================
function openAddQuestion(quizId) {
  openModal(questionForm(quizId, null));
}

function openEditQuestion(quizId, qId) {
  const quiz = store.quizzes.find(q=>q.id===quizId);
  const question = quiz.questions.find(q=>q.id===qId);
  openModal(questionForm(quizId, question));
}

function questionForm(quizId, existing) {
  const opts = existing ? existing.options : ['','','',''];
  const correct = existing ? existing.correct : 0;
  return `
    <div class="modal-title">${existing ? 'Edit Question' : 'Add Question'}</div>
    <div class="form-group">
      <label class="form-label">Question Text</label>
      <textarea class="form-textarea" id="qf-text" style="min-height:70px;">${existing ? existing.text : ''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Answer Options — click the dot to mark correct answer</label>
      ${opts.map((opt,i) => `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.5rem;">
          <button onclick="setCorrect(${i})" id="correct-dot-${i}" style="width:22px;height:22px;border-radius:50%;border:2px solid ${i===correct?'var(--accent)':'var(--border2)'};background:${i===correct?'var(--accent)':'transparent'};cursor:pointer;flex-shrink:0;transition:all 0.2s;" title="Mark as correct"></button>
          <input class="form-input" id="qf-opt-${i}" value="${opt}" placeholder="Option ${LETTERS[i]}…"/>
        </div>
      `).join('')}
      <input type="hidden" id="qf-correct" value="${correct}"/>
    </div>
    <div class="form-group">
      <label class="form-label">Explanation (optional)</label>
      <textarea class="form-textarea" id="qf-explanation" style="min-height:60px;">${existing ? (existing.explanation||'') : ''}</textarea>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveQuestion('${quizId}', ${existing ? existing.id : 'null'})">${existing ? 'Save Changes' : 'Add Question'}</button>
    </div>
  `;
}

function setCorrect(i) {
  document.getElementById('qf-correct').value = i;
  for (let j=0;j<4;j++) {
    const btn = document.getElementById(`correct-dot-${j}`);
    if (btn) { btn.style.background = j===i?'var(--accent)':'transparent'; btn.style.borderColor = j===i?'var(--accent)':'var(--border2)'; }
  }
}

function saveQuestion(quizId, qId) {
  const quiz = store.quizzes.find(q=>q.id===quizId);
  const text = v('qf-text');
  const options = [v('qf-opt-0'),v('qf-opt-1'),v('qf-opt-2'),v('qf-opt-3')];
  const correct = parseInt(v('qf-correct'));
  const explanation = v('qf-explanation');
  if (!text || options.some(o=>!o)) return toast('Please fill in the question and all 4 options','error');
  if (qId === null) {
    const newId = quiz.questions.length ? Math.max(...quiz.questions.map(q=>q.id)) + 1 : 1;
    quiz.questions.push({ id:newId, text, options, correct, explanation });
    toast('Question added!','success');
  } else {
    const q = quiz.questions.find(q=>q.id===qId);
    Object.assign(q, { text, options, correct, explanation });
    toast('Question updated!','success');
  }
  closeModal(); renderAdminDashboard();
}

function deleteQuestion(quizId, qId) {
  const quiz = store.quizzes.find(q=>q.id===quizId);
  quiz.questions = quiz.questions.filter(q=>q.id!==qId);
  renderAdminDashboard(); toast('Question removed.','success');
}

// ============================================================
//  STUDENT LOBBY
// ============================================================
function renderStudentLobby() {
  const el = document.getElementById('quiz-list');
  if (!store.quizzes.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📋</div><p>No quizzes available. Ask your admin to create some!</p></div>`;
    return;
  }
  el.innerHTML = store.quizzes.map(quiz => {
    const diffBadge = quiz.difficulty === 'easy' ? 'badge-green' : quiz.difficulty === 'hard' ? 'badge-red' : 'badge-yellow';
    return `
      <div class="card" style="margin-bottom:1rem; display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap;">
        <div style="flex:1; min-width:200px;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem; flex-wrap:wrap;">
            <span class="badge badge-purple">${quiz.topic}</span>
            <span class="badge ${diffBadge}">${DIFF[quiz.difficulty]}</span>
          </div>
          <h3 style="font-family:var(--serif); font-size:1.1rem; font-weight:600; margin-bottom:0.3rem;">${quiz.title}</h3>
          <p style="font-size:0.85rem; color:var(--muted); line-height:1.6; margin-bottom:0.75rem;">${quiz.description}</p>
          <div style="display:flex; gap:1rem; font-size:0.82rem; color:var(--muted);">
            <span>📝 ${quiz.questions.length} questions</span>
            <span>⏱ ${quiz.timeLimit} min</span>
          </div>
        </div>
        <button class="btn btn-primary" onclick="startQuizById('${quiz.id}')" ${quiz.questions.length===0?'disabled title="No questions yet"':''}>
          Start Quiz →
        </button>
      </div>
    `;
  }).join('');
}

// ============================================================
//  QUIZ ENGINE
// ============================================================
function startQuizById(qid) {
  store.currentQuiz = store.quizzes.find(q=>q.id===qid);
  startQuiz();
}

function startQuiz() {
  const quiz = store.currentQuiz;
  store.userAnswers = {};
  store.currentQ = 0;
  goTo('screen-quiz');
  document.getElementById('quiz-nav-title').textContent = quiz.title;
  renderPillNav();
  renderQuestion();
  startTimer(quiz.timeLimit * 60);
}

function renderQuestion() {
  const quiz = store.currentQuiz;
  const q = quiz.questions[store.currentQ];
  const total = quiz.questions.length;
  const pct = Math.round((store.currentQ / total) * 100);

  document.getElementById('q-progress-label').textContent = `Question ${store.currentQ+1} of ${total}`;
  document.getElementById('q-progress-pct').textContent = pct + '%';
  document.getElementById('q-progress-bar').style.width = pct + '%';
  document.getElementById('q-topic').textContent = quiz.topic;
  document.getElementById('q-difficulty').textContent = DIFF[quiz.difficulty];
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('q-explanation').style.display = 'none';
  document.getElementById('btn-prev').style.visibility = store.currentQ === 0 ? 'hidden' : 'visible';
  document.getElementById('btn-next').textContent = store.currentQ === total-1 ? 'Submit Quiz ✓' : 'Next Question →';
  document.getElementById('btn-next').onclick = store.currentQ === total-1 ? submitQuiz : nextQ;

  const optEl = document.getElementById('q-options');
  optEl.innerHTML = q.options.map((opt,i) => `
    <button class="option-btn ${store.userAnswers[q.id]===i?'selected':''}" onclick="selectOption(${i})" id="opt-${i}">
      <span class="option-letter">${LETTERS[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');

  // Animate card
  const card = document.getElementById('q-card');
  card.style.animation = 'none'; card.offsetHeight; card.style.animation = 'fadeUp 0.3s ease both';
  updatePills();
}

function selectOption(i) {
  const q = store.currentQuiz.questions[store.currentQ];
  store.userAnswers[q.id] = i;
  document.querySelectorAll('.option-btn').forEach((btn,idx) => {
    btn.classList.toggle('selected', idx===i);
    btn.querySelector('.option-letter').style.background = idx===i ? 'var(--accent2)' : '';
  });
  updatePills();
}

function nextQ() {
  if (store.currentQ < store.currentQuiz.questions.length - 1) {
    store.currentQ++;
    renderQuestion();
  }
}
function prevQ() {
  if (store.currentQ > 0) { store.currentQ--; renderQuestion(); }
}

function renderPillNav() {
  const el = document.getElementById('pill-nav');
  el.innerHTML = store.currentQuiz.questions.map((q,i) => `
    <button class="pill" id="pill-${i}" onclick="jumpTo(${i})">${i+1}</button>
  `).join('');
}
function updatePills() {
  store.currentQuiz.questions.forEach((q,i) => {
    const pill = document.getElementById(`pill-${i}`);
    if (!pill) return;
    pill.className = 'pill';
    if (i === store.currentQ) pill.classList.add('current');
    else if (store.userAnswers[q.id] !== undefined) pill.classList.add('answered');
  });
}
function jumpTo(i) { store.currentQ = i; renderQuestion(); }

// ============================================================
//  TIMER
// ============================================================
function startTimer(seconds) {
  if (store.timerInterval) clearInterval(store.timerInterval);
  store.timerSecondsLeft = seconds;
  store.timerTotal = seconds;
  updateTimerDisplay();
  store.timerInterval = setInterval(() => {
    store.timerSecondsLeft--;
    updateTimerDisplay();
    if (store.timerSecondsLeft <= 0) { clearInterval(store.timerInterval); submitQuiz(true); }
  }, 1000);
}

function updateTimerDisplay() {
  const s = store.timerSecondsLeft;
  const m = Math.floor(s/60), sec = s%60;
  const display = document.getElementById('timer-display');
  const circle = document.getElementById('timer-circle');
  if (!display || !circle) return;
  display.textContent = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  const ratio = s / store.timerTotal;
  const circum = 238.76;
  circle.style.strokeDashoffset = circum * (1-ratio);
  const color = ratio > 0.5 ? 'var(--accent)' : ratio > 0.25 ? 'var(--yellow)' : 'var(--red)';
  circle.style.stroke = color;
  if (display) display.style.color = ratio <= 0.25 ? 'var(--red)' : 'var(--text)';
}

function stopTimer() { if (store.timerInterval) { clearInterval(store.timerInterval); store.timerInterval = null; } }

// ============================================================
//  QUIZ SUBMIT & RESULTS
// ============================================================
function confirmQuit() {
  openModal(`
    <div class="modal-title">Quit Quiz?</div>
    <p class="body" style="margin-bottom:1.5rem;">Your progress will be lost. Are you sure?</p>
    <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
      <button class="btn btn-ghost" onclick="closeModal()">Continue Quiz</button>
      <button class="btn btn-danger" onclick="closeModal(); stopTimer(); goTo('screen-student'); renderStudentLobby();">Quit</button>
    </div>
  `);
}

function submitQuiz(timeout = false) {
  stopTimer();
  const quiz = store.currentQuiz;
  const questions = quiz.questions;
  let correct = 0;
  const results = questions.map(q => {
    const userAns = store.userAnswers[q.id];
    const isCorrect = userAns === q.correct;
    if (isCorrect) correct++;
    return { ...q, userAnswer: userAns, isCorrect };
  });
  const score = Math.round((correct / questions.length) * 100);
  const timeTaken = quiz.timeLimit * 60 - store.timerSecondsLeft;
  renderResults(results, correct, score, timeTaken, timeout);
}

function renderResults(results, correct, score, timeTaken, timeout) {
  goTo('screen-result');
  const min = Math.floor(timeTaken/60), sec = timeTaken%60;
  const grade = score >= 90 ? { label:'Excellent!', color:'var(--accent)', emoji:'🏆' }
    : score >= 75 ? { label:'Great Job!', color:'var(--accent4)', emoji:'🎉' }
    : score >= 50 ? { label:'Good Try!', color:'var(--yellow)', emoji:'👍' }
    : { label:'Keep Practicing', color:'var(--red)', emoji:'💪' };

  const el = document.getElementById('result-content');
  el.innerHTML = `
    <div style="text-align:center; margin-bottom:2.5rem;">
      ${timeout ? '<div class="badge badge-red" style="margin-bottom:1rem; display:inline-flex;">⏰ Time\'s up!</div>' : ''}
      <div class="score-circle" style="border-color:${grade.color}40; box-shadow:0 0 40px ${grade.color}20;">
        <div style="font-size:2rem; margin-bottom:2px;">${grade.emoji}</div>
        <div class="score-num" style="color:${grade.color};">${score}%</div>
        <div class="score-denom">${correct}/${results.length}</div>
      </div>
      <h2 class="heading" style="margin-bottom:0.4rem;">${grade.label}</h2>
      <p class="body">on <strong style="color:var(--text);">${store.currentQuiz.title}</strong></p>

      <div class="grid-3" style="max-width:440px; margin:1.5rem auto;">
        <div class="stat"><div class="stat-val" style="color:var(--accent4);">${correct}</div><div class="stat-label">Correct</div></div>
        <div class="stat"><div class="stat-val" style="color:var(--red);">${results.length-correct}</div><div class="stat-label">Wrong</div></div>
        <div class="stat"><div class="stat-val">${min}:${String(sec).padStart(2,'0')}</div><div class="stat-label">Time taken</div></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:1rem;">
      <div class="label" style="margin-bottom:1rem;">Answer Review</div>
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${results.map((r,i) => `
          <div style="padding-bottom:1rem; ${i<results.length-1?'border-bottom:1px solid var(--border);':''}">
            <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--muted); font-family:var(--serif);">Q${i+1}</span>
              <span class="badge ${r.isCorrect?'badge-green':'badge-red'}">${r.isCorrect?'✓ Correct':'✗ Wrong'}</span>
              ${r.userAnswer === undefined ? '<span class="badge badge-yellow">Skipped</span>' : ''}
            </div>
            <p style="font-size:0.9rem; font-weight:500; margin-bottom:0.6rem; line-height:1.5;">${r.text}</p>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              ${r.options.map((opt,idx) => `
                <span style="font-size:0.78rem; padding:4px 10px; border-radius:8px; background:${
                  idx===r.correct ? 'rgba(94,207,181,0.15)' : (idx===r.userAnswer && !r.isCorrect ? 'rgba(240,90,90,0.1)' : 'var(--surface2)')
                }; color:${
                  idx===r.correct ? 'var(--accent4)' : (idx===r.userAnswer && !r.isCorrect ? 'var(--red)' : 'var(--muted)')
                }; border:1px solid ${
                  idx===r.correct ? 'rgba(94,207,181,0.3)' : (idx===r.userAnswer && !r.isCorrect ? 'rgba(240,90,90,0.2)' : 'var(--border)')
                };">
                  ${idx===r.correct?'✓ ':''}${idx===r.userAnswer && !r.isCorrect?'✗ ':''}${LETTERS[idx]}. ${opt}
                </span>
              `).join('')}
            </div>
            ${r.explanation ? `<div style="margin-top:0.6rem; padding:0.6rem 0.8rem; border-radius:8px; background:rgba(94,207,181,0.05); border:1px solid rgba(94,207,181,0.15); font-size:0.82rem; color:var(--muted); line-height:1.6;"><strong style="color:var(--accent4);">💡 </strong>${r.explanation}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center;">
      <button class="btn btn-primary btn-lg" onclick="retryQuiz()">Retry Quiz</button>
      <button class="btn btn-secondary btn-lg" onclick="goTo('screen-student'); renderStudentLobby();">All Quizzes</button>
    </div>
  `;
}

function retryQuiz() { startQuiz(); }

// ============================================================
//  MODAL
// ============================================================
function openModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-backdrop').style.display = 'flex';
}
function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-backdrop')) {
    document.getElementById('modal-backdrop').style.display = 'none';
  }
}

// ============================================================
//  TOAST
// ============================================================
function toast(msg, type='success') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type==='success'?'✓':'⚠'}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(()=>t.remove(), 300); }, 2800);
}

// ============================================================
//  UTILS
// ============================================================
function v(id) { return document.getElementById(id)?.value?.trim() || ''; }