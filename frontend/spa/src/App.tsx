import { useState, useEffect } from 'react';
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

type ViewType = 'welcome' | 'chatList' | 'chatMessages';

interface Chat {
  id: string;
  title: string;
}

interface ChatListResponse {
  items: Chat[];
  totalCount: number;
}

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
  auth_date: number;
  hash: string;
}

const ITEMS_PER_PAGE = 5;

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [totalChats, setTotalChats] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Telegram auth
  useEffect(() => {
    const storedUser = localStorage.getItem('telegramUser');
    if (storedUser) {
      setTelegramUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    window.onTelegramAuth = (user: TelegramUser) => {
      setTelegramUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('telegramUser', JSON.stringify(user));
    };

    if (!isAuthenticated) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'find_context_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;

      document.getElementById('telegram-login-container')?.appendChild(script);
    }
  }, [isAuthenticated]);

  // Load chats with server-side pagination
  useEffect(() => {
    if (!isAuthenticated || currentView !== 'chatList') return;

    const fetchChats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
            `/api/chats?page=${page}&pageSize=${ITEMS_PER_PAGE}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: ChatListResponse = await res.json();
        setChats(data.items);
        setTotalChats(data.totalCount);
      } catch (e) {
        console.error(e);
        setError('Failed to load chats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [isAuthenticated, currentView, page]);

  const totalPages = Math.ceil(totalChats / ITEMS_PER_PAGE);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setCurrentView('chatMessages');
  };

  const handleBack = () => {
    setCurrentView('chatList');
    setSelectedChatId(null);
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Telegram Bot Dashboard
            </h1>
            <div id="telegram-login-container" />
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <header className="h-16 bg-white border-b flex items-center px-6">
          <button
              onClick={() => {
                setCurrentView('chatList');
                setPage(1);
              }}
              className="flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Chats
          </button>
        </header>

        <main className="p-6 max-w-5xl mx-auto">
          {currentView === 'welcome' && (
              <p className="text-gray-600">
                Select chat list to begin
              </p>
          )}

          {currentView === 'chatList' && (
              <>
                {isLoading && <p>Loading…</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!isLoading && !error && (
                    <>
                      <table className="w-full border">
                        <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left">Chat ID</th>
                          <th className="p-2 text-left">Title</th>
                        </tr>
                        </thead>
                        <tbody>
                        {chats.map(chat => (
                            <tr
                                key={chat.id}
                                onClick={() => handleChatSelect(chat.id)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                              <td className="p-2 font-mono">{chat.id}</td>
                              <td className="p-2">{chat.title}</td>
                            </tr>
                        ))}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>

                        <div className="flex gap-2">
                          <button
                              disabled={page === 1}
                              onClick={() => setPage(p => p - 1)}
                              className="px-3 py-1 border rounded disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                              disabled={page === totalPages}
                              onClick={() => setPage(p => p + 1)}
                              className="px-3 py-1 border rounded disabled:opacity-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                )}
              </>
          )}

          {currentView === 'chatMessages' && selectedChatId && (
              <>
                <button
                    onClick={handleBack}
                    className="mb-4 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <p className="text-gray-700">
                  Messages for chat{' '}
                  <span className="font-mono">{selectedChatId}</span>
                </p>

                <p className="text-sm text-gray-400 mt-4">
                  Messages endpoint not implemented yet
                </p>
              </>
          )}
        </main>
      </div>
  );
}
