import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  response?: string;
  created_at: string;
  is_prompt_injection: boolean;
}

const Tracking: React.FC = () => {
  // State for messages and pagination
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [hasMorePages, setHasMorePages] = useState<boolean>(false);

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 40): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Function to fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      setEmpty(true);
      return;
    }

    try {
      // Calculate pagination parameters
      const skip = (currentPage - 1) * pageSize;
      const apiBaseUrl = 'http://localhost:8000'; // Hardcoded for Docker environment
      const url = `${apiBaseUrl}/api/v1/chat/messages?skip=${skip}&limit=${pageSize}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      const fetchedMessages = data.messages || [];

      setMessages(fetchedMessages);
      setEmpty(fetchedMessages.length === 0);
      setHasMorePages(fetchedMessages.length === pageSize);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setEmpty(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete message
  const deleteMessage = async (messageId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiBaseUrl = 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/v1/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh messages after deletion
        fetchMessages();
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message. Please try again.');
    }
  };

  // Function to update message's prompt injection status
  const updateMessageInjectionStatus = async (messageId: string, isPromptInjection: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiBaseUrl = 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/v1/chat/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_prompt_injection: isPromptInjection
        })
      });

      if (response.ok) {
        // Update the state to reflect the change without refetching all messages
        setMessages(prevMessages => prevMessages.map(message => 
          message.id === messageId 
            ? { ...message, is_prompt_injection: isPromptInjection } 
            : message
        ));
      } else {
        throw new Error('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message. Please try again.');
      fetchMessages(); // Refresh to get correct state
    }
  };

  // Message details toggle handling
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const toggleMessageDetails = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  // Load messages on component mount and when pagination changes
  useEffect(() => {
    fetchMessages();
  }, [currentPage, pageSize]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Message Tracking</h2>
      
      {/* Messages List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Your Chat Messages</h3>
          <div className="flex space-x-2">
            <select 
              className="border rounded px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button 
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              onClick={() => fetchMessages()}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && empty && (
          <div className="py-20 text-center">
            <p className="text-gray-500">No messages found</p>
            <p className="text-gray-400 text-sm mt-2">Messages sent via the API will appear here</p>
          </div>
        )}
        
        {/* Messages list */}
        {!loading && !empty && (
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className="message-item border rounded-lg overflow-hidden">
                <div 
                  className={`message-header ${message.is_prompt_injection ? 'bg-red-50' : 'bg-gray-50'} px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100`}
                  onClick={() => toggleMessageDetails(message.id)}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`${message.is_prompt_injection ? 'fa-exclamation-triangle text-red-500' : 'fa-comment-alt text-blue-500'} fas`}></i>
                    <p className="message-preview font-medium">{truncateText(message.content)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="message-date text-sm text-gray-500">{formatDate(message.created_at)}</span>
                    <button 
                      className="message-delete text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this message?')) {
                          deleteMessage(message.id);
                        }
                      }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <i className={`fas ${expandedMessages.has(message.id) ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400`}></i>
                  </div>
                </div>
                
                {expandedMessages.has(message.id) && (
                  <div className="message-details p-4 border-t">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                      <div className="message-content bg-gray-50 p-3 rounded">{message.content}</div>
                    </div>
                    {message.response && (
                      <div className="message-response-container">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Response</h4>
                        <div className="message-response bg-gray-50 p-3 rounded">{message.response}</div>
                      </div>
                    )}
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-5 w-5 text-red-600"
                            checked={message.is_prompt_injection}
                            onChange={(e) => {
                              updateMessageInjectionStatus(message.id, e.target.checked);
                            }}
                          />
                          <span className="ml-2 text-red-700 font-medium">Prompt Injection</span>
                        </label>
                      </div>
                      <div className="text-xs text-gray-500">
                        Message ID: <span>{message.id}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !empty && (currentPage > 1 || hasMorePages) && (
          <div className="mt-6 flex justify-between items-center">
            <button 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <i className="fas fa-chevron-left mr-1"></i> Previous
            </button>
            <div className="text-sm text-gray-500">
              Page <span>{currentPage}</span> of <span>{hasMorePages ? '?' : currentPage}</span>
            </div>
            <button 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
              disabled={!hasMorePages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        )}
      </div>
      
      {/* API Hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <i className="fas fa-info-circle text-blue-500 text-xl"></i>
          </div>
          <div>
            <h4 className="font-medium mb-1">Using the Messages API</h4>
            <p className="text-sm">Messages are created via the API using your API token. Visit the Settings page to generate a token and see examples.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;