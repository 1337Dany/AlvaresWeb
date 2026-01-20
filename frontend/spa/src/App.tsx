import { useEffect, useState } from 'react';
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
    lastMessage: string;
    messageCount: number;
}

interface ChatMessage {
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

const ITEMS_PER_PAGE = 5;

/* ---------- MOCK MESSAGES ---------- */
const generateMockMessages = (chatId: string): ChatMessage[] => {
    return Array.from({ length: 23 }, (_, i) => ({
        chatId,
        message: `Mock message #${i + 1} from ${chatId}`,
        timestamp: new Date(Date.now() - i * 60000).toLocaleString()
    }));
};

/* ---------- APP ---------- */
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

    const [currentView, setCurrentView] = useState<ViewType>('welcome');
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [chatListPage, setChatListPage] = useState(1);
    const [messagesPage, setMessagesPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);

    /* ---------- AUTH MOCK ---------- */
    useEffect(() => {
        const stored = localStorage.getItem('telegramUser');
        if (stored) {
            setTelegramUser(JSON.parse(stored));
            setIsAuthenticated(true);
        }
    }, []);

    /* ---------- LOAD CHATS FROM BACKEND ---------- */
    const loadChats = async (userId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/chats?userId=${userId}`);
            if (!res.ok) throw new Error('Failed to load chats');
            const data: Chat[] = await res.json();
            setChats(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    /* ---------- CHAT SELECT ---------- */
    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
        setCurrentView('chatMessages');
        setMessagesPage(1);
        setSearchQuery('');
        setMessages(generateMockMessages(chatId));
    };

    /* ---------- PAGINATION ---------- */
    const chatTotalPages = Math.ceil(chats.length / ITEMS_PER_PAGE);
    const chatStart = (chatListPage - 1) * ITEMS_PER_PAGE;
    const chatEnd = chatStart + ITEMS_PER_PAGE;
    const currentChats = chats.slice(chatStart, chatEnd);

    const filteredMessages = messages.filter(m =>
        m.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const messagesTotalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
    const msgStart = (messagesPage - 1) * ITEMS_PER_PAGE;
    const msgEnd = msgStart + ITEMS_PER_PAGE;
    const currentMessages = filteredMessages.slice(msgStart, msgEnd);

    /* ---------- LOGIN SCREEN ---------- */
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <button
                    onClick={() => {
                        const mockUser: TelegramUser = {
                            id: 1,
                            first_name: 'Test',
                            auth_date: Date.now(),
                            hash: 'mock'
                        };
                        localStorage.setItem('telegramUser', JSON.stringify(mockUser));
                        setTelegramUser(mockUser);
                        setIsAuthenticated(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                >
                    Mock Login
                </button>
            </div>
        );
    }

    /* ---------- UI ---------- */
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="h-16 bg-white border-b flex items-center px-6">
                <button
                    onClick={() => {
                        setCurrentView('chatList');
                        telegramUser && loadChats(telegramUser.id);
                    }}
                    className="flex items-center gap-2"
                >
                    <MessageSquare />
                    Chat List
                </button>
            </header>

            <main className="p-6">
                {currentView === 'welcome' && (
                    <p>Click Chat List to load chats</p>
                )}

                {currentView === 'chatList' && (
                    <>
                        {isLoading && <p>Loading...</p>}
                        {error && <p className="text-red-600">{error}</p>}

                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>Chat ID</th>
                                <th>Name</th>
                                <th>Last Message</th>
                                <th>Count</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentChats.map(chat => (
                                <tr
                                    key={chat.chatId}
                                    onClick={() => handleChatSelect(chat.chatId)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    <td>{chat.chatId}</td>
                                    <td>{chat.chatName}</td>
                                    <td>{chat.lastMessage}</td>
                                    <td>{chat.messageCount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {chats.length > 0 && (
                            <div className="flex gap-2 mt-4">
                                <button
                                    disabled={chatListPage === 1}
                                    onClick={() => setChatListPage(p => p - 1)}
                                >
                                    <ChevronLeft />
                                </button>

                                <span>{chatListPage} / {chatTotalPages}</span>

                                <button
                                    disabled={chatListPage === chatTotalPages}
                                    onClick={() => setChatListPage(p => p + 1)}
                                >
                                    <ChevronRight />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {currentView === 'chatMessages' && selectedChatId && (
                    <>
                        <button
                            onClick={() => setCurrentView('chatList')}
                            className="mb-4 flex items-center gap-2"
                        >
                            <ArrowLeft /> Back
                        </button>

                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search messages"
                            className="border px-3 py-2 mb-4 w-full"
                        />

                        <table className="w-full">
                            <thead>
                            <tr>
                                <th>Message</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentMessages.map((m, i) => (
                                <tr
                                    key={i}
                                    onClick={() => setSelectedMessage(m)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    <td>{m.message}</td>
                                    <td>{m.timestamp}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="flex gap-2 mt-4">
                            <button
                                disabled={messagesPage === 1}
                                onClick={() => setMessagesPage(p => p - 1)}
                            >
                                <ChevronLeft />
                            </button>

                            <span>{messagesPage} / {messagesTotalPages}</span>

                            <button
                                disabled={messagesPage === messagesTotalPages}
                                onClick={() => setMessagesPage(p => p + 1)}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </>
                )}
            </main>

            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <p>{selectedMessage.message}</p>
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="mt-4 px-4 py-2 bg-gray-200 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
