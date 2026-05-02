import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Mail, MailOpen, Trash2, RefreshCw, Inbox, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      } else {
        setError('Failed to load messages.');
      }
    } catch {
      setError('Network error. Could not load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markRead = async (id: number) => {
    try {
      await fetch(`/api/messages/${id}/read`, { method: 'PATCH' });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, read: true } : null);
    } catch {}
  };

  const deleteMessage = async (id: number) => {
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {}
  };

  const handleSelect = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markRead(msg.id);
  };

  const unreadCount = messages.filter(m => !m.read).length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Messages
            {unreadCount > 0 && (
              <Badge className="bg-cyan-500 text-white text-xs px-2">{unreadCount} unread</Badge>
            )}
          </h1>
          <p className="text-slate-400">Contact form submissions from your portfolio</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={fetchMessages}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          Loading messages...
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-16">
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="outline" onClick={fetchMessages} className="border-slate-700 text-white hover:bg-slate-800">Try Again</Button>
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Inbox className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm mt-1">Messages from your contact form will appear here.</p>
        </div>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Message list */}
          <div className="lg:col-span-2 space-y-2">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleSelect(msg)}
                className={`cursor-pointer rounded-lg border p-4 transition-all ${
                  selected?.id === msg.id
                    ? 'border-cyan-400/50 bg-cyan-500/10'
                    : msg.read
                    ? 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                    : 'border-slate-700 bg-slate-900/60 hover:border-cyan-400/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="mt-1 flex-shrink-0">
                      {msg.read
                        ? <MailOpen className="w-4 h-4 text-slate-500" />
                        : <Mail className="w-4 h-4 text-cyan-400" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${msg.read ? 'text-slate-400' : 'text-white'}`}>
                        {msg.name}
                      </p>
                      <p className={`text-xs truncate mt-0.5 ${msg.read ? 'text-slate-500' : 'text-slate-300'}`}>
                        {msg.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    <span className="text-xs text-slate-500">{formatDate(msg.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <Card className="bg-slate-900/50 border-slate-800 sticky top-4">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{selected.subject}</CardTitle>
                      <CardDescription className="mt-1">
                        <span className="text-cyan-400 font-medium">{selected.name}</span>
                        <span className="text-slate-500"> · {selected.email}</span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-500/20 hover:text-red-400 text-slate-400 ml-2"
                      onClick={() => deleteMessage(selected.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Reply via Email
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      onClick={() => deleteMessage(selected.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <Mail className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
