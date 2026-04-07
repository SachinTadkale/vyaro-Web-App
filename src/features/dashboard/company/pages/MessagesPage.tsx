import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Search, MessageSquare, Send, MoreVertical, Phone, Video, MapPin, Package, Hash } from "lucide-react";

const MOCK_CHATS = [
  { id: "CHAT-1", name: "Raju Rastogi", location: "Pune, Maharashtra", product: "Premium Wheat", orderId: "ORD-7391", lastMessage: "I have dispatched the wheat. Please check.", time: "10:23 AM", unread: 2, isOnline: true,
    messages: [
      { id: "M1", text: "Hello, regarding order ORD-7391", sender: "Raju", time: "10:00 AM" },
      { id: "M2", text: "Yes, what is the status?", sender: "Me", time: "10:05 AM" },
      { id: "M3", text: "I have dispatched the wheat. Please check.", sender: "Raju", time: "10:23 AM" }
    ]
  },
  { id: "CHAT-2", name: "Suresh Patil", location: "Nashik, Maharashtra", product: "Organic Turmeric", orderId: "ORD-8422", lastMessage: "Can we negotiate the price for turmeric?", time: "Yesterday", unread: 0, isOnline: false,
    messages: [
      { id: "M1", text: "Can we negotiate the price for turmeric?", sender: "Suresh", time: "Yesterday" }
    ]
  },
  { id: "CHAT-3", name: "Amit Singh", location: "Agra, UP", product: "Basmati Rice", orderId: "ORD-9103", lastMessage: "Payment received. Thanks!", time: "Monday", unread: 0, isOnline: true,
    messages: [
       { id: "M1", text: "I initiated the payment.", sender: "Me", time: "Monday" },
       { id: "M2", text: "Payment received. Thanks!", sender: "Amit", time: "Monday" }
    ]
  },
  { id: "CHAT-4", name: "Kisan Lal", location: "Nagpur, Maharashtra", product: "Cotton Bales", orderId: null, lastMessage: "Why was the order cancelled?", time: "Mar 28", unread: 1, isOnline: false,
    messages: [
       { id: "M1", text: "Why was the order cancelled?", sender: "Kisan", time: "Mar 28" }
    ]
  },
];

const MessagesPage = () => {
  const location = useLocation();
  const incomingState = location.state as { farmerName?: string; product?: string; listingId?: string } | null;

  const [chats, setChats] = useState(MOCK_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Auto-create or auto-select chat when arriving from Marketplace
  const didInitRef = useRef(false);
  useEffect(() => {
    if (!incomingState?.farmerName || didInitRef.current) return;
    didInitRef.current = true;

    const farmerName = incomingState.farmerName;
    const product = incomingState.product || "";

    const existing = chats.find(c => c.name.toLowerCase() === farmerName.toLowerCase());
    if (existing) {
      setSelectedChatId(existing.id);
      return;
    }

    const newId = `CHAT-${Date.now()}`;
    const newChat = {
      id: newId,
      name: farmerName,
      location: "Unknown Location",
      product: product,
      orderId: "" as string | null,
      lastMessage: "Start a conversation...",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      isOnline: false,
      messages: [
        {
          id: "system-1",
          text: `Enquiring about: ${product || "a product"}. Ask the farmer anything about pricing, availability, or delivery.`,
          sender: "System",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setSelectedChatId(newId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedChat = chats.find(c => c.id === selectedChatId) || null;
  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedChat) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      text: inputValue,
      sender: "Me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(c => 
      c.id === selectedChat.id ? { 
        ...c, 
        messages: [...c.messages, newMessage],
        lastMessage: inputValue,
        time: newMessage.time
      } : c
    ));
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex gap-6 pt-2 h-[calc(100vh-[120px])] min-h-[500px]">
      {/* Left Panel */}
      <div className="w-1/3 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-black text-foreground tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              className="w-full bg-muted/30 border border-border pl-10 pr-4 py-2.5 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
            />
          </div>
          {incomingState?.farmerName && (
            <div className="mt-3 p-2.5 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-2">
              <MessageSquare size={12} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">From Marketplace</p>
                <p className="text-[10px] text-foreground mt-0.5 font-semibold">{incomingState.farmerName}</p>
                {incomingState.product && <p className="text-[10px] text-muted-foreground">{incomingState.product}</p>}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-colors mb-1 ${selectedChat?.id === chat.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shadow-sm">
                  {chat.name.charAt(0)}
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground truncate">{chat.name}</h4>
                  <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs truncate max-w-[180px] ${chat.unread > 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[9px] font-black text-primary-foreground shadow-sm">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden relative">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-muted/10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm flex-shrink-0">
                      {selectedChat.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-foreground">{selectedChat.name}</h3>
                      <p className={`text-[10px] uppercase font-bold tracking-widest ${selectedChat.isOnline ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {selectedChat.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-muted-foreground">
                    <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"><Phone size={14} /></button>
                    <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"><Video size={14} /></button>
                    <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"><MoreVertical size={14} /></button>
                  </div>
               </div>
               {/* Info Tags */}
               <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 bg-muted/50 text-muted-foreground text-[10px] font-bold px-2.5 py-1 rounded-md border border-border/50 uppercase tracking-widest">
                    <MapPin size={9} /> {selectedChat.location}
                  </span>
                  {selectedChat.product && (
                    <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md border border-primary/20 uppercase tracking-widest">
                      <Package size={9} /> {selectedChat.product}
                    </span>
                  )}
                  {selectedChat.orderId && (
                    <span className="flex items-center gap-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2.5 py-1 rounded-md border border-blue-500/20 uppercase tracking-widest">
                      <Hash size={9} /> {selectedChat.orderId}
                    </span>
                  )}
               </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedChat.messages.map((msg) => {
                const isMe = msg.sender === "Me";
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}>
                      <p>{msg.text}</p>
                      <span className={`text-[9px] font-bold block mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="relative flex items-center">
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full bg-muted/30 border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`absolute right-2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm ${inputValue.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50 border border-transparent'}`}
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 border border-border shadow-sm">
                <MessageSquare size={24} className="opacity-50" />
             </div>
             <p className="text-sm font-black text-foreground">No Chat Selected</p>
             <p className="text-xs mt-1 max-w-xs text-center leading-relaxed">Choose a conversation from the left panel to begin discussing orders and procurements.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
