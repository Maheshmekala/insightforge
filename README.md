# 📊 InsightForge — AI-Powered Analytics & BI Platform

> **"A unified analytics platform that converts natural language questions into SQL, generates AI-powered insights, and integrates with Tableau — connecting any database through a single interface."**

## 🎯 Overview

InsightForge is an enterprise analytics platform that bridges the gap between **plain English questions** and **data-driven answers**. It combines a **Natural Language to SQL engine** powered by Groq's Llama 3.3, a **flexible Data Source Manager** that abstracts JDBC connections (PostgreSQL, Oracle, Snowflake, H2), **Tableau integration** for visualization, and **AI-generated insights** that automatically analyze query results.

The core workflow: **Ask in English → LLM generates SQL → Execute against database → Display results with auto-charts + AI insights.**

## ✨ Key Features

| Feature | Description | Real AI? |
|---------|-------------|----------|
| **🗣️ NL-to-SQL Engine** | Type "Show top 10 suppliers by spend" → LLM generates `SELECT name, annual_spend FROM suppliers ORDER BY annual_spend DESC LIMIT 10` | ✅ Groq LLM |
| **📊 Auto Charting** | Query results automatically render as bar charts or pie charts | ✅ Smart Detection |
| **🤖 AI Insights** | After query execution, LLM analyzes results and writes natural language business insights | ✅ Groq LLM |
| **🔌 Data Source Manager** | Abstract JDBC layer for PostgreSQL, Oracle, Snowflake, and H2 | ✅ Enterprise Pattern |
| **📈 Tableau Integration** | REST API to list workbooks, embed Tableau dashboards | ✅ Ready |
| **💻 SQL Mode** | Write raw SQL, execute against connected databases, view results | ✅ Always |
| **📋 Schema Discovery** | Automatically discovers tables, columns, and row counts from connected databases | ✅ Metadata |

## 🏗️ Architecture

```
┌─────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  React 19   │────▶│  Spring Boot 3    │────▶│  H2/PostgreSQL  │
│  TypeScript │     │  Java 21          │     │  Oracle/Snowflake│
│  Vite       │◀────│  REST APIs        │◀────│                 │
└─────────────┘     └─────────┬─────────┘     └─────────────────┘
                              │
                     ┌────────▼────────┐
                     │  Groq Llama 3.3 │
                     │  70B            │
                     └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │  NL-to-SQL  │  │ AI Insights │  │  Data Source │
     │  Engine     │  │ Generator   │  │  Manager     │
     └─────────────┘  └─────────────┘  └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Java 21+** (JDK)
- **Node.js 20+**
- **Docker Desktop** (or use Maven directly)
- **Groq API Key** (free — already configured)

### Run with Docker (One Command)

```bash
cd insightforge
docker compose up -d --build
```

### Run Locally (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Access
| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3001 | React UI (Dashboard, Query, Data Sources) |
| **Backend API** | http://localhost:8081 | REST API endpoints |
| **Health Check** | http://localhost:8081/api/health | Backend status |

## 💬 Try These Queries

Open the AI Query page and type:

| Natural Language | Generated SQL |
|-----------------|---------------|
| *"Show me top suppliers by spend"* | `SELECT name, annual_spend FROM suppliers ORDER BY annual_spend DESC` |
| *"Group suppliers by category"* | `SELECT category, COUNT(*), SUM(annual_spend) FROM suppliers GROUP BY category` |
| *"Find high risk suppliers"* | `SELECT * FROM suppliers WHERE risk_score >= 70 ORDER BY risk_score DESC` |
| *"Show me all contracts"* | `SELECT * FROM contracts ORDER BY end_date DESC` |
| *"How many suppliers in each category?"* | `SELECT category, COUNT(*) as count FROM suppliers GROUP BY category` |

Each query:
1. ✅ **LLM generates SQL** from natural language
2. ✅ **Executes SQL** against the database
3. ✅ **Shows results** in a data table
4. ✅ **Auto-renders chart** (bar/pie) based on data shape
5. ✅ **Generates AI insight** about the results

## 📡 API Endpoints

### AI Query
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/query/nl` | Natural language → SQL conversion |
| `POST` | `/api/query/execute` | Execute SQL and return results with AI insight |
| `GET` | `/api/query/tables` | Discover database schema |

### AI Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/insights/generate` | Generate AI insights from data |
| `POST` | `/api/insights/nlquery` | NL-to-SQL with schema context |

### Tableau Integration
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tableau/workbooks` | List Tableau workbooks |
| `GET` | `/api/tableau/embed/{id}` | Get Tableau embed URL |

## 🧪 Testing

```bash
# Test health
curl http://localhost:8081/api/health

# NL-to-SQL
curl -X POST http://localhost:8081/api/query/nl \
  -H "Content-Type: application/json" \
  -d '{"question":"Show me top suppliers by spend"}'

# Execute SQL
curl -X POST http://localhost:8081/api/query/execute \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT * FROM suppliers ORDER BY annual_spend DESC"}'

# Discover schema
curl http://localhost:8081/api/query/tables
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 21, Spring Boot 3.4, Spring Data JPA, JDBC Template, H2 |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, Recharts |
| **AI/LLM** | Groq Llama 3.3 70B, NL-to-SQL, AI Insight Generation |
| **Database** | H2 (dev), PostgreSQL, Oracle, Snowflake (via DSM) |
| **Integration** | Tableau REST API, JDBC Data Source Manager |
| **Infrastructure** | Docker, Docker Compose, Maven |

## 📊 Interview Talking Points

> *"InsightForge demonstrates my ability to build enterprise analytics platforms with real AI integration. The core innovation is the NL-to-SQL pipeline that uses Groq's Llama 3.3 to convert natural language into executable SQL queries, then automatically renders results as charts with AI-generated business insights. The Data Source Manager abstracts multiple database types behind a unified JDBC interface — a pattern directly applicable to enterprise SaaS platforms that need to support PostgreSQL, Oracle, and Snowflake. This project showcases Java 21 with Spring Boot 3's JDBC Template, React 19 with TypeScript, and real LLM-powered features."*

## 📝 License

MIT
