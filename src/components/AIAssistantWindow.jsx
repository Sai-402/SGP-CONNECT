// ============================================================================
// SGP CONNECT — AI ACADEMIC & STUDY ASSISTANT
// Powered by Google Gemini Flash with contextual student data binding
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useCampus } from '../context/CampusContext';
import { askAIAssistant } from '../services/aiService';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  HelpCircle,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function AIAssistantWindow() {
  const { currentUser, nextClass, fineCalculation } = useCampus();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Hello ${currentUser?.name?.split(' ')[0]}! 👋 I am your SGP Connect AI Academic Assistant.
I can check your real-time **timetable & next class**, calculate your **attendance shortage & fine**, explain **study materials** (like DBMS Normalization), or generate **quiz practice questions** for your IA exams.

How can I assist you with your polytechnic studies today?`
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    const studentContext = {
      name: currentUser?.name || 'Rahul Kumar',
      usn: currentUser?.usn || '23SGP001',
      department: currentUser?.department || 'Computer Science',
      className: currentUser?.className || '3rd Year CSE - A',
      overallAttendance: currentUser?.overallAttendance || 82,
      presentCount: currentUser?.presentCount || 164,
      totalClasses: currentUser?.totalClasses || 200,
      applicableFine: fineCalculation?.applicableFine || 0,
      classesNeeded: fineCalculation?.consecutiveClassesNeeded || 0,
      nextClass
    };

    try {
      const replyText = await askAIAssistant(q, studentContext);
      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: replyText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: 'Apologies, I encountered an error connecting to the campus assistant service. Please check your network or try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What is my next class?',
    'Check my attendance & fine status',
    'Explain Normalization in simple terms',
    'Generate practice questions on DBMS',
    'What assignments are due this week?'
  ];

  return (
    <div className="card card-glass animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Header */}
      <div
        className="flex-between"
        style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--surface-raised)',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366F1 0%, #2563EB 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>SGP AI Academic Advisor</h3>
              <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Gemini Flash</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Intelligent academic Q&A, syllabus concept explainer, and attendance intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--surface-base)'
        }}
      >
        {quickPrompts.map(p => (
          <button
            key={p}
            type="button"
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.74rem', whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
            onClick={() => handleSendMessage(p)}
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="chat-messages" style={{ minHeight: '360px', maxHeight: '480px', overflowY: 'auto' }}>
        {messages.map(m => (
          <div
            key={m.id}
            className={`chat-bubble ${m.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', opacity: 0.85, fontSize: '0.74rem' }}>
              {m.sender === 'user' ? (
                <>
                  <User size={13} /> You ({currentUser?.name?.split(' ')[0]})
                </>
              ) : (
                <>
                  <Bot size={13} color="var(--primary-light)" /> SGP Academic Advisor
                </>
              )}
            </div>
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="chat-bubble chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={16} className="animate-spin" color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Consulting academic syllabus and student records...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="chat-input-bar"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask anything about your timetable, attendance, notes, or IA exams..."
          className="form-input"
          style={{ border: 'none', background: 'transparent', padding: '0.6rem 0.5rem' }}
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || loading}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem' }}
        >
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}
