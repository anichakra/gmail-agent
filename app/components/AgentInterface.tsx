'use client';

import { useState, useRef, useEffect } from 'react';
import { CornerDownLeft, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentInterfaceProps {
  userEmail: string;
}

// Pixelated Composio Logo Component
const ComposioLogo = () => (
  <div className="relative w-16 h-16 bg-white" style={{ imageRendering: 'pixelated' }}>
    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0">
      {/* Top row */}
      <div className="col-start-2 col-span-3 bg-white"></div>
      {/* Second row */}
      <div className="row-start-2 col-start-1 col-span-5 bg-white"></div>
      {/* Third row - center square */}
      <div className="row-start-3 col-start-1 bg-white"></div>
      <div className="row-start-3 col-start-2 col-span-3 bg-black"></div>
      <div className="row-start-3 col-start-5 bg-white"></div>
      {/* Fourth row */}
      <div className="row-start-4 col-start-1 col-span-5 bg-white"></div>
      {/* Fifth row */}
      <div className="row-start-5 col-start-2 col-span-3 bg-white"></div>
    </div>
  </div>
);

export default function AgentInterface({ userEmail }: AgentInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation persistence
  const getStorageKey = (email: string) => `email-assistant-conversation-${email}`;
  
  // Load conversation from localStorage on component mount
  useEffect(() => {
    const savedConversation = localStorage.getItem(getStorageKey(userEmail));
    if (savedConversation) {
      try {
        const parsed = JSON.parse(savedConversation);
        setMessages(parsed.messages || []);
        setConversationId(parsed.conversationId || '');
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    }
  }, [userEmail]);

  // Save conversation to localStorage whenever messages or conversationId changes
  useEffect(() => {
    if (messages.length > 0 || conversationId) {
      const conversationData = {
        messages,
        conversationId,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(getStorageKey(userEmail), JSON.stringify(conversationData));
    }
  }, [messages, conversationId, userEmail]);

  // New chat function
  const startNewChat = () => {
    setMessages([]);
    setConversationId('');
    setInputValue('');
    localStorage.removeItem(getStorageKey(userEmail));
  };

  const suggestedPrompts = [
    "Find invoice from Stripe",
    "Show unpaid invoices", 
    "Show recent work feedback",
    "Find all work meetings",
    "What projects do i have coming up"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Create a temporary assistant message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('http://localhost:8000/api/agent/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          user_id: userEmail,
          conversation_id: conversationId || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'conversation_id') {
                  setConversationId(data.conversation_id);
                } else if (data.type === 'content') {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: msg.content + data.content }
                      : msg
                  ));
                } else if (data.type === 'done') {
                  setIsLoading(false);
                  break;
                } else if (data.type === 'error') {
                  throw new Error(data.error);
                }
              } catch (parseError) {
                console.error('Error parsing chunk:', parseError);
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the assistant message with error content
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              content: `Hello. I'm Fred, your email agent. How can I help with your inbox today?`
            }
          : msg
      ));
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      {/* Header with New Chat and Sign Out buttons */}
      {messages.length > 0 && (
        <div className="flex justify-between items-center p-4 border-b border-[#333333]">
          <h2 className="text-lg font-medium text-white">Open Email Agent</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={startNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] rounded-lg text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <ComposioLogo />
            </div>
            
            {/* Heading */}
            <h1 className="text-3xl font-normal mb-3 text-white">
              Ask anything about your emails
            </h1>
            
            {/* Subheading */}
            <p className="text-[#888888] text-base mb-12">
              Ask to do or show anything using natural language
            </p>
            
            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="px-5 py-3 bg-[#2a2a2a] hover:bg-[#333333] rounded-full text-sm text-[#cccccc] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 pb-32">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl ${
                    message.role === 'user'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-lg text-white leading-relaxed">
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-4 last:mb-0 text-lg text-white leading-relaxed">{children}</p>,
                          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-white">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-white">{children}</h3>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-white">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-white">{children}</ol>,
                          li: ({ children }) => <li className="ml-2 text-white">{children}</li>,
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-[#333333] px-2 py-1 rounded text-sm font-mono text-white">{children}</code>
                            ) : (
                              <code className="block bg-[#333333] p-3 rounded-lg text-sm font-mono overflow-x-auto text-white">{children}</code>
                            );
                          },
                          pre: ({ children }) => <pre className="bg-[#333333] p-3 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-[#555555] pl-4 italic mb-4 text-white">{children}</blockquote>,
                          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                          em: ({ children }) => <em className="italic text-white">{children}</em>,
                          a: ({ href, children }) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a] to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] shadow-lg">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder=""
              className="w-full px-5 py-4 pr-14 bg-transparent text-white placeholder-gray-500 focus:outline-none rounded-lg"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#888888] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CornerDownLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}