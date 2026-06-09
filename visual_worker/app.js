const services = [
  ["Registry", ":10000"],
  ["Customer Agent", ":10100"],
  ["Law Agent", ":10101"],
  ["Tax Agent", ":10102"],
  ["Compliance Agent", ":10103"],
];

const steps = [
  ["Customer Agent", "Receive request & start ReAct loop", 0.5, "customer", "Customer Agent"],
  ["Customer Agent", "LLM decides: call delegate_to_legal_agent tool", 2.0, "customer", "Customer Agent"],
  ["Customer Agent", "discover('legal_question') → Registry", 0.1, "customer", "Registry"],
  ["Law Agent", "Receive delegation (depth=1)", 6.0, "law", "Law Agent"],
  ["Law Agent", "[analyze_law] LLM: contract/tort analysis", 0.1, "law", "Law Agent"],
  ["Law Agent", "[check_routing] keyword match → needs_tax + needs_compliance", 0.2, "law", "Law Agent"],
  ["Tax Agent", "[parallel] Receive delegation (depth=2)", 0.2, "", "Tax Agent"],
  ["Compliance Agent", "[parallel] Receive delegation (depth=2)", 5.0, "", "Compliance Agent"],
  ["Tax Agent", "[parallel] LLM: tax law analysis", 5.0, "", "Tax Agent"],
  ["Compliance Agent", "[parallel] LLM: compliance analysis", 5.0, "", "Compliance Agent"],
  ["Law Agent", "[aggregate] LLM: synthesise all analyses → final_answer", 0.3, "law", "Aggregate"],
  ["Customer Agent", "Extract AIMessage, build artifact", 0.1, "customer", "Customer Agent"],
  ["Customer Agent", "Return final response to User", 0.1, "customer", "User"],
];

const answer = `### 1. Legal and Regulatory Exposure
The company may face SEC enforcement for inaccurate or delayed reporting, including civil penalties, injunctions, and mandated remediation. Executives may also face individual liability when failures involve knowing misstatements or weak internal controls.

### 2. Compliance Risks
The Compliance Agent would flag SOX internal-control issues, board oversight gaps, whistleblower exposure, and a higher chance of regulator monitoring or settlement obligations.

### 3. Reputational Risks
**Loss of Investor Confidence:** violations can erode trust, leading to stock-price pressure and difficulty raising capital.

**Negative Media Coverage:** increased scrutiny can harm customer relationships and overall market positioning.

### 4. Operational Next Steps
Preserve records, conduct an internal investigation, remediate disclosure controls, consider voluntary disclosure, and consult licensed counsel before communicating with regulators.`;

const serviceGrid = document.querySelector("#service-grid");
const timeline = document.querySelector("#timeline");
const run = document.querySelector("#run");
const fast = document.querySelector("#fast");
const speedLabel = document.querySelector("#speed-label");
const progressBar = document.querySelector("#progress-bar");
const totalTime = document.querySelector("#total-time");
const answerCard = document.querySelector("#answer-card");
const answerBox = document.querySelector("#answer-box");
const latency = document.querySelector("#latency");
const question = document.querySelector("#question");
let activeIndex = -1;
let running = false;
let timers = [];

function renderServices() {
  serviceGrid.innerHTML = services.map(([name, port]) => `
    <div class="service">
      <div>
        <div class="dot"></div>
        <strong>${name}</strong>
        <span>${port}</span>
      </div>
    </div>
  `).join("");
}

function renderTimeline() {
  timeline.innerHTML = steps.map(([agent, action, duration, kind], index) => {
    const status = index < activeIndex ? "Completed" : index === activeIndex ? "Running" : "Pending";
    const rowClass = index < activeIndex ? "done" : index === activeIndex ? "running" : "";
    const badgeClass = index < activeIndex ? "completed" : index === activeIndex ? "running" : "";
    return `
      <div class="timeline-row ${rowClass}">
        <span class="agent ${kind}">${agent}</span>
        <span class="action-text">${action}</span>
        <span class="badge ${badgeClass}">${status}</span>
        <span class="duration">${index <= activeIndex ? duration.toFixed(2) + "s" : "-"}</span>
      </div>
    `;
  }).join("");
  const completed = Math.max(0, activeIndex);
  const pct = Math.min(100, (completed / steps.length) * 100);
  progressBar.style.width = `${pct}%`;
  const total = steps.slice(0, Math.max(0, activeIndex)).reduce((sum, item) => sum + item[2], 0);
  totalTime.textContent = `Total ${total.toFixed(2)}s`;
  latency.textContent = `Total latency: ${total.toFixed(2)}s`;
  highlightTopology(activeIndex >= 0 ? steps[Math.min(activeIndex, steps.length - 1)][4] : "");
}

function highlightTopology(name) {
  document.querySelectorAll(".top-node").forEach((node) => {
    node.classList.toggle("active", node.dataset.agent === name);
  });
}

function setComplete() {
  activeIndex = steps.length;
  renderTimeline();
  progressBar.style.width = "100%";
  const total = steps.reduce((sum, item) => sum + item[2], 0);
  totalTime.textContent = `Total ${total.toFixed(2)}s`;
  latency.textContent = `Total latency: ${total.toFixed(2)}s`;
  answerCard.classList.add("visible");
  answerBox.textContent = answer;
  run.textContent = "Run Stage 5 Demo";
  running = false;
  highlightTopology("Aggregate");
}

function reset() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
  activeIndex = -1;
  answerCard.classList.remove("visible");
  answerBox.textContent = "";
  renderTimeline();
}

function startDemo() {
  if (running) {
    reset();
    run.textContent = "Run Stage 5 Demo";
    running = false;
    return;
  }

  reset();
  running = true;
  run.textContent = "Stop Demo";
  const scale = fast.checked ? 110 : 820;
  let delay = 0;

  steps.forEach((step, index) => {
    delay += Math.max(120, step[2] * scale);
    const timer = setTimeout(() => {
      activeIndex = index;
      renderTimeline();
      if (index === steps.length - 1) {
        const doneTimer = setTimeout(setComplete, Math.max(200, scale * 0.4));
        timers.push(doneTimer);
      }
    }, delay);
    timers.push(timer);
  });
}

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => {
    question.value = button.dataset.question;
  });
});

fast.addEventListener("change", () => {
  speedLabel.textContent = fast.checked ? "Fast speed (~6s)" : "Normal speed (~16s)";
});

document.querySelector("#refresh").addEventListener("click", () => {
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.animate(
      [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.8)", opacity: 0.65 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 520, easing: "ease-out" }
    );
  });
});

run.addEventListener("click", startDemo);

renderServices();
renderTimeline();
