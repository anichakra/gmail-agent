'use client';

import { useState, useEffect } from 'react';
import { Mail, Reply, Search, Archive, MoreVertical } from 'lucide-react';
import { API_URL } from '../lib/api';

interface Email {
  id: string;
  subject: string;
  sender: string;
  preview: string;
  time: string;
  read: boolean;
  messageText?: string;
  to?: string;
  threadId?: string;
  attachmentList?: unknown[];
  labelIds?: string[];
}

interface EmailInterfaceProps {
  userEmail: string;
}

export default function EmailInterface({ userEmail }: EmailInterfaceProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // Fetch real emails from backend
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/emails/${encodeURIComponent(userEmail)}?max_results=20`);
        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }
        
        const emailData = await response.json();
        
        // Handle the actual API response structure
        const messages = emailData.data?.messages || [];
        
        // Transform the email data to match our interface
        const transformedEmails: Email[] = messages.map((email: Record<string, unknown>, index: number) => ({
          id: (email.messageId as string) || `email-${index}`,
          subject: (email.subject as string) || 'No Subject',
          sender: (email.sender as string) || 'Unknown Sender',
          preview: (email.messageText as string)?.substring(0, 100) || '',
          time: email.messageTimestamp ? new Date(email.messageTimestamp as string).toLocaleTimeString() : 'Unknown Time',
          read: true, // API doesn't provide read status, defaulting to true
          messageText: (email.messageText as string) || '',
          to: (email.to as string) || '',
          threadId: (email.threadId as string) || '',
          attachmentList: (email.attachmentList as unknown[]) || [],
          labelIds: (email.labelIds as string[]) || []
        }));
        
        setEmails(transformedEmails);
        if (transformedEmails.length > 0) {
          setSelectedEmail(transformedEmails[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching emails:', error);
        // Fallback to mock data if API fails
        const mockEmails: Email[] = [
          {
            id: '1',
            subject: 'Welcome to Gmail Agent',
            sender: 'System',
            preview: 'Your email agent is ready to use!',
            time: new Date().toLocaleTimeString(),
            read: false
          }
        ];
        setEmails(mockEmails);
        setSelectedEmail(mockEmails[0]);
        setIsLoading(false);
      }
    };
    
    fetchEmails();
  }, [userEmail]);

  const handleSendReply = () => {
    if (replyContent.trim()) {
      // Here you would call the API to send the reply
      console.log('Sending reply:', replyContent);
      setReplyContent('');
      setShowReply(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Email List Sidebar */}
      <div className="w-1/3 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-foreground">Inbox</h1>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Signed in as: {userEmail}
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
                selectedEmail?.id === email.id ? 'bg-blue-500/10 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${email.read ? 'bg-transparent' : 'bg-blue-600'}`} />
                    <p className={`text-sm font-medium truncate ${email.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {email.sender}
                    </p>
                  </div>
                  <p className={`text-sm mt-1 ${email.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {email.preview}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                  {email.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">{selectedEmail.subject}</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded">
                    <Archive className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowReply(!showReply)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
                  >
                    <Reply className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="font-medium">{selectedEmail.sender}</span>
                <span className="mx-2">•</span>
                <span>To: {selectedEmail.to || 'You'}</span>
                <span className="ml-auto">{selectedEmail.time}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.messageText || selectedEmail.preview || 'No content available'}
                </div>
                {selectedEmail.attachmentList && selectedEmail.attachmentList.length > 0 && (
                  <div className="mt-4 p-4 bg-accent rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Attachments ({selectedEmail.attachmentList.length})</h4>
                    <div className="text-sm text-muted-foreground">
                      {selectedEmail.attachmentList.length} attachment(s) available
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Section */}
            {showReply && (
              <div className="border-t border-border p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2 text-foreground">Reply</h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    To: {selectedEmail.sender}
                  </div>
                </div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full h-32 p-3 border border-border bg-card text-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowReply(false)}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
