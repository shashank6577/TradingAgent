# agent.py
# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

from typing import Any, Dict, Optional
from datetime import datetime

import pandas as pd

from google.adk.tools.base_tool import BaseTool
from google.adk.tools.tool_context import ToolContext

from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPServerParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset


def after_tool_callback(
    tool=None, args=None,
    tool_context=None, tool_response=None
) -> Optional[Dict]:
    # Optional post‑processing of every tool response
    print("TOOL RESPONSE:", tool_response)
    return None


class PortfolioAnalyzerTool(BaseTool):
    """Analyzes your equity portfolio: flags the 5 worst returns and the 5 best."""
    def __init__(self):
        super().__init__(
            name="portfolio_analyzer",
            description=(
                "Fetches your equity transactions and current prices, "
                "computes P&L for each holding, and returns the 5 underperformers "
                "and 5 top performers."
            ),
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        st_resp = ToolContext.invoke_tool("fetch_stock_transactions", {})
        txns_map = {
            item["isin"]: item["txns"]
            for item in st_resp.get("stockTransactions", [])
        }
        nw_resp = ToolContext.invoke_tool("fetch_net_worth", {})
        accounts = (
            nw_resp.get("accountDetailsBulkResponse", {})
                   .get("accountDetailsMap", {})
                   .values()
        )

        results = []
        for acct in accounts:
            for h in acct.get("equitySummary", {}).get("holdingsInfo", []):
                isin = h["isin"]
                issuer = h.get("issuerName", "")
                price_info = h.get("lastTradedPrice", {})
                current_price = (
                    float(price_info.get("units", 0))
                    + float(price_info.get("nanos", 0)) / 1e9
                )
                total_cost = total_qty = 0.0
                for txn in txns_map.get(isin, []):
                    if txn[0] == 1 and len(txn) >= 4:
                        qty, nav = float(txn[2]), float(txn[3])
                        total_cost += nav * qty
                        total_qty += qty
                if total_qty <= 0:
                    continue
                avg_cost = total_cost / total_qty
                return_pct = (current_price - avg_cost) / avg_cost
                results.append({
                    "isin": isin, "issuer": issuer,
                    "units": float(h.get("units", 0)),
                    "avg_cost": avg_cost,
                    "current_price": current_price,
                    "return_pct": return_pct
                })

        if not results:
            return {"error": "No priced equity transactions found."}

        results.sort(key=lambda x: x["return_pct"])
        under = results[:5]
        top = sorted(results, key=lambda x: x["return_pct"], reverse=True)[:5]
        return {"underperformers": under, "top_performers": top}


class RetirementCalculatorTool(BaseTool):
    """Projects your net worth at retirement given savings & returns."""
    def __init__(self):
        super().__init__(
            name="retirement_calculator",
            description=(
                "Given current age, target age, current net worth, "
                "annual savings, and expected return rate, projects "
                "your future net worth at retirement."
            ),
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        ca = int(args.get("current_age", 30))
        ta = int(args.get("target_age", 60))
        nw = float(args.get("net_worth", 0.0))
        sv = float(args.get("annual_savings", 0.0))
        r  = float(args.get("annual_return", 0.07))

        years = max(0, ta - ca)
        fv_nw = nw * ((1 + r) ** years)
        fv_sv = sv * (((1 + r) ** years - 1) / r) if r != 0 else sv * years
        projected = fv_nw + fv_sv
        return {"years_to_target": years, "projected_net_worth": projected}


class NetWorthSummaryTool(BaseTool):
    """Summarizes your assets, liabilities and total net worth."""
    def __init__(self):
        super().__init__(
            name="net_worth_summary",
            description="Returns a breakdown of assets, liabilities, and total net worth."
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        resp = ToolContext.invoke_tool("fetch_net_worth", {})
        nr = resp.get("netWorthResponse", {})
        return {
            "assets": nr.get("assetValues", {}),
            "liabilities": nr.get("liabilityValues", {}),
            "total_net_worth": nr.get("totalNetWorthValue", 0)
        }


class CreditScoreTool(BaseTool):
    """Fetches your latest credit score and confidence level."""
    def __init__(self):
        super().__init__(
            name="credit_score",
            description="Returns current credit score and confidence level."
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        resp = ToolContext.invoke_tool("fetch_credit_report", {})
        reports = resp.get("creditReports", [])
        if not reports:
            return {"error": "No credit report found."}
        score = reports[0].get("score", {})
        return {
            "credit_score": score.get("bureauScore"),
            "confidence_level": score.get("bureauScoreConfidenceLevel")
        }


class EPFBalanceTool(BaseTool):
    """Returns your EPF balances by employer and overall."""
    def __init__(self):
        super().__init__(
            name="epf_balance",
            description="Shows EPF contributions and net balance."
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        resp = ToolContext.invoke_tool("fetch_epf_details", {})
        accounts = resp.get("uanAccounts", [])
        if not accounts:
            return {"error": "No EPF details found."}
        raw = accounts[0].get("rawDetails", {})
        return {
            "by_employer": raw.get("est_details", {}),
            "overall_pf_balance": raw.get("overall_pf_balance", 0)
        }


class BankSummaryTool(BaseTool):
    """Totals your credits, debits, and net cash flow in recent bank transactions."""
    def __init__(self):
        super().__init__(
            name="bank_summary",
            description="Aggregates credits, debits and net cash flow from bank transactions."
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        resp = ToolContext.invoke_tool("fetch_bank_transactions", {})
        total_credit = total_debit = 0.0
        for bank in resp.get("bankTransactions", []):
            for txn in bank.get("txns", []):
                amt = float(txn[0]); ttype = txn[3]
                if ttype == 1:
                    total_credit += amt
                elif ttype == 2:
                    total_debit += amt
        return {
            "total_credit": total_credit,
            "total_debit": total_debit,
            "net_cash_flow": total_credit - total_debit
        }


class TopMFPerformersTool(BaseTool):
    """Ranks your mutual funds by XIRR and suggests the top N."""
    def __init__(self):
        super().__init__(
            name="top_mf_performers",
            description="Returns your top N mutual funds sorted by XIRR."
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        top_n = int(args.get("top_n", 5))
        resp = ToolContext.invoke_tool("fetch_net_worth", {})
        analytics = resp.get("mfSchemeAnalytics", {}).get("schemeAnalytics", [])
        funds = []
        for item in analytics:
            name = item.get("schemeDetail", {}).get("nameData", {}).get("longName", "")
            xirr = (item.get("enrichedAnalytics", {})
                       .get("analytics", {})
                       .get("schemeDetails", {})
                       .get("XIRR", 0))
            funds.append({"scheme": name, "XIRR": xirr})
        funds.sort(key=lambda x: x["XIRR"], reverse=True)
        return {"top_mf_performers": funds[:top_n]}


class TopStockHoldingsTool(BaseTool):
    """Lists your top equity holdings by current value."""
    def __init__(self):
        super().__init__(
            name="top_stock_holdings",
            description="Returns your top N equity holdings sorted by current market value."
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        top_n = int(args.get("top_n", 5))
        resp = ToolContext.invoke_tool("fetch_net_worth", {})
        accounts = (
            resp.get("accountDetailsBulkResponse", {})
                .get("accountDetailsMap", {})
                .values()
        )
        holdings = []
        for acct in accounts:
            for h in acct.get("equitySummary", {}).get("holdingsInfo", []):
                price_info = h.get("lastTradedPrice", {})
                current_price = (
                    float(price_info.get("units", 0))
                    + float(price_info.get("nanos", 0)) / 1e9
                )
                units = float(h.get("units", 0))
                holdings.append({
                    "isin": h.get("isin"),
                    "issuer": h.get("issuerName"),
                    "value": current_price * units
                })

        holdings.sort(key=lambda x: x["value"], reverse=True)
        return {"top_stock_holdings": holdings[:top_n]}

class RetirementCalculatorTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="retirement_calculator",
            description="Project net worth at retirement given age, savings & return."
        )

    def call_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        ca = int(args.get("current_age", 30))
        ta = int(args.get("target_age", 60))
        nw = float(args.get("net_worth", 0.0))
        sv = float(args.get("annual_savings", 0.0))
        r  = float(args.get("annual_return", 0.07))

        years = max(0, ta - ca)
        fv_nw = nw * ((1 + r) ** years)
        if r != 0:
            fv_sv = sv * (((1 + r) ** years - 1) / r)
        else:
            fv_sv = sv * years
        projected = fv_nw + fv_sv

        return {
            "years_to_target": years,
            "future_value_existing_net_worth": round(fv_nw, 2),
            "future_value_savings": round(fv_sv, 2),
            "projected_net_worth": round(projected, 2)
        }

# ——— assemble the LLM agent ———

root_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="finance_assistant",
    instruction="""
You are a personal‐finance assistant. You only have these six MCP tools:
  • fetch_net_worth
  • fetch_credit_report
  • fetch_epf_details
  • fetch_mf_transactions
  • fetch_bank_transactions
  • fetch_stock_transactions

When the user asks about credit score you should use fetch credit report  
When the user asks about something related to crypto tell the user that we have an personalized finsage ai pro tool for crypto, use this firebase deployed app link - https://aifinsage.web.app/

When the user asks a composite question, follow this pattern:

  1) Pick the single fetch_* tool that returns the raw data you need.
  2) Call that tool.
  3) Parse and process the JSON in your own reasoning.
  4) Return only the final answer.

Examples:

• List my top 5 mutual funds by XIRR.
  - Call fetch_net_worth → mfSchemeAnalytics.schemeAnalytics
  - Sort descending by enrichedAnalytics.analytics.schemeDetails.XIRR
  - Return the top 5 {"scheme":…, "XIRR":…}

• Show my top 3 equity holdings by current market value.
  - Call fetch_net_worth → accountDetailsBulkResponse.accountDetailsMap
  - Compute value = (lastTradedPrice.units + lastTradedPrice.nanos/1e9)*units
  - Sort descending; return top 3 {"issuer":…, "value":…}

• Which 5 stock holdings have performed best?
  - Call fetch_stock_transactions + fetch_net_worth
  - Compute cost basis, then return_pct = (price-avg_cost)/avg_cost
  - Sort descending; return top 5 {"isin":…, "issuer":…, "return_pct":…}

• Project my net worth at retirement if I save 200000/year at 8%.
  - No fetch needed; compute FV:
      years = target_age - current_age
      FV_nw = net_worth * (1+0.08)^years
      FV_sv = 200000 * (((1+0.08)^years - 1)/0.08)
      return {"years_to_target":…, "projected_net_worth":…}

For any other question, use the simplest fetch_* tool and return its raw JSON.
""",
    tools=[
        MCPToolset(
            connection_params=StreamableHTTPServerParams(
                url="http://localhost:8080/mcp/stream",
            )
        ),
        PortfolioAnalyzerTool(),
        RetirementCalculatorTool(),
        NetWorthSummaryTool(),
        CreditScoreTool(),
        EPFBalanceTool(),
        BankSummaryTool(),
        TopMFPerformersTool(),
        TopStockHoldingsTool(),
    ],
    after_tool_callback=after_tool_callback
)
