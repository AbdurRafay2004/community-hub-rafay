import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, Search, Phone, Video, MoreVertical, 
  Paperclip, Smile, Image, ArrowLeft
} from "lucide-react";
import { useRegisterVoiceCommand } from "@/hooks/useRegisterVoiceCommand";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");
  const [showChatList, setShowChatList] = useState(true);

  const conversations = [
    { id: 1, name: "Green Valley Group", lastMessage: "Meeting at 5 PM tomorrow", time: "2 min", unread: 3, isGroup: true },
    { id: 2, name: "Jane Smith", lastMessage: "Thanks for the update!", time: "1 hour", unread: 0, isGroup: false },
    { id: 3, name: "Downtown District", lastMessage: "New notice posted", time: "3 hours", unread: 5, isGroup: true },
    { id: 4, name: "Mike Johnson", lastMessage: "Can you help with the event?", time: "1 day", unread: 0, isGroup: false },
    { id: 5, name: "Tech Hub Community", lastMessage: "Workshop registration open", time: "2 days", unread: 0, isGroup: true },
  ];

  const messages = [
    { id: 1, sender: "Jane Smith", content: "Hi everyone! Just a reminder about tomorrow's community meeting.", time: "10:30 AM", isMine: false },
    { id: 2, sender: "Me", content: "Thanks Jane! Will the meeting be at the usual place?", time: "10:32 AM", isMine: true },
    { id: 3, sender: "Jane Smith", content: "Yes, at the community hall. We'll start at 5 PM sharp.", time: "10:33 AM", isMine: false },
    { id: 4, sender: "Mike Johnson", content: "I'll bring the projector for the presentation.", time: "10:35 AM", isMine: false },
    { id: 5, sender: "Me", content: "Perfect! I'll prepare the agenda and send it to everyone before the meeting.", time: "10:36 AM", isMine: true },
    { id: 6, sender: "Jane Smith", content: "Great teamwork everyone! See you all tomorrow.", time: "10:38 AM", isMine: false },
  ];

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  useRegisterVoiceCommand({
    id: "send-message",
    keywords: {
      en: ["send message", "send"],
      bn: ["মেসেজ পাঠাও", "পাঠাও"],
    },
    response: {
      en: "Sending message",
      bn: "মেসেজ পাঠানো হচ্ছে",
    },
    action: () => {
      // Logic to send message if we had real state update for messages
      if (message.trim()) {
        setMessage(""); // Clear input to simulate sending
      }
    }
  });

  return (
    <AppLayout>
      <div className="h-[calc(100vh-5rem)] md:h-[calc(100vh-2rem)] flex">
        {/* Chat List */}
        <div className={`w-full md:w-80 lg:w-96 bg-card border-r border-border flex flex-col ${!showChatList && 'hidden md:flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9 h-10 bg-secondary" />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat.id);
                  setShowChatList(false);
                }}
                className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors ${
                  selectedChat === chat.id ? "bg-secondary" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold shrink-0 ${
                  chat.isGroup ? "bg-gradient-hero text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground truncate">{chat.name}</p>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-background ${showChatList && 'hidden md:flex'}`}>
          {/* Chat Header */}
          <div className="bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowChatList(true)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                selectedConversation?.isGroup ? "bg-gradient-hero text-primary-foreground" : "bg-primary/10 text-primary"
              }`}>
                {selectedConversation?.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedConversation?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation?.isGroup ? "32 members • 5 online" : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${msg.isMine ? "order-2" : ""}`}>
                  {!msg.isMine && (
                    <p className="text-xs text-muted-foreground mb-1 ml-1">{msg.sender}</p>
                  )}
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.isMine 
                      ? "bg-primary text-primary-foreground rounded-br-md" 
                      : "bg-card border border-border rounded-bl-md"
                  }`}>
                    <p className={msg.isMine ? "text-primary-foreground" : "text-foreground"}>{msg.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${msg.isMine ? "text-right mr-1" : "ml-1"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-card border-t border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-10 h-11 bg-secondary"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Smile className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <Button variant="hero" size="icon">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
