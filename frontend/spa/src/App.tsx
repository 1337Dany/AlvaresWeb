import {useState, useEffect} from 'react';
import {
    Settings,
    User,
    HelpCircle,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Search,
    Eye,
    Edit,
    Trash2,
    X
} from 'lucide-react';

type ViewType = 'welcome' | 'chatList' | 'chatMessages';

interface Chat {
    chatId: string;
    chatName: string;
}

interface ChatMessage {
    id: string;
    chatId: string;
    message: string;
    timestamp: string;
}

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

// // Mock data for chats
// const generateMockChats = (): Chat[] => {
//   const chats = [
//     { name: 'John Doe', lastMessage: 'Thanks for the help!', count: 15 },
//     { name: 'Jane Smith', lastMessage: 'When is the next update?', count: 8 },
//     { name: 'Tech Support', lastMessage: 'Issue resolved', count: 23 },
//     { name: 'Sales Team', lastMessage: 'New proposal sent', count: 12 },
//     { name: 'Marketing Group', lastMessage: 'Campaign launched', count: 45 },
//     { name: 'Developer Chat', lastMessage: 'Bug fixed', count: 67 },
//     { name: 'Customer #1234', lastMessage: 'Product inquiry', count: 5 },
//     { name: 'VIP Client', lastMessage: 'Meeting scheduled', count: 34 },
//     { name: 'Beta Testers', lastMessage: 'Feedback submitted', count: 29 },
//     { name: 'General Support', lastMessage: 'Question about pricing', count: 18 },
//   ];
//
//   return chats.map((chat, idx) => ({
//     chatId: `chat_${100000 + idx}`,
//     chatName: chat.name,
//     lastMessage: chat.lastMessage,
//     messageCount: chat.count,
//   }));
// };

// Mock data for messages
// const generateMockMessages = (chatId: string): ChatMessage[] => {
//     const messages = [
//         "Hello, how can I help you?",
//         "I need information about your services",
//         "What are your business hours?",
//         "Thank you for the quick response!",
//         "Can you provide pricing details?",
//         "Is there a mobile app available?",
//         "How do I reset my password?",
//         "Great service, very satisfied!",
//         "I have a question about billing",
//         "When will the new features be released?",
//         "I'm having trouble logging in",
//         "Can I schedule a demo?",
//         "What payment methods do you accept?",
//         "How do I cancel my subscription?",
//         "The bot is very helpful, thanks!",
//         "I need technical support",
//         "Are there any discounts available?",
//         "How do I update my profile?",
//         "What's the refund policy?",
//         "Can I integrate this with other tools?",
//     ];
//
//     return messages.map((msg, idx) => ({
//         chatId: chatId,
//         message: msg,
//         timestamp: new Date(Date.now() - idx * 3600000).toLocaleString(),
//     }));
// };

const ITEMS_PER_PAGE = 5;

