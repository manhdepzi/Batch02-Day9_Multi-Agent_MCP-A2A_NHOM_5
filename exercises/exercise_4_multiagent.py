"""Bai Tap 4: Them Privacy Agent vao Multi-Agent System.

Hoan thanh cac TODO de them privacy agent va conditional routing.
"""

import asyncio
import os
import sys
from typing import Annotated, TypedDict

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langgraph.graph import END, START, StateGraph
from langgraph.types import Send

from common.llm import get_llm


def _last_wins(left: str | None, right: str | None) -> str:
    """Reducer: gia tri moi ghi de gia tri cu."""
    return right if right is not None else (left or "")


class State(TypedDict):
    question: str
    law_analysis: Annotated[str, _last_wins]
    tax_analysis: Annotated[str, _last_wins]
    compliance_analysis: Annotated[str, _last_wins]
    privacy_analysis: Annotated[str, _last_wins]
    final_response: str


def law_agent(state: State) -> dict:
    """Agent phan tich phap ly tong quat."""
    llm = get_llm()
    prompt = f"""Ban la chuyen gia phap ly. Phan tich cau hoi sau:

{state['question']}

Tap trung vao: hop dong, trach nhiem dan su, quyen va nghia vu phap ly."""

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"law_analysis": response.content}


def check_routing(state: State) -> dict:
    """Routing checkpoint node.

    Logic chon specialist nam trong route_to_agents de LangGraph co the dispatch
    cac Send object song song.
    """
    return {}


def route_to_agents(state: State) -> list[Send]:
    """Quyet dinh goi agents nao dua tren keyword trong cau hoi."""
    question_lower = state["question"].lower()
    tasks: list[Send] = []

    if any(kw in question_lower for kw in ["tax", "irs", "thue", "thuế"]):
        tasks.append(Send("tax_agent", state))

    if any(
        kw in question_lower
        for kw in ["compliance", "sec", "regulation", "regulatory", "tuan thu", "tuân thủ"]
    ):
        tasks.append(Send("compliance_agent", state))

    if any(
        kw in question_lower
        for kw in ["data", "privacy", "gdpr", "du lieu", "dữ liệu", "breach", "ro ri", "rò rỉ"]
    ):
        tasks.append(Send("privacy_agent", state))

    return tasks if tasks else [Send("aggregate_results", state)]


def tax_agent(state: State) -> dict:
    """Agent chuyen ve thue."""
    llm = get_llm()
    prompt = f"""Ban la chuyen gia thue. Phan tich khia canh thue trong cau hoi:

Cau hoi: {state['question']}
Phan tich phap ly: {state.get('law_analysis', 'N/A')}

Tap trung: IRS, tax evasion, penalties, FBAR, FATCA."""

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"tax_analysis": response.content}


def compliance_agent(state: State) -> dict:
    """Agent chuyen ve compliance."""
    llm = get_llm()
    prompt = f"""Ban la chuyen gia compliance. Phan tich khia canh tuan thu:

Cau hoi: {state['question']}
Phan tich phap ly: {state.get('law_analysis', 'N/A')}

Tap trung: SEC, SOX, FCPA, AML, regulatory violations."""

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"compliance_analysis": response.content}


def privacy_agent(state: State) -> dict:
    """Agent chuyen ve bao ve du lieu ca nhan va GDPR."""
    llm = get_llm()
    prompt = f"""Ban la chuyen gia ve GDPR va luat bao ve du lieu ca nhan.

Cau hoi: {state['question']}
Phan tich phap ly: {state.get('law_analysis', 'N/A')}

Hay phan tich cac van de ve data protection, privacy rights, data breach,
nghia vu thong bao, trach nhiem cua cong ty va muc phat co the phat sinh."""

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"privacy_analysis": response.content}


def aggregate_results(state: State) -> dict:
    """Tong hop ket qua tu tat ca agents."""
    llm = get_llm()

    sections = []
    if state.get("law_analysis"):
        sections.append(f"PHAN TICH PHAP LY:\n{state['law_analysis']}")
    if state.get("tax_analysis"):
        sections.append(f"PHAN TICH THUE:\n{state['tax_analysis']}")
    if state.get("compliance_analysis"):
        sections.append(f"PHAN TICH TUAN THU:\n{state['compliance_analysis']}")
    if state.get("privacy_analysis"):
        sections.append(f"PHAN TICH PRIVACY/GDPR:\n{state['privacy_analysis']}")

    combined = "\n\n".join(sections)

    prompt = f"""Tong hop cac phan tich sau thanh mot bao cao phap ly hoan chinh:

{combined}

Cau hoi goc: {state['question']}

Hay tao mot bao cao ngan gon, co cau truc ro rang."""

    response = llm.invoke([HumanMessage(content=prompt)])
    return {"final_response": response.content}


def build_graph():
    """Xay dung multi-agent graph."""
    graph = StateGraph(State)

    # Add nodes
    graph.add_node("law_agent", law_agent)
    graph.add_node("check_routing", check_routing)
    graph.add_node("tax_agent", tax_agent)
    graph.add_node("compliance_agent", compliance_agent)
    graph.add_node("privacy_agent", privacy_agent)
    graph.add_node("aggregate_results", aggregate_results)

    # Define edges
    graph.add_edge(START, "law_agent")
    graph.add_edge("law_agent", "check_routing")
    graph.add_conditional_edges(
        "check_routing",
        route_to_agents,
        ["tax_agent", "compliance_agent", "privacy_agent", "aggregate_results"],
    )
    graph.add_edge("tax_agent", "aggregate_results")
    graph.add_edge("compliance_agent", "aggregate_results")
    graph.add_edge("privacy_agent", "aggregate_results")
    graph.add_edge("aggregate_results", END)

    return graph.compile()


async def main():
    load_dotenv()

    # Test voi cau hoi co lien quan den privacy
    question = "Neu cong ty bi ro ri du lieu khach hang, hau qua phap ly va thue la gi?"

    print("=" * 70)
    print("MULTI-AGENT SYSTEM voi Privacy Agent")
    print("=" * 70)
    print(f"\nCau hoi: {question}\n")
    print("Dang xu ly qua cac agents...\n")

    graph = build_graph()

    result = await graph.ainvoke(
        {
            "question": question,
            "law_analysis": "",
            "tax_analysis": "",
            "compliance_analysis": "",
            "privacy_analysis": "",
            "final_response": "",
        }
    )

    print("\n" + "=" * 70)
    print("KET QUA CUOI CUNG")
    print("=" * 70)
    print(result["final_response"])
    print("\n" + "=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
