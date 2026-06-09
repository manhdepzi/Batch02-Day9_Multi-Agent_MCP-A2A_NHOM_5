"""Bai Tap 2: Them Tools va Knowledge Base.

Hoan thanh cac TODO de them tool va knowledge base entry moi.
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool

from common.llm import get_llm

# Knowledge base
LEGAL_KNOWLEDGE = [
    {
        "id": "ucc_breach",
        "keywords": ["breach", "contract", "remedies", "damages", "ucc"],
        "text": (
            "Under the Uniform Commercial Code (UCC) Article 2, remedies for breach of contract "
            "include: (1) expectation damages; (2) consequential damages; (3) specific performance; "
            "(4) cover damages. Statute of limitations is typically 4 years (UCC Section 2-725)."
        ),
    },
    {
        "id": "labor_law",
        "keywords": [
            "lao dong",
            "sa thai",
            "hop dong lao dong",
            "labor",
            "termination",
        ],
        "text": (
            "Theo Bo luat Lao dong Viet Nam 2019, nguoi su dung lao dong co the don phuong "
            "cham dut hop dong trong mot so truong hop nhu: nguoi lao dong thuong xuyen khong "
            "hoan thanh cong viec; bi om dau, tai nan da dieu tri trong thoi gian dai ma chua "
            "hoi phuc; do thien tai, hoa hoan, dich benh hoac ly do bat kha khang; hoac nguoi "
            "lao dong du tuoi nghi huu theo quy dinh."
        ),
    },
]


@tool
def search_legal_knowledge(query: str) -> str:
    """Tim kiem trong knowledge base phap ly."""
    query_lower = query.lower()
    for entry in LEGAL_KNOWLEDGE:
        if any(kw in query_lower for kw in entry["keywords"]):
            return f"[{entry['id']}] {entry['text']}"
    return "Khong tim thay thong tin lien quan."


@tool
def check_statute_of_limitations(case_type: str) -> str:
    """Kiem tra thoi hieu khoi kien theo loai vu an.

    Args:
        case_type: Loai vu an, vi du: contract, tort, property, labor.
    """
    limits = {
        "contract": "4 nam doi voi hop dong mua ban hang hoa theo UCC Section 2-725.",
        "breach": "4 nam doi voi vi pham hop dong mua ban hang hoa theo UCC Section 2-725.",
        "tort": "2-3 nam tuy bang va tuy loai hanh vi gay thiet hai.",
        "property": "5 nam, tuy quyen tai san va phap luat ap dung.",
        "labor": "Can xac dinh loai tranh chap lao dong cu the de ap dung thoi hieu phu hop.",
    }

    case_type_lower = case_type.lower()
    for keyword, limit in limits.items():
        if keyword in case_type_lower:
            return limit
    return "Khong xac dinh. Can cung cap loai vu an cu the hon."


async def main():
    load_dotenv()
    llm = get_llm()

    tools = [search_legal_knowledge, check_statute_of_limitations]
    llm_with_tools = llm.bind_tools(tools)

    question = "Thoi hieu khoi kien vu vi pham hop dong la bao lau?"

    messages = [
        SystemMessage(
            content=(
                "Ban la chuyen gia phap ly. Su dung tools de tra cuu thong tin "
                "truoc khi tra loi."
            )
        ),
        HumanMessage(content=question),
    ]

    print(f"Cau hoi: {question}\n")

    # First LLM call - decide which tools to use
    response = await llm_with_tools.ainvoke(messages)
    messages.append(response)

    # Execute tools if requested
    if response.tool_calls:
        for tool_call in response.tool_calls:
            print(f"Tool duoc goi: {tool_call['name']}")
            tool_result = None

            if tool_call["name"] == "search_legal_knowledge":
                tool_result = search_legal_knowledge.invoke(tool_call["args"])
            elif tool_call["name"] == "check_statute_of_limitations":
                tool_result = check_statute_of_limitations.invoke(tool_call["args"])

            if tool_result:
                messages.append(
                    ToolMessage(content=tool_result, tool_call_id=tool_call["id"])
                )

        # Second LLM call - synthesize final answer
        final_response = await llm_with_tools.ainvoke(messages)
        print(f"\nKet qua:\n{final_response.content}")
    else:
        print(f"\nKet qua:\n{response.content}")


if __name__ == "__main__":
    asyncio.run(main())
