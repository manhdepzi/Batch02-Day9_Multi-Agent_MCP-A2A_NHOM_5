const nodes = [
  {
    id: "user",
    view: "overview",
    type: "day9",
    step: "01",
    title: "User Question",
    subtitle: "Legal/drug-law query",
    copy: "Entry input for the combined system. In Day 9, the question reaches the Customer Agent first.",
    status: "Ready",
    files: ["Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/test_client.py"],
    area: "1 / 1 / 2 / 3",
  },
  {
    id: "customer",
    view: "day9",
    type: "day9",
    step: "02",
    title: "Customer Agent",
    subtitle: "Front desk ReAct agent",
    copy: "Uses delegate_to_legal_agent to discover the Law Agent and send the user question through A2A.",
    status: "Ready",
    files: [
      "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/customer_agent/graph.py",
      "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/customer_agent/agent_executor.py",
    ],
    area: "1 / 3 / 2 / 5",
  },
  {
    id: "registry",
    view: "day9",
    type: "day9",
    step: "03",
    title: "Registry",
    subtitle: "Service discovery",
    copy: "FastAPI service stores registered agents and resolves tasks such as legal_question, tax_question, and compliance_question.",
    status: "Ready",
    files: [
      "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/registry/__main__.py",
      "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/common/registry_client.py",
    ],
    area: "1 / 6 / 2 / 8",
  },
  {
    id: "law",
    view: "day9",
    type: "day9",
    step: "04",
    title: "Law Agent",
    subtitle: "StateGraph orchestrator",
    copy: "Runs analyze_law, decides whether tax/compliance specialists are needed, then aggregates specialist outputs.",
    status: "Ready",
    files: ["Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/law_agent/graph.py"],
    area: "2 / 5 / 3 / 8",
  },
  {
    id: "ragbridge",
    view: "integration",
    type: "bridge",
    step: "05",
    title: "RAG Tool Bridge",
    subtitle: "Best integration point",
    copy: "Recommended bridge: expose Day 8 retrieve/generate_with_citation as a LangChain tool and call it inside Law Agent before final aggregation.",
    status: "Bridge",
    files: [
      "2A202600837_Pham_Van_Manh/src/task9_retrieval_pipeline.py",
      "2A202600837_Pham_Van_Manh/src/task10_generation.py",
      "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/law_agent/graph.py",
    ],
    area: "3 / 5 / 4 / 8",
  },
  {
    id: "collect",
    view: "day8",
    type: "todo",
    step: "06",
    title: "Collect + Convert",
    subtitle: "Legal docs and news",
    copy: "Day 8 collects legal PDFs/DOCX and crawled news, then standardizes everything into markdown.",
    status: "TODO scaffold",
    files: [
      "2A202600837_Pham_Van_Manh/src/task1_collect_legal_docs.py",
      "2A202600837_Pham_Van_Manh/src/task2_crawl_news.py",
      "2A202600837_Pham_Van_Manh/src/task3_convert_markdown.py",
    ],
    area: "3 / 1 / 4 / 3",
  },
  {
    id: "index",
    view: "day8",
    type: "todo",
    step: "07",
    title: "Chunk + Index",
    subtitle: "Embeddings/vector store",
    copy: "Loads markdown, chunks documents, embeds chunks, and indexes them into a vector store such as Weaviate.",
    status: "TODO scaffold",
    files: ["2A202600837_Pham_Van_Manh/src/task4_chunking_indexing.py"],
    area: "3 / 3 / 4 / 5",
  },
  {
    id: "retrieve",
    view: "day8",
    type: "todo",
    step: "08",
    title: "Hybrid Retrieve",
    subtitle: "Dense + BM25 + rerank",
    copy: "Combines semantic search, lexical BM25, RRF/cross-encoder reranking, and PageIndex fallback.",
    status: "TODO scaffold",
    files: [
      "2A202600837_Pham_Van_Manh/src/task5_semantic_search.py",
      "2A202600837_Pham_Van_Manh/src/task6_lexical_search.py",
      "2A202600837_Pham_Van_Manh/src/task7_reranking.py",
      "2A202600837_Pham_Van_Manh/src/task8_pageindex_vectorless.py",
      "2A202600837_Pham_Van_Manh/src/task9_retrieval_pipeline.py",
    ],
    area: "4 / 3 / 5 / 6",
  },
  {
    id: "generate",
    view: "day8",
    type: "todo",
    step: "09",
    title: "Citation Answer",
    subtitle: "Context reorder + LLM",
    copy: "Reorders retrieved chunks to avoid lost-in-the-middle, formats sources, and asks the LLM to answer with citations.",
    status: "TODO scaffold",
    files: ["2A202600837_Pham_Van_Manh/src/task10_generation.py"],
    area: "4 / 6 / 5 / 9",
  },
  {
    id: "tax",
    view: "day9",
    type: "day9",
    step: "10",
    title: "Tax Agent",
    subtitle: "Specialist service",
    copy: "A ReAct agent with a tax-law system prompt. Law Agent delegates to it by discovering task tax_question.",
    status: "Ready",
    files: ["Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/tax_agent/graph.py"],
    area: "2 / 8 / 3 / 10",
  },
  {
    id: "compliance",
    view: "day9",
    type: "day9",
    step: "11",
    title: "Compliance Agent",
    subtitle: "Specialist service",
    copy: "A ReAct agent with a regulatory-compliance prompt. Law Agent delegates to it through task compliance_question.",
    status: "Ready",
    files: ["Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/compliance_agent/graph.py"],
    area: "3 / 8 / 4 / 11",
  },
  {
    id: "answer",
    view: "overview",
    type: "bridge",
    step: "12",
    title: "Final Response",
    subtitle: "Aggregated + cited",
    copy: "The target output combines Day 9 specialist orchestration with Day 8 retrieved evidence and citation discipline.",
    status: "Target",
    files: [
      "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/law_agent/graph.py",
      "2A202600837_Pham_Van_Manh/src/task10_generation.py",
    ],
    area: "4 / 10 / 5 / 13",
  },
];

