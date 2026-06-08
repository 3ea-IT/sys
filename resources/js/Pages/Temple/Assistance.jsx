import AppLayout from "@/Layouts/AppLayout";
import { useState } from "react";

export default function Assistance({ templates = [] }) {
    const [messages, setMessages] = useState([
        {
            type: "assistant",
            text: "Namaste! 🙏",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = () => {
        if (inputValue.trim() === "") return;

        // Add user message
        const newMessages = [...messages, { type: "user", text: inputValue }];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "That's a great question! Let me help you with information about temple visits and spiritual practices. I can provide guidance on rituals, dress codes, best times to visit, and much more!",
                "I'd be happy to help! Whether you're planning a pilgrimage or seeking spiritual guidance, I'm here to assist you with all your temple-related queries.",
                "Wonderful! I can help you with detailed information about temple protocols, festival celebrations, and spiritual practices.",
            ];
            const randomResponse =
                responses[Math.floor(Math.random() * responses.length)];
            setMessages([
                ...newMessages,
                { type: "assistant", text: randomResponse },
            ]);
            setIsLoading(false);
        }, 1000);
    };

    const handleTemplateClick = (template) => {
        const newMessages = [...messages, { type: "user", text: template }];
        setMessages(newMessages);
        setIsLoading(true);

        setTimeout(() => {
            const responses = {
                "Temple dress codes":
                    "For temple visits, women typically wear traditional clothing like sarees, salwar kameez, or full-coverage traditional wear. Men often wear dhoti or traditional attire. Ensure shoulders and knees are covered. Remove shoes before entering the temple.",
                "Best time to visit":
                    "The best time to visit temples is early morning (5-7 AM) for the most serene experience and fewer crowds. Festival seasons are also special but more crowded. Avoid noon hours as temples can be extremely crowded.",
                "Pooja for health":
                    "Many temples offer special poojas for health and wellness. Popular ones include Rudra Abhisheka, Ayurveda-based rituals, and health-blessing poojas. Consult with the temple priest for personalized recommendations.",
                "Senior citizen tips":
                    "Plan visits during non-peak hours. Use available wheelchairs or seating areas. Bring water and medications. Many temples have special arrangements for elderly pilgrims. Ensure proper hydration and rest breaks.",
                "Festival calendar":
                    "Major temple festivals include Navratri, Diwali, Holi, Maha Shivaratri, and temple-specific celebrations. Each festival has unique rituals and spiritual significance. Check with your local temple for exact dates.",
                "Travel route plan":
                    "I can help you plan the most efficient temple pilgrimage routes. Share your starting location and preferred temples, and I'll suggest the best routes considering distance, accessibility, and spiritual significance.",
            };

            const response =
                responses[template] ||
                "That's an excellent topic! Let me provide you with comprehensive information.";

            setMessages([
                ...newMessages,
                { type: "assistant", text: response },
            ]);
            setIsLoading(false);
        }, 1200);
    };

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto">
                {/* ── HEADER ── */}
                <div className="mb-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-3xl">
                            🕉️
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                        AI Spiritual Guide
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                        Your personal temple & pilgrimage assistant
                    </p>
                </div>

                {/* ── CHAT CONTAINER ── */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card overflow-hidden flex flex-col h-96 md:h-96">
                    {/* ── MESSAGES ── */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 1 &&
                        messages[0].type === "assistant" &&
                        messages[0].text === "Namaste! 🙏" ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        Namaste! 🙏
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        I'm your AI spiritual guide. Ask me
                                        about temple visits, rituals, dress
                                        codes, travel routes, pooja
                                        recommendations, or anything about your
                                        pilgrimage journey.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            msg.type === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                                                msg.type === "user"
                                                    ? "text-white rounded-br-none"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                                            }`}
                                            style={
                                                msg.type === "user"
                                                    ? {
                                                          backgroundColor:
                                                              "#c33c01",
                                                      }
                                                    : {}
                                            }
                                        >
                                            <p className="text-sm">
                                                {msg.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* ── INPUT AREA ── */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask about temples, rituals, dress codes, travel..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") handleSendMessage();
                                }}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-0 text-sm disabled:opacity-50"
                                style={{ "--tw-ring-color": "#c33c01" }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || inputValue.trim() === ""}
                                className="text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                                style={{ backgroundColor: "#c33c01" }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── TEMPLATES/SUGGESTIONS ── */}
                {messages.length === 1 &&
                    messages[0].type === "assistant" &&
                    messages[0].text === "Namaste! 🙏" && (
                        <div className="mt-8">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Quick suggestions:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {templates.map((template, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            handleTemplateClick(template.label)
                                        }
                                        className="p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors text-left"
                                    >
                                        <p className="text-2xl mb-1">
                                            {template.icon}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {template.label}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
            </div>
        </AppLayout>
    );
}
