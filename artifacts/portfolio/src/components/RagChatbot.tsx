import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function RagChatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi, I'm Abdur's portfolio assistant. Ask me about his skills, projects, education, experience, or goals.",
    },
  ]);

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || loading) return;

    setQuestion('');
    setMessages(current => [...current, { role: 'user', content: trimmedQuestion }]);
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl ? `${apiBaseUrl}/api/rag/query` : '/api/rag/query'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmedQuestion, top_k: 3 }),
      });

      if (!response.ok) {
        throw new Error('RAG request failed');
      }

      const data = await response.json();
      setMessages(current => [
        ...current,
        { role: 'assistant', content: data.answer ?? "I don't have that detail in Abdur's current portfolio knowledge yet." },
      ]);
    } catch {
      setMessages(current => [
        ...current,
        {
          role: 'assistant',
          content:
            "I don't have that detail in Abdur's current portfolio knowledge yet. I can still help with his skills, projects, education, experience, location, and contact information.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {open && (
        <div
          className="mb-4 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-white/10 bg-[#08080d]/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                <Bot size={18} />
              </div>
              <div>
                <div className="font-display text-sm font-semibold text-white">Ask About Abdur</div>
                <div className="text-xs text-slate-500">Portfolio knowledge chat</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'border border-white/10 bg-white/5 text-slate-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="inline-flex rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={submitQuestion} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={question}
              onChange={event => setQuestion(event.target.value)}
              placeholder="Ask a question..."
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-400/60"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send question"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-950/40 transition hover:scale-105"
        aria-label="Open chatbot"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
