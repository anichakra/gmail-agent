"""
AI Agent service using Composio MCP and LangChain.
"""
import os
import asyncio
from typing import Dict, Any
from composio import Composio
from composio_langchain import LangchainProvider
from dotenv import load_dotenv
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.chat_models import init_chat_model
from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode

from app.config.settings import get_settings
from core.constants import SYSTEM_PROMPT

load_dotenv()

class EmailAssistantAgent:
    """AI Agent service for email assistance using LangChain and MCP."""
    
    def __init__(self):
        """Initialize the agent service."""
        settings = get_settings()
        self.composio = Composio(provider=LangchainProvider())
        
        # Initialize the chat model with configured provider and name
        if not settings.model_provider or not settings.model_name:
            raise ValueError("MODEL_PROVIDER and MODEL_NAME must be set in .env file")
            
        model_id = f"{settings.model_provider}:{settings.model_name}"
        self.model = init_chat_model(model_id)
        self.auth_config_id = settings.auth_config_id
        self.graphs: Dict[str, Any] = {}

    async def create_agent_graph(self, user_id: str):
        """Create LangGraph agent for a user"""
        if user_id in self.graphs:
            return self.graphs[user_id]
        
        # Get tools for the user
        tools = self.composio.tools.get(user_id=user_id, toolkits=['gmail'])
        
        model_with_tools = self.model.bind_tools(tools)
        tool_node = ToolNode(tools)

        def should_continue(state: MessagesState):
            messages = state["messages"]
            last_message = messages[-1]
            if last_message.tool_calls:
                return "tools"
            return END

        async def call_model(state: MessagesState):
            messages = state["messages"]
            # Add system prompt if it's the first message
            if not any(isinstance(m, SystemMessage) for m in messages):
                messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
            response = await model_with_tools.ainvoke(messages)
            return {"messages": [response]}

        builder = StateGraph(MessagesState)
        builder.add_node("call_model", call_model)
        builder.add_node("tools", tool_node)

        builder.add_edge(START, "call_model")
        builder.add_conditional_edges(
            "call_model",
            should_continue,
        )
        builder.add_edge("tools", "call_model")

        graph = builder.compile()
        self.graphs[user_id] = graph
        return graph

    async def process_message(self, user_id: str, message: str) -> str:
        """Process a message from the frontend"""
        # Get or create the agent graph for this user
        graph = await self.create_agent_graph(user_id)
        
        # Process the message
        response = await graph.ainvoke(
            {"messages": [{"role": "user", "content": message}]}
        )
        
        # Extract the assistant's response
        last_message = response["messages"][-1]
        content = last_message.content
        
        # Handle content being a list (common with some providers like Gemini/Anthropic)
        if isinstance(content, list):
            text_parts = []
            for part in content:
                if isinstance(part, dict) and 'text' in part:
                    text_parts.append(part['text'])
                elif isinstance(part, str):
                    text_parts.append(part)
            return " ".join(text_parts)
            
        return str(content)

    async def cleanup_user_session(self, user_id: str):
        """Clean up resources for a user"""
        if user_id in self.graphs:
            del self.graphs[user_id]

# Global agent instance
agent = EmailAssistantAgent()

async def handle_frontend_request(user_id: str, message: str) -> str:
    """Main function to handle requests from frontend"""
    try:
        response = await agent.process_message(user_id, message)
        return response
    except Exception as e:
        return f"Error processing request: {str(e)}"