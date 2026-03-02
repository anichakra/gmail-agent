# Open Email Agent

A modern, sleek email agent powered by Composio Tool Router and Auth Links. Ask questions about your emails using natural language and get intelligent responses powered by advanced LLMs like Gemini, GPT-4o, or Claude.

## ✨ Features

- 🔐 **Secure Gmail Authentication** via Composio Auth Links
- 💬 **Natural Language Interface** - Chat with your inbox using plain English
- 🤖 **AI-Powered Assistant** - Multi-model support (Gemini, GPT-4o, Claude) for intelligent email management
- 🎨 **Modern Dark UI** - Beautiful, minimalist interface design with Next.js 16
- 📨 **Email Operations** - Search, read, reply, and manage emails via chat
- 🔄 **Real-time Streaming** - Get responses as they're generated
- 🛡️ **Secure & Private** - Your data stays with you

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **React Markdown** - Message formatting

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.12+** - Backend runtime
- **Composio** - AI agent orchestration and Gmail integration
- **Uvicorn** - ASGI server
- **uv** - Python package management

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **Python** 3.12 or higher
- **uv** (Recommended Python package manager: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **API Keys**:
  - **Composio API Key** ([Get one here](https://composio.dev))
  - **LLM API Key**: One of `GOOGLE_API_KEY`, `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY`.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anichakra/gmail-agent.git
   cd open-email-assistant
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   The project uses `uv` for efficient Python dependency management. Run:
   ```bash
   npm run install:backend
   ```
   *Alternatively, you can manually run `cd backend && uv sync`.*

4. **Set up environment variables:**
   
   Create a `.env` file in the **root directory** (not the backend directory):
   ```env
   # LLM Provider Configuration (Choose one)
   GOOGLE_API_KEY=your_google_api_key_here
   # OPENAI_API_KEY=your_openai_api_key_here
   # ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Composio Configuration
   COMPOSIO_API_KEY=your_composio_api_key_here
   AUTH_CONFIG_ID=your_composio_auth_config_id_here

   # Model Selection
   MODEL_PROVIDER=google_genai          # options: openai | anthropic | google_genai
   MODEL_NAME=gemini-3-flash-preview    # e.g., gpt-4o | claude-3-5-sonnet-20240620

   # Frontend Configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # Other Backend Settings
   DEBUG=true
   ENVIRONMENT=dev
   ```

### Running the Application

**Run everything together (Recommended)**
```bash
npm run dev
```
This starts both the Next.js frontend (port 3000) and the FastAPI backend (port 8000) concurrently.

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 📖 How to Use

1. **Sign In:** Enter your Gmail address in the interface.
2. **Authenticate:** Complete the Gmail OAuth flow via the provided Composio link.
3. **Start Chatting:** Ask questions like:
   - "Show me unread emails from this week"
   - "Find invoice from Stripe"
   - "Summarize my recent conversations with John"
   - "Reply to the last email from John saying I'm interested"
4. **Get Results:** The AI agent will search your emails and respond naturally.

## Project Structure

```
open-email-assistant/
├── app/                          # Next.js frontend
├── backend/                     # FastAPI backend
│   ├── app/                    # Application modules
│   │   ├── api/routes/         # API routes
│   │   ├── config/             # Configuration
│   │   └── models/             # Pydantic models
│   ├── core/                   # Core business logic
│   │   ├── agent.py           # AI agent service
│   │   ├── connection.py      # Composio connection management
│   │   ├── tools.py           # Email tools service
│   │   └── constants.py       # Application constants
│   ├── main.py                # FastAPI application entry point
│   └── pyproject.toml         # Python dependencies
├── .env                         # Environment variables (Root)
├── package.json               # Node.js dependencies & scripts
└── README.md                 # This file
```

## 🏗️ Architecture

- **Clean Architecture** - Separation of concerns between frontend, API routes, and core logic.
- **Service Layer Pattern** - Business logic isolated from API endpoints.
- **Unified Startup** - Uses `concurrently` to manage both Node.js and Python processes.
- **Modern Python** - Managed by `uv` for lightning-fast environment setup and dependency resolution.

## 📝 Available Commands

```bash
# Development
npm run dev              # Run both frontend and backend concurrently
npm run dev:frontend     # Frontend only (Next.js)
npm run dev:backend      # Backend only (FastAPI via uv)

# Production
npm run build            # Build frontend for production
npm run start            # Start production frontend server

# Dependencies
npm install              # Install Node.js dependencies
npm run install:backend  # Install Python dependencies using uv
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Composio](https://composio.dev) - AI agent orchestration
- [Google Gemini / OpenAI / Anthropic](https://openai.com) - Language models
- [Next.js](https://nextjs.org) - React framework
- [FastAPI](https://fastapi.tiangolo.com) - Python web framework
