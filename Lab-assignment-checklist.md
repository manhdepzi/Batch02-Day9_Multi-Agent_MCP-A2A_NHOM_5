# Checklist Assignment Files Day09

## 1. Project

Project folder: `Batch02-Day9_Multi-Agent_MCP-A2A_NHOM_5`

Da hoan thanh cac phan chinh cua bai lab Day09 ve Multi-Agent, MCP/A2A va
pattern Supervisor - Workers.

## 2. Core Multi-Agent A2A Source

- [x] `customer_agent/`: Entry agent nhan cau hoi cua user va delegate sang Law Agent.
- [x] `law_agent/`: Supervisor/Orchestrator phan tich cau hoi, routing va tong hop ket qua.
- [x] `tax_agent/`: Worker xu ly nhanh thue.
- [x] `compliance_agent/`: Worker xu ly nhanh regulatory compliance.
- [x] `registry/`: Registry service cho agent registration va discovery.
- [x] `common/`: A2A client, registry client va LLM helper.
- [x] `test_client.py`: Client dung de test full Stage 5.
- [x] `start_all.sh`: Script khoi dong cac services.

## 3. Supervisor - Workers Pattern

Da cai dat mo hinh:

```text
User
  -> Customer Agent
  -> Registry discover("legal_question")
  -> Law Agent / Supervisor
  -> Parallel Workers
       - Tax Agent
       - Compliance Agent
  -> Aggregate final answer
  -> Return response to User
```

Mapping source:

- Supervisor / Orchestrator: `law_agent/graph.py`
- Worker 1: `tax_agent/graph.py`
- Worker 2: `compliance_agent/graph.py`
- Entry Agent: `customer_agent/graph.py`
- Service Discovery: `registry/__main__.py`

## 4. Exercise Files

- [x] `exercises/exercise_2_tools.py`
  - Da them knowledge base entry `labor_law`.
  - Da them tool `check_statute_of_limitations`.
  - Da bind tools vao LLM va xu ly tool calls.

- [x] `exercises/exercise_4_multiagent.py`
  - Da them `privacy_agent`.
  - Da them routing theo keyword: tax, compliance, privacy/GDPR/data.
  - Da tong hop ket qua tu law, tax, compliance va privacy agents.

## 5. Visual Demo Worker

Visual demo nam tai:

```text
visual_worker/index.html
```

Chuc nang:

- [x] Hien thi trang thai Registry, Customer Agent, Law Agent, Tax Agent, Compliance Agent.
- [x] Cho phep nhap hoac chon sample legal question.
- [x] Hien thi agent topology.
- [x] Chay timeline mo phong tung buoc xu ly.
- [x] Hien thi trang thai `Pending`, `Running`, `Completed`.
- [x] Hien thi final answer sau khi demo hoan tat.
- [x] Co tuy chon `Fast simulation`.

## 6. Latency Stage 5

Da cap nhat `CODELAB.md` voi phan bai tap cong diem Latency Stage 5:

- Baseline hop le: `81.1 seconds`.
- Da de xuat toi uu: dung model nhe hon, gioi han `OPENROUTER_MAX_TOKENS`,
  rut gon prompt, giu parallel delegation.
- Da cap nhat `common/llm.py` de doc `OPENROUTER_MAX_TOKENS`.
- Lan do sau toi uu chua co ket qua hop le do OpenRouter bao loi credit/token limit,
  nen khong tinh so do that bai som lam latency thanh cong.

## 7. How To Run

Install dependencies:

```bash
uv sync
```

Create `.env` from `.env.example` and add API key:

```bash
cp .env.example .env
```

Run all services:

```bash
./start_all.sh
```

Send test request:

```bash
uv run python test_client.py
```

Open visual demo:

```text
visual_worker/index.html
```

## 8. Submission Checklist

- [x] Co source multi-agent A2A.
- [x] Co Customer Agent.
- [x] Co Law Agent dong vai tro supervisor/orchestrator.
- [x] Co Tax Agent worker.
- [x] Co Compliance Agent worker.
- [x] Co Registry service.
- [x] Co luong discovery qua registry.
- [x] Co mo phong parallel worker execution.
- [x] Co bai exercise tools va privacy agent.
- [x] Co visual demo de thuyet trinh/cham bai.
- [x] Co markdown checklist nam trong repo de push len GitHub.

