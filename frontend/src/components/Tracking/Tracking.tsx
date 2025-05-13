import React, { useEffect, useState, useRef } from 'react';

// Message type definition
interface Message {
  id: string;
  content: string;
  response?: string;
  is_prompt_injection: boolean;
  created_at: string;
}

// Pagination state
interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const Tracking: React.FC = () => {
  // State for messages and loading status
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  });

  // Template reference for message rendering
  const messageTemplateRef = useRef<HTMLTemplateElement>(null);

  // Format date helper
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Truncate text helper
  const truncateText = (text: string, maxLength = 40): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Fetch messages from API
  const fetchMessages = async () => {
    setLoading(true);
    setEmpty(false);

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setEmpty(true);
      return;
    }

    try {
      const { currentPage, pageSize } = pagination;
      const skip = (currentPage - 1) * pageSize;
      const url = `http://localhost:8000/api/v1/chat/messages?skip=${skip}&limit=${pageSize}`;
      
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

      if (fetchedMessages.length === 0) {
        setEmpty(true);
        setMessages([]);
      } else {
        setMessages(fetchedMessages);
        
        // Update pagination info
        const hasMorePages = fetchedMessages.length === pageSize;
        setPagination(prev => ({
          ...prev,
          totalPages: hasMorePages ? Math.max(currentPage + 1, prev.totalPages) : currentPage
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setEmpty(true);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/chat/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Refresh messages after deletion
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message. Please try again.');
    }
  };

  // Update message's prompt injection status
  const updateMessageInjectionStatus = async (messageId: string, isPromptInjection: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/chat/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          is_prompt_injection: isPromptInjection
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update message');
      }

      // Update the local state to reflect the change
      setMessages(prevMessages => 
        prevMessages.map(message => 
          message.id === messageId 
            ? { ...message, is_prompt_injection: isPromptInjection } 
            : message
        )
      );
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message. Please try again.');
    }
  };

  // Page navigation
  const goToNextPage = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: prev.currentPage + 1
    }));
  };

  const goToPrevPage = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1)
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      pageSize: newSize
    });
  };

  // Fetch messages when component mounts or pagination changes
  useEffect(() => {
    fetchMessages();
  }, [pagination.currentPage, pagination.pageSize]);

  // Toggle message details
  const toggleMessageDetails = (messageId: string) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      const details = messageElement.nextElementSibling as HTMLElement;
      const chevron = messageElement.querySelector('.fa-chevron-down, .fa-chevron-up');
      
      if (details && chevron) {
        details.classList.toggle('hidden');
        chevron.classList.toggle('fa-chevron-down');
        chevron.classList.toggle('fa-chevron-up');
      }
    }
  };

  return (
    <div id="tracking-page" className="page">
      <h2 className="text-2xl font-semibold mb-4">Message Tracking</h2>
      
      {/* Messages List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Your Chat Messages</h3>
          <div className="flex space-x-2">
            <select 
              id="messages-per-page" 
              className="border rounded px-2 py-1 text-sm"
              value={pagination.pageSize.toString()}
              onChange={handlePageSizeChange}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
            <button 
              id="refresh-messages" 
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              onClick={() => fetchMessages()}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div id="messages-loading" className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && empty && (
          <div id="messages-empty" className="py-20 text-center">
            <p className="text-gray-500">No messages found</p>
            <p className="text-gray-400 text-sm mt-2">Messages sent via the API will appear here</p>
          </div>
        )}
        
        {/* Messages list */}
        {!loading && !empty && (
          <div id="messages-list" className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className="message-item border rounded-lg overflow-hidden">
                <div 
                  className={`message-header ${message.is_prompt_injection ? 'bg-red-50' : 'bg-gray-50'} px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100`}
                  data-message-id={message.id}
                  onClick={() => toggleMessageDetails(message.id)}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`message-icon fas ${message.is_prompt_injection ? 'fa-exclamation-triangle text-red-500' : 'fa-comment-alt text-blue-500'}`}></i>
                    <p className="message-preview font-medium">{truncateText(message.content)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="message-date text-sm text-gray-500">{formatDate(message.created_at)}</span>
                    <button 
                      className="message-delete text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this message?')) {
                          deleteMessage(message.id);
                        }
                      }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <i className="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                <div className="message-details hidden p-4 border-t">
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
                          className="prompt-injection-checkbox form-checkbox h-5 w-5 text-red-600"
                          checked={message.is_prompt_injection}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateMessageInjectionStatus(message.id, e.target.checked);
                          }}
                        />
                        <span className="ml-2 text-red-700 font-medium">Prompt Injection</span>
                      </label>
                    </div>
                    <div className="text-xs text-gray-500">
                      Message ID: <span className="message-id">{message.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !empty && (
          <div id="messages-pagination" className="mt-6 flex justify-between items-center">
            <button 
              id="prev-page" 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
              onClick={goToPrevPage}
              disabled={pagination.currentPage <= 1}
            >
              <i className="fas fa-chevron-left mr-1"></i> Previous
            </button>
            <div className="text-sm text-gray-500">
              Page <span id="current-page">{pagination.currentPage}</span> of <span id="total-pages">{pagination.totalPages}</span>
            </div>
            <button 
              id="next-page" 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
              onClick={goToNextPage}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Next <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        )}
      </div>
      
      {/* Visualization and API Hint Section */}
      <div className="space-y-4">
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
    </div>
  );
};

export default Tracking;