// Declare global onTelegramAuth function
declare global {
    interface Window {
        onTelegramAuth: (user: TelegramUser) => void;
    }
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('welcome');
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatListPage, setChatListPage] = useState(1);
    const [messagesPage, setMessagesPage] = useState(1);

    const [allChats, setAllChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    const [editText, setEditText] = useState('');

    const [newMessageText, setNewMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // Initialize Telegram Login Widget
    useEffect(() => {
        // Check if user is already logged in (from localStorage)
        const storedUser = localStorage.getItem('telegramUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setTelegramUser(user);
            setIsAuthenticated(true);
        }

        // Define the global callback function for Telegram widget
        window.onTelegramAuth = (user: TelegramUser) => {
            console.log('Logged in as ' + user.first_name + ' ' + (user.last_name || ''));
            setTelegramUser(user);
            setIsAuthenticated(true);
            // Store user data in localStorage
            localStorage.setItem('telegramUser', JSON.stringify(user));
        };

        // Load Telegram widget script only if not authenticated
        if (!isAuthenticated) {
            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-widget.js?22';
            script.setAttribute('data-telegram-login', 'find_context_bot');
            script.setAttribute('data-size', 'large');
            script.setAttribute('data-onauth', 'onTelegramAuth(user)');
            script.async = true;

            const container = document.getElementById('telegram-login-container');
            if (container) {
                container.appendChild(script);
            }
        }
    }, [isAuthenticated]);

    // Storing effect of editing
    useEffect(() => {
        if (selectedMessage) {
            setEditText(selectedMessage.message);
        }
    }, [selectedMessage]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setTelegramUser(null);
        localStorage.removeItem('telegramUser');
        setCurrentView('welcome');
    };

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
        setCurrentView('chatMessages');
        setMessagesPage(1);
        setSearchQuery('');
        fetchMessages(chatId);
    };

    const handleBackToChatList = () => {
        setCurrentView('chatList');
        setSelectedChatId(null);
        setSelectedMessage(null);
    };

    const handleRowClick = (item: ChatMessage) => {
        setSelectedMessage(item);
    };

    const handleDelete = async () => {
        if (!selectedMessage) return;

        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                const response = await fetch(
                    `/api/Message/chats/${selectedMessage.chatId}/messages/${selectedMessage.id}`,
                    {method: 'DELETE'}
                );

                if (response.ok) {
                    setAllMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
                    setSelectedMessage(null);
                } else {
                    alert("Failed to delete message");
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const handleEdit = async () => {
        if (!selectedMessage || !editText.trim()) return;

        try {
            const response = await fetch(
                `/api/Message/chats/${selectedMessage.chatId}/messages/${selectedMessage.id}`,
                {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(editText)
                }
            );

            if (response.ok) {
                setAllMessages(prev => prev.map(m =>
                    m.id === selectedMessage.id ? {...m, message: editText} : m
                ));
                setSelectedMessage(null);
                alert("Message updated successfully!");
            } else {
                alert("Failed to update message");
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleView = () => {
        alert(`View details for message: ${selectedMessage?.message}`);
    };

    const handleSearch = () => {
        setMessagesPage(1);
    };

    const handleSendMessage = async () => {
        if (!newMessageText.trim() || !selectedChatId || !telegramUser) return;

        setIsSending(true);
        try {
            const response = await fetch('/api/Message', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chatId: selectedChatId,
                    telegramUserId: String(telegramUser.id), // ID из виджета логина
                    text: newMessageText,
                })
            });

            if (response.ok) {
                const savedMessage = await response.json();

                // Добавляем новое сообщение в начало или конец списка
                const newMsgFormatted: ChatMessage = {
                    id: savedMessage.id,
                    chatId: selectedChatId,
                    message: savedMessage.text,
                    timestamp: new Date(savedMessage.createdAt).toLocaleString()
                };

                setAllMessages(prev => [newMsgFormatted, ...prev]);
                setNewMessageText(''); // Очищаем поле
            }
        } catch (error) {
            console.error("Send error:", error);
        } finally {
            setIsSending(false);
        }
    };

    // Chat List Logic
    const fetchChats = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/chats');
            if (!response.ok) throw new Error('Chat load error');

            const data = await response.json();

            const formattedChats: Chat[] = data.map((item: any) => ({
                chatId: item.Id || item.id,
                chatName: item.Title || item.title,
            }));

            setAllChats(formattedChats);
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to load chats");
        } finally {
            setIsLoading(false);
        }
    };

    // Chat list validation logic
    const validateMessage = (text: string) => {
        if (text.length > 4096) return "Message is too long (max 4096 chars)";
        if (text.trim().length === 0) return "Message cannot be empty";
        return null;
    };

    // Messages from chat logic
    const fetchMessages = async (chatId: string) => {
        setIsMessagesLoading(true);
        try {
            const response = await fetch(`/api/Message/chats/${chatId}`);
            if (!response.ok) throw new Error('Failed to load messages');

            const data = await response.json();

            const formattedMessages: ChatMessage[] = data.map((item: any) => ({
                id: item.id,
                chatId: chatId,
                message: item.text,
                timestamp: new Date(item.createdAt).toLocaleString(),
            }));

            setAllMessages(formattedMessages);
        } catch (error) {
            console.error("Fetch messages error:", error);
            alert("Failed to load messages for this chat");
        } finally {
            setIsMessagesLoading(false);
        }
    };

    //const allChats = generateMockChats();
    const chatTotalPages = Math.ceil(allChats.length / ITEMS_PER_PAGE);
    const chatStartIndex = (chatListPage - 1) * ITEMS_PER_PAGE;
    const chatEndIndex = chatStartIndex + ITEMS_PER_PAGE;
    const currentChats = allChats.slice(chatStartIndex, chatEndIndex);

    // Messages Logic
    //const allMessages = selectedChatId ? generateMockMessages(selectedChatId) : [];
    const filteredMessages = allMessages.filter(msg =>
        msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.chatId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const messagesTotalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
    const messagesStartIndex = (messagesPage - 1) * ITEMS_PER_PAGE;
    const messagesEndIndex = messagesStartIndex + ITEMS_PER_PAGE;
    const currentMessages = filteredMessages.slice(messagesStartIndex, messagesEndIndex);

    // If not authenticated, show login screen
    if (!isAuthenticated) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello!</h1>
                        <p className="text-gray-600">Welcome to Telegram Bot Dashboard</p>
                    </div>
                    <div id="telegram-login-container" className="flex justify-center"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <header
                className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 z-40 pl-24">
                {/* Chat List Button */}
                <button
                    onClick={() => {
                        setCurrentView('chatList');
                        fetchChats();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors mr-auto"
                >
                    <MessageSquare className="w-5 h-5 text-gray-700"/>
                    <span className="text-sm font-medium text-gray-700">Chat List</span>
                </button>

                {/* Right: Account */}
                <div className="relative">
                    <button
                        onClick={() => setIsAccountOpen(!isAccountOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <User className="w-5 h-5 text-gray-700"/>
                        <span className="text-sm font-medium text-gray-700">
              {telegramUser?.username ? `@${telegramUser.username}` : telegramUser?.first_name}
            </span>
                    </button>

                    {isAccountOpen && (
                        <div
                            className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">
                                    {telegramUser?.first_name} {telegramUser?.last_name || ''}
                                </p>
                                {telegramUser?.username && (
                                    <p className="text-xs text-gray-500">@{telegramUser.username}</p>
                                )}
                            </div>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                Profile Settings
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                Privacy
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                Security
                            </button>
                            <hr className="my-2 border-gray-200"/>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Left Sidebar */}
            <aside
                className="fixed top-0 left-0 w-20 h-full bg-white border-r border-gray-200 z-40 flex flex-col items-center pt-4">
                {/* Settings Menu */}
                <div className="relative">
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Settings"
                    >
                        <Settings className="w-6 h-6 text-gray-700"/>
                    </button>

                    {isSettingsOpen && (
                        <div
                            className="absolute top-0 left-full ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                Bot Configuration
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                API Settings
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                Webhook Settings
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                                Notifications
                            </button>
                        </div>
                    )}
                </div>

                {/* Support Button - Bottom of Sidebar */}
                <div className="mt-auto mb-6">
                    <button
                        className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        title="Support"
                    >
                        <HelpCircle className="w-6 h-6"/>
                    </button>
                </div>
            </aside>

            {/* CRUD Operations Panel */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Message Operations</h3>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Chat ID</label>
                                <p className="text-gray-900 font-mono">{selectedMessage.chatId}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Message</label>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Edit Message</label>
                                    <textarea
                                        value={editText}
                                        onChange={(e) => {
                                            setEditText(e.target.value);
                                            setError(validateMessage(e.target.value));
                                        }}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        rows={3}
                                    />
                                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                                    <div className="text-xs text-gray-400 text-right">
                                        {editText.length} / 4096
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Timestamp</label>
                                <p className="text-gray-900">{selectedMessage.timestamp}</p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex items-center gap-3">
                            <button
                                onClick={handleView}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Eye className="w-4 h-4"/>
                                <span>View</span>
                            </button>

                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Edit className="w-4 h-4"/>
                                <span>Edit</span>
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Trash2 className="w-4 h-4"/>
                                <span>Delete</span>
                            </button>

                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="ml-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="pt-16 pl-20 min-h-screen">
                <div className="h-full">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Telegram Bot Dashboard</h1>

                            {/* Welcome View */}
                            {currentView === 'welcome' && (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <p className="text-gray-600 mb-6">Click "Chat List" to view all your chats</p>
                                </div>
                            )}

                            {/* Chat List View */}
                            {currentView === 'chatList' && (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Chat
                                                    ID
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Chat
                                                    Name
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {currentChats.map((chat, index) => (
                                                <tr
                                                    key={`${chat.chatId}-${index}`}
                                                    onClick={() => handleChatSelect(chat.chatId)}
                                                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                                                >
                                                    <td className="py-3 px-4 text-gray-700 font-mono text-sm">{chat.chatId}</td>
                                                    <td className="py-3 px-4 text-gray-900 font-medium">{chat.chatName}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Chat List Pagination */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            Showing {chatStartIndex + 1} to {Math.min(chatEndIndex, allChats.length)} of {allChats.length} chats
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => chatListPage > 1 && setChatListPage(chatListPage - 1)}
                                                disabled={chatListPage === 1}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4"/>
                                                <span className="text-sm font-medium">Previous</span>
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({length: chatTotalPages}, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setChatListPage(page)}
                                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                            chatListPage === page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => chatListPage < chatTotalPages && setChatListPage(chatListPage + 1)}
                                                disabled={chatListPage === chatTotalPages}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <span className="text-sm font-medium">Next</span>
                                                <ChevronRight className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chat Messages View */}
                            {currentView === 'chatMessages' && selectedChatId && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <button
                                            onClick={handleBackToChatList}
                                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4"/>
                                            <span className="text-sm font-medium">Back to Chat List</span>
                                        </button>
                                        <div className="text-sm text-gray-600">
                                            Viewing messages from: <span
                                            className="font-mono font-semibold">{selectedChatId}</span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Chat
                                                    ID
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Message</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Timestamp</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {currentMessages.map((item, index) => (
                                                <tr
                                                    key={`${item.chatId}-${index}`}
                                                    onClick={() => handleRowClick(item)}
                                                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                                                >
                                                    <td className="py-3 px-4 text-gray-700 font-mono text-sm">{item.chatId}</td>
                                                    <td className="py-3 px-4 text-gray-700">{item.message}</td>
                                                    <td className="py-3 px-4 text-gray-600 text-sm">{item.timestamp}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Messages Pagination */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">
                                            Showing {messagesStartIndex + 1} to {Math.min(messagesEndIndex, filteredMessages.length)} of {filteredMessages.length} messages
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => messagesPage > 1 && setMessagesPage(messagesPage - 1)}
                                                disabled={messagesPage === 1}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4"/>
                                                <span className="text-sm font-medium">Previous</span>
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({length: messagesTotalPages}, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setMessagesPage(page)}
                                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                            messagesPage === page
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => messagesPage < messagesTotalPages && setMessagesPage(messagesPage + 1)}
                                                disabled={messagesPage === messagesTotalPages}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <span className="text-sm font-medium">Next</span>
                                                <ChevronRight className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Message send block */}
                                    <div className="pt-4 border-t border-gray-200 mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Send message as <span
                                            className="text-blue-600">@{telegramUser?.username}</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <textarea
                                                value={newMessageText}
                                                onChange={(e) => setNewMessageText(e.target.value)}
                                                placeholder="Type your message..."
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                rows={2}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={isSending || !newMessageText.trim()}
                                                className="flex items-center justify-center px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                {isSending ? 'Sending...' : 'Send'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search Label at Bottom */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Search
                                            Messages</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                placeholder="Search by message or chat ID..."
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={handleSearch}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Search className="w-4 h-4"/>
                                                <span>Search</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}