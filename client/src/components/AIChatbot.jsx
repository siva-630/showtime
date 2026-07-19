import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles, Loader2, Mic, MicOff, StopCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI movie assistant. Tell me what kind of movie you are in the mood for, or ask for recommendations based on our available shows!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const { shows, axios, getToken, user } = useAppContext();
  const [allTimings, setAllTimings] = useState([]);

  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const { data } = await axios.get('/api/show/all-timings');
        if (data.success) {
          setAllTimings(data.shows);
        }
      } catch (err) {
        console.error("Failed to fetch timings", err);
      }
    };
    fetchTimings();
  }, [axios]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Gemini API key is missing. Please ask the developer to add VITE_GEMINI_API_KEY to the .env file.' }]);
        setIsLoading(false);
        return;
      }

      // Create context from available shows
      const timingsContext = allTimings?.map(s =>
        `- Movie: ${s.movie?.title}, Time: ${new Date(s.showDateTime).toLocaleString()}, Theater: ${s.theater || 'Main'}, ShowId: ${s._id}, Price: ₹${s.showPrice}`
      ).join('\n') || 'No movies currently listed in the database.';

      const systemPrompt = `You are an expert AI movie recommendation and booking assistant for a cinema app called "ShowTime". 
Your job is to recommend movies, answer questions about pricing and seat availability, and assist with ticket booking directly through chat.

Here is the list of currently available movie timings:
${timingsContext}

CONSTRAINTS & CAPABILITIES:
1. Recommending Movies: Prioritize recommending movies from the list above based on mood, genre, or favorite actors.
2. Pricing & Details: Use the exact Price from the list above. Provide these details when asked.
3. Seat Availability & Best Seats: Recommend middle row center seats (like E4, E5, E6). Assume they are available unless told otherwise.
4. ACTUAL BOOKING: When the user confirms exactly which movie, time, and seats they want to book, you MUST output a secret command in your response exactly like this to trigger the booking:
ACTION_BOOK_TICKET={"showId": "the-exact-showId", "selectedSeats": ["E4", "E5"]}
5. Dynamic Options: Always provide 2-3 logical next steps for the user as clickable options at the very end of your response. Format these exactly as a JSON array starting with "OPTIONS: ". Example: 
OPTIONS: ["Show Timings", "Check Available Seats", "Confirm Booking"]

Keep responses helpful, professional, and format your responses with markdown for readability.`;

      const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood! I will act as the ShowTime movie assistant and prioritize the available movies." }] },
        ...messages.slice(1).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        { role: "user", parts: [{ text: textToSend }] }
      ];

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contents }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API request failed with status ${res.status}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log("Generation stopped by user.");
      } else {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message || 'I encountered an error connecting to the AI.'}` }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const renderMessageContent = (content) => {
    let text = content;
    let options = [];
    let bookingData = null;

    const optionsMatch = text.match(/OPTIONS:\s*(\[.*\])/);
    if (optionsMatch) {
      text = text.replace(optionsMatch[0], '');
      try {
        options = JSON.parse(optionsMatch[1]);
      } catch (e) {
        console.error("Failed to parse options", e);
      }
    }

    const bookingMatch = text.match(/ACTION_BOOK_TICKET=({.*})/);
    if (bookingMatch) {
      text = text.replace(bookingMatch[0], '');
      try {
        bookingData = JSON.parse(bookingMatch[1]);
      } catch (e) {
        console.error("Failed to parse booking data", e);
      }
    }

    return { text, options, bookingData };
  };

  const handleActualBooking = async (bookingData) => {
    if (!user) {
      toast.error('Please login to book tickets');
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/booking/create', {
        showId: bookingData.showId,
        selectedSeats: bookingData.selectedSeats
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Booking failed");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  const quickActions = [
    "What are the timings?",
    "Show available seats",
    "Best recommendations",
    "Book a ticket"
  ];

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  const toggleListen = () => {
    if (isListening) return; // SpeechRecognition auto-stops, so we just handle start
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible overlay to close drawer without blurring background */}
      <div className="fixed inset-0 z-[90] bg-transparent" onClick={onClose} />

      <div className="fixed top-0 right-0 z-[100] w-full max-w-[420px] h-screen bg-gray-900/95 backdrop-blur-md border-l border-gray-700/50 shadow-2xl flex flex-col animate-in slide-in-from-right-1/2 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-gray-400">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
          {messages.map((msg, idx) => {
            const { text, options, bookingData } = msg.role === 'assistant' ? renderMessageContent(msg.content) : { text: msg.content, options: [], bookingData: null };
            return (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-primary'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm'
                  }`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <>
                      <ReactMarkdown
                        components={{
                          img: ({ node, ...props }) => <img style={{ maxWidth: '100%', borderRadius: '8px' }} {...props} />,
                          p: ({ node, ...props }) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.5' }} {...props} />
                        }}
                      >
                        {text}
                      </ReactMarkdown>
                      {bookingData && (
                        <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-primary/50 text-center shadow-inner">
                          <p className="text-sm font-semibold mb-1 text-white">Booking Ready!</p>
                          <p className="text-xs text-gray-400 mb-3">Seats: {bookingData.selectedSeats.join(', ')}</p>
                          <button
                            onClick={() => handleActualBooking(bookingData)}
                            className="w-full py-2 bg-primary hover:bg-primary-dull text-white text-sm font-semibold rounded-md transition"
                          >
                            Confirm & Pay
                          </button>
                        </div>
                      )}
                      {options.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-700/50">
                          {options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleQuickAction(opt)}
                              className="px-3 py-1.5 bg-gray-700 hover:bg-primary/20 text-gray-300 hover:text-primary text-xs rounded-full border border-gray-600 hover:border-primary/50 transition-colors text-left"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-3 bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length < 3 && !isLoading && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-800">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-primary/20 text-gray-300 hover:text-primary text-xs rounded-full border border-gray-700 hover:border-primary/50 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a movie recommendation..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={toggleListen}
              className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            {isLoading ? (
              <button
                type="button"
                onClick={handleStop}
                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg shadow-red-500/20"
                title="Stop Generating"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 bg-primary hover:bg-primary-dull disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors shadow-lg shadow-primary/20"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
