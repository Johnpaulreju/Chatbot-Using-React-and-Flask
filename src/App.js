'use client'
import Sidebar from './components/sidebar';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div style={styles.codeBlockContainer}>
        <SyntaxHighlighter language={match[1]} style={dracula} {...props}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
        <button
          onClick={() => copyToClipboard(String(children))}
          style={styles.copyButton}
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
};

function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null); // No session ID initially
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions(); // Fetch all session IDs on load
  }, []);

  const fetchSessions = async () => {
    const response = await fetch('http://127.0.0.1:5000/get-sessions');
    const data = await response.json();
    setSessions(data.sessions);
  };

  const loadSession = async (sessionId) => {
    const response = await fetch(`http://127.0.0.1:5000/load-chat/${sessionId}`);
    const data = await response.json();
    console.log(data);
    setMessages(data.messages); // Load the chat messages for the selected session
    setSessionId(sessionId); // Set the session ID for the loaded session
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const userMessage = { user_message: input }; // Updated user message key
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      if (!sessionId) {
        // Generate new session ID if no session exists
        const newSessionId = Math.random().toString(36).substr(2, 9);
        setSessionId(newSessionId);
      }

      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, session_id: sessionId }),
      });

      const data = await response.json();
      setSessionId(data.session_id); // Save session ID

      const assistantMessage = { response_message: data.response }; // Updated response key
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar sessions={sessions} loadSession={loadSession} />

      <div style={styles.chatContainer}>
        <div style={styles.chatWindow}>
          {messages.length === 0 && <div>No messages yet</div>}
          {messages.map((msg, index) => (
            <div key={index} style={styles.messageContainer}>
              {Object.entries(msg).map(([key, value], subIndex) => (
                <div key={subIndex} style={key.includes("user_message") ? styles.userChat : styles.assistantChat}>
                  <img 
                    src={key.includes("user_message") ? "/man.png" : "/ai-technology.png"} 
                    alt={key.includes("user_message") ? "User" : "Assistant"} 
                    style={styles.avatar} 
                  />
                  <div style={key.includes("user_message") ? styles.userMessage : styles.assistantMessage}>
                    {value}
                    {key.includes("response_message") && (
                      <button onClick={() => copyToClipboard(String(value))} style={styles.copymsgButton}>
                        <FontAwesomeIcon icon={faCopy}/> COPY
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    height: '100vh' 
  },
  chatContainer: { 
    display: 'flex',
    flexDirection: 'column', 
    height: '95vh', 
    justifyContent: 'flex-end', 
    backgroundColor: '#f1f1f1', 
    padding: '20px', 
    flex: 1,
    overflow: 'hidden', 
  },
  chatWindow: { 
    flex: 1, 
    overflowY: 'auto', 
    padding: '10px', 
    backgroundColor: '#fff', 
    border: '1px solid #ccc', 
    display: 'flex', 
    flexDirection: 'column',
    gap: '20px', // Add space between messages
  },
  messageContainer: { 
    display: 'flex', 
    alignItems: 'flex-start', 
    marginBottom: '10px', 
    flexDirection: 'column', // This helps stack messages vertically
    maxWidth: '80%', // Limit message width for better readability
  },
  userChat: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-end', // Aligns user messages to the right
    marginLeft: 'auto', // Push user messages to the right
    width: 'fit-content',
    flexDirection: 'row-reverse', // Ensures avatar is on the right
  },
  assistantChat: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start', // Align assistant messages to the left
    width: 'fit-content',
  },
  avatar: { 
    width: '40px', 
    height: '40px', 
    borderRadius: '50%', 
    margin: '5px' // Adds space around the avatar
  },
  message: { 
    padding: '10px', 
    borderRadius: '20px', 
    maxWidth: '60%', 
    wordWrap: 'break-word', 
    whiteSpace: 'pre-wrap',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: '#fff',
    marginLeft: 'auto',
    textAlign: 'right',
    width: 'fit-content',
  },
  assistantMessage: {
    backgroundColor: '#e1e1e1',
    color: '#000',
    marginRight: 'auto',
    textAlign: 'left',
    width: 'fit-content',
    position: 'relative',
  },
  inputContainer: { 
    display: 'flex', 
    borderTop: '1px solid #ccc', 
    padding: '10px', 
    backgroundColor: '#fff', 
  },
  input: { 
    flex: 1, 
    padding: '10px', 
    borderRadius: '5px', 
    border: '1px solid #ccc', 
    marginRight: '10px', 
  },
  sendButton: { 
    padding: '10px 20px', 
    backgroundColor: '#007bff', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
  },
};




export default ChatUI;