const edges = [
  ["user", "customer"],
  ["customer", "registry"],
  ["registry", "law"],
  ["law", "tax"],
  ["law", "compliance"],
  ["collect", "index"],
  ["index", "retrieve"],
  ["retrieve", "generate"],
  ["generate", "ragbridge"],
  ["ragbridge", "law"],
  ["law", "answer"],
  ["tax", "answer"],
  ["compliance", "answer"],
];

const traceSteps = [
  "User sends a legal question.",
  "Customer Agent receives the request and calls delegate_to_legal_agent.",
  "Registry resolves legal_question to the Law Agent endpoint.",
  "Law Agent performs base legal analysis.",
  "RAG Tool Bridge can call Day 8 retrieval for grounded evidence.",
  "Day 8 hybrid retrieve searches dense, BM25, rerank, and fallback paths.",
  "Citation generation formats retrieved sources for the answer.",
  "Law Agent delegates tax/compliance branches when routing says they are needed.",
  "Tax and Compliance Agents return specialist analysis.",
  "Law Agent aggregates all outputs into the final response.",
];

const mapping = [
  ["Day 8 README", "2A202600837_Pham_Van_Manh/README.md", "Spec"],
  ["Retrieval pipeline", "2A202600837_Pham_Van_Manh/src/task9_retrieval_pipeline.py", "TODO"],
  ["Citation generation", "2A202600837_Pham_Van_Manh/src/task10_generation.py", "TODO"],
  ["Customer Agent", "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/customer_agent/graph.py", "Ready"],
  ["Law Agent graph", "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/law_agent/graph.py", "Ready"],
  ["Registry", "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/registry/__main__.py", "Ready"],
  ["Tax Agent", "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/tax_agent/graph.py", "Ready"],
  ["Compliance Agent", "Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5/compliance_agent/graph.py", "Ready"],
];

const grid = document.querySelector("#flow-grid");
const detailTitle = document.querySelector("#detail-title");
const detailCopy = document.querySelector("#detail-copy");
const detailFiles = document.querySelector("#detail-files");
const detailStatus = document.querySelector("#detail-status");
const trace = document.querySelector("#trace");
const traceStep = document.querySelector("#trace-step");
const playButton = document.querySelector("#play-flow");
const nextButton = document.querySelector("#step-next");
const backButton = document.querySelector("#step-back");
const title = document.querySelector("#view-title");
const mappingTable = document.querySelector("#mapping-table");
let activeView = "overview";
let selectedId = "ragbridge";
let currentStep = -1;
let timer = null;

function renderNodes() {
  grid.innerHTML = "";
  nodes.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `node ${node.type}`;
    button.dataset.id = node.id;
    button.dataset.step = node.step;
    button.style.gridArea = node.area;
    button.innerHTML = `<h4>${node.title}</h4><p>${node.subtitle}</p>`;
    button.addEventListener("click", () => selectNode(node.id));
    grid.appendChild(button);
  });
  requestAnimationFrame(renderEdges);
  applyView();
  selectNode(selectedId);
}

function renderEdges() {
  document.querySelectorAll(".connector").forEach((item) => item.remove());
  const gridBox = grid.getBoundingClientRect();
  edges.forEach(([from, to]) => {
    const fromEl = grid.querySelector(`[data-id="${from}"]`);
    const toEl = grid.querySelector(`[data-id="${to}"]`);
    if (!fromEl || !toEl) return;
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const startX = a.right - gridBox.left;
    const startY = a.top + a.height / 2 - gridBox.top;
    const endX = b.left - gridBox.left;
    const endY = b.top + b.height / 2 - gridBox.top;
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const line = document.createElement("div");
    line.className = "connector";
    line.dataset.edge = `${from}-${to}`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    grid.appendChild(line);
  });
}

function selectNode(id) {
  selectedId = id;
  const node = nodes.find((item) => item.id === id);
  if (!node) return;
  document.querySelectorAll(".node").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.id === id);
  });
  detailTitle.textContent = node.title;
  detailCopy.textContent = node.copy;
  detailStatus.textContent = node.status;
  detailStatus.className = `status-pill ${node.type === "todo" ? "todo" : node.type === "bridge" ? "bridge" : ""}`;
  detailFiles.innerHTML = node.files.map((file) => `<div class="file-chip">${file}</div>`).join("");
}

function applyView() {
  const viewTitles = {
    overview: "End-to-End Legal AI Workflow",
    day8: "Day 8 RAG Pipeline Worker",
    day9: "Day 9 Multi-Agent A2A Network",
    integration: "Integration Blueprint",
  };
  title.textContent = viewTitles[activeView];
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === activeView);
  });
  document.querySelectorAll(".node").forEach((item) => {
    const node = nodes.find((entry) => entry.id === item.dataset.id);
    const visible = activeView === "overview" || node.view === activeView || node.type === "bridge";
    item.classList.toggle("is-dimmed", !visible);
  });
}

function renderTrace() {
  trace.innerHTML = traceSteps.map((step, index) => {
    const current = index === currentStep ? " class=\"is-current\"" : "";
    return `<li${current}>${step}</li>`;
  }).join("");
  traceStep.textContent = currentStep < 0 ? "Idle" : `Step ${currentStep + 1}/${traceSteps.length}`;
}

function setStep(nextStep) {
  currentStep = Math.max(-1, Math.min(traceSteps.length - 1, nextStep));
  renderTrace();
  document.querySelectorAll(".connector").forEach((line, index) => {
    line.classList.toggle("is-active", index <= currentStep);
  });
}

function playFlow() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    playButton.textContent = "Run Flow";
    return;
  }
  setStep(-1);
  playButton.textContent = "Pause";
  timer = setInterval(() => {
    if (currentStep >= traceSteps.length - 1) {
      clearInterval(timer);
      timer = null;
      playButton.textContent = "Run Flow";
      return;
    }
    setStep(currentStep + 1);
  }, 900);
}

function renderMapping() {
  mappingTable.innerHTML = mapping.map(([name, file, status]) => {
    return `<div class="map-row"><strong>${name}</strong><span>${file}</span><span>${status}</span></div>`;
  }).join("");
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activeView = tab.dataset.view;
    applyView();
  });
});

playButton.addEventListener("click", playFlow);
nextButton.addEventListener("click", () => setStep(currentStep + 1));
backButton.addEventListener("click", () => setStep(currentStep - 1));
window.addEventListener("resize", renderEdges);

renderNodes();
renderTrace();
renderMapping();
