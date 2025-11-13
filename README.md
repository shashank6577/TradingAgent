# TradingAgent

A personal finance and trading assistant powered by the Google AI Developer Kit (ADK) and a custom MCP toolset. Ask natural‑language questions and receive structured insights on net worth, credit reports, investments, transactions, and more.

---

## 🚀 Features

* **Net‑worth**: Retrieve total net worth broken down by asset class (bank, stocks, mutual funds, EPF, etc.)
* **Credit report**: Fetch current credit score and utilization ratio
* **EPF details**: View Employee Provident Fund balance and contribution history
* **Bank transactions**: Summarize credits, debits, and net cash flow over any period
* **Mutual‑fund transactions**: List and analyze buy/sell/redemption activity
* **Stock transactions**: Fetch equity trades, realized P\&L, open positions
* **Composite analyses**: Project future net worth or required savings targets
* **Crypto insights**: Analyze dummy crypto portfolios with Buy/Hold/Sell recommendations
“What’s my total net worth right now, broken down by asset class?”

“Show me my detailed net‑worth summary (assets vs. liabilities).”

“What’s my current credit score and confidence level?”

“What’s my credit utilization ratio (used vs. total limit)?”

“How much have I contributed to EPF, by employer and overall?”

“Summarize my bank transactions this month: total credits, debits, and net cash flow.”

“List all my mutual‑fund transactions in the last year.”

“What are my current equity transactions (buys/sells)?”

“Which 5 mutual funds in my portfolio have the highest XIRR?”

“Show my top 3 equity holdings by current market value.”

“Which 5 stock holdings have performed worst & best over my history?”

“Flag which of my stocks have out‑ or under‑performed the NIFTY in the last 12 months.”

“Project my net worth at retirement if I save ₹200 000/year at 8%, from age 24 to 40.”

“How much do I need to save annually to reach ₹10 million by age 60 at 7%?”

“What was my income vs. expenses over the past 30 days?”
---

## 📋 Prerequisites

* **Python 3.12+**
* **Go 1.20+**
* Unix‑style shell (bash, zsh) or PowerShell (Windows)
* Git installed and a GitHub account

---

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/shashank6577/TradingAgent.git
   cd TradingAgent
   ```

2. **Create & activate a Python virtual environment**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate       # macOS/Linux
   # .venv\Scripts\activate        # Windows PowerShell
   ```

3. **Install Python dependencies**

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Run the MCP tool server** (in a separate terminal)

   ```bash
   cd fi-mcp-dev
   go run .                        # binds to port 8080 by default
   ```

---

## 🔑 Configuration

Set required environment variables before launching the agent:

```bash
export GOOGLE_API_KEY='AIzaSyBIkjwtklCtLFX3TMeqWICyVzjQh0lFibc'
export FI_MCP_PORT=8080
```

> **Security:** Do not commit API keys to source control.

---

## ▶️ Usage

From the project root, launch the ADK web interface:

```bash
# macOS/Linux
.venv/bin/adk web

# Windows PowerShell
.\.venv\Scripts\adk.exe web
```

Open a browser at `http://localhost:8000` and enter prompts such as:

1. “What’s my total net worth right now, broken down by asset class?”
2. “Show me my detailed net‑worth summary (assets vs. liabilities).”
3. “What’s my current credit score and confidence level?”
4. “What’s my credit utilization ratio (used vs. total limit)?”
5. “Summarize my bank transactions this month: total credits, debits, and net cash flow.”
6. “List all my mutual‑fund transactions in the last year.”
7. “What are my current equity transactions (buys/sells)?”
8. “Which five mutual funds in my portfolio have the highest XIRR?”
9. “Show my top three equity holdings by current market value.”
10. “Which five stock holdings have performed worst and best historically?”
11. “Flag which of my stocks have out‑ or under‑performed the NIFTY in the last 12 months.”
12. “Project my net worth at retirement if I save ₹200 000/year at 8%, from age 24 to 40.”
13. “How much do I need to save annually to reach ₹10 million by age 60 at 7%?”
14. “What was my income vs. expenses over the past 30 days?”

---

## 📂 Project Structure

```
TradingAgent/
├── .venv/                   # Python virtual environment
├── cryptoapp/               # React frontend (FinSage Pro)
├── fi-mcp-dev/              # Go‑based MCP tool server
│   └── main.go & pkg/
├── my_mcp_agent/            # ADK agent definition & proxy
│   ├── agent.py
│   └── run_proxy.py
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:

   ```bash
   git commit -m "Add feature"
   ```
4. Push to branch:

   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request

Please adhere to coding standards and ensure all tests pass before requesting review.

---

## 📄 License

Licensed under the **Apache 2.0 License**. See [LICENSE](LICENSE) for details.

---

## 📬 Contact

**Shashank Sharma** • [GitHub @shashank6577](https://github.com/shashank6577) • [your.email@example.com](mailto:your.email@example.com)

Project: [https://github.com/shashank6577/TradingAgent](https://github.com/shashank6577/TradingAgent)
