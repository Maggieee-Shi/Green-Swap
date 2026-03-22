import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Send, Package } from "lucide-react";
import { Client } from "@stomp/stompjs";
import { Header } from "./Header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
}

interface Conversation {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string | null;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
}

export function Chat() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stompRef = useRef<Client | null>(null);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => {
      if (prev.find((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
  }, []);

  // Load conversation info and history
  useEffect(() => {
    if (!id) return;
    apiFetch<Conversation[]>("/conversations")
      .then((convs) => {
        const conv = convs.find((c) => c.id === id);
        if (conv) setConversation(conv);
      })
      .catch(() => toast.error("Failed to load conversation"));

    apiFetch<Message[]>(`/conversations/${id}/messages`)
      .then(setMessages)
      .catch(() => toast.error("Failed to load messages"));
  }, [id]);

  // STOMP WebSocket for real-time messages
  useEffect(() => {
    if (!id || !token) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = (import.meta.env.VITE_WS_URL as string)
      ?? `${protocol}//${window.location.host}/ws/websocket`;

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe(`/topic/conversations/${id}`, (frame) => {
          const msg: Message = JSON.parse(frame.body);
          addMessage(msg);
        });
      },
      onStompError: () => {
        // WebSocket connection failed gracefully — messages still work via REST
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [id, token, addMessage]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !id) return;
    setSending(true);
    try {
      const msg = await apiFetch<Message>(`/conversations/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: input.trim() }),
      });
      addMessage(msg);
      setInput("");
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherName = conversation
    ? user?.id === conversation.buyerId
      ? conversation.sellerName
      : conversation.buyerName
    : "";

  const formatTime = (dt: string) => {
    return new Date(dt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 flex-1 flex flex-col py-6">
        {/* Back + Header */}
        <div className="mb-4">
          <Link
            to="/conversations"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Messages
          </Link>
          {conversation && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                {conversation.productImageUrl ? (
                  <img
                    src={conversation.productImageUrl}
                    alt={conversation.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{otherName}</p>
                <Link
                  to={`/product/${conversation.productId}`}
                  className="text-sm text-slate-500 hover:text-green-700"
                >
                  {conversation.productName}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-y-auto p-4 space-y-3 min-h-[400px] max-h-[500px]">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              No messages yet — start the conversation
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                      isMe
                        ? "bg-green-600 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-900 rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? "text-green-200" : "text-slate-400"
                      }`}
                    >
                      {formatTime(msg.sentAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-3">
          <Input
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />
          <Button onClick={handleSend} disabled={!input.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
