# Open Email Agent

A modern, sleek email agent powered by Composio Tool Router and Auth Links. Ask questions about your emails using natural language and get intelligent responses powered by GPT-4o.

## ✨ Features

- 🔐 **Secure Gmail Authentication** via Composio Auth Links
- 💬 **Natural Language Interface** - Chat with your inbox using plain English
- 🤖 **AI-Powered Assistant** - GPT-4o integration for intelligent email management
- 🎨 **Modern Dark UI** - Beautiful, minimalist interface design
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
- **OpenAI GPT-4o** - Language model
- **LangChain** - Agent framework
- **Uvicorn** - ASGI server

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **Python** 3.12 or higher
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Composio API Key** ([Get one here](https://composio.dev))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd open-email-assistant
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   # or use uv
   uv sync
   cd ..
   ```

4. **Set up environment variables:**
   
   Create `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   COMPOSIO_API_KEY=your_composio_api_key_here
   DEBUG=true
   ```

### Running the Application

**Option 1: Run everything together (Recommended)**
```bash
npm run dev
```
This starts both frontend (port 3000) and backend (port 8000) concurrently.

**Option 2: Run separately**
```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend (using uv)
cd backend
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 📖 How to Use

1. **Sign In:** Enter your Gmail address
2. **Authenticate:** Complete the Gmail OAuth flow
3. **Start Chatting:** Ask questions like:
   - "Show me unread emails from this week"
   - "Find invoice from Stripe"
   - "What projects do I have coming up?"
   - "Reply to the last email from John"
4. **Get Results:** The AI agent will search your emails and respond naturally

## Project Structure

```
open-email-assistant/
├── app/                          # Next.js frontend
│   ├── components/               # React components
│   │   ├── AuthButton.tsx       # Authentication component
│   │   ├── EmailInterface.tsx   # Gmail interface
│   │   ├── AgentInterface.tsx   # AI chat interface
│   │   └── ModeToggle.tsx       # View switcher
│   ├── lib/                     # Utilities
│   │   └── api.ts              # API service layer
│   ├── auth/callback/           # OAuth callback handler
│   └── page.tsx                # Main application
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
│   ├── main.py                # FastAPI application
│   └── pyproject.toml         # Python dependencies
├── package.json               # Node.js dependencies
└── README.md                 # This file
```

## 🏗️ Architecture

### Design Principles
- **Clean Architecture** - Separation of concerns with clear boundaries
- **Service Layer Pattern** - Business logic isolated from API routes
- **No Global State** - Proper dependency injection throughout
- **Type Safety** - Full TypeScript (frontend) and Pydantic (backend)

### Authentication Flow
1. User enters Gmail address
2. System checks for existing connection (prevents duplicates)
3. Creates Composio Auth Link for new users
4. OAuth flow with Gmail
5. Secure connection established
6. User can start chatting immediately

### AI Agent Architecture
- **Model:** OpenAI GPT-4o for natural language understanding
- **Orchestration:** Composio OpenAI Agents SDK
- **Tools:** Gmail toolkit (read, search, send, reply)
- **Memory:** Conversation history maintained per session
- **Streaming:** Real-time response streaming to frontend

## 📝 Available Commands

```bash
# Development
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Frontend only (Next.js)
npm run dev:backend      # Backend only (uvicorn)

# Backend (uvicorn directly)
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
npm run build            # Build frontend for production
npm run start            # Start production frontend server

# Backend dependencies
npm run install:backend  # Install Python dependencies using uv
```

## 🔧 Environment Variables

### Backend (`.env`)
```env
# Required
OPENAI_API_KEY=sk-...              # OpenAI API key
COMPOSIO_API_KEY=...               # Composio API key

# Optional
AUTH_CONFIG_ID=...                 # Composio auth config ID
DEBUG=true                         # Enable debug mode
ENVIRONMENT=development            # Environment name
```

### Frontend (Vercel deployment)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend URL
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Composio](https://composio.dev) - AI agent orchestration
- [OpenAI](https://openai.com) - GPT-4o language model
- [Next.js](https://nextjs.org) - React framework
- [FastAPI](https://fastapi.tiangolo.com) - Python web framework
