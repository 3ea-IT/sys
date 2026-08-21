import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import {
  ChevronDown,
  Search,
  Zap,
  Lock,
  User,
  CreditCard,
  RotateCcw,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I book an experience?",
      answer: "You can book experiences in two ways: instant booking for immediate access, or by placing a hold to secure my seat. Navigate to Explore, select an experience, and choose your preferred booking method.",
      category: "Booking",
      icon: Zap
    },
    {
      id: 2,
      question: "What's the difference between Instant Book and Hold?",
      answer: "Instant Book gives you immediate access to the experience, while Hold reserves your spot and confirms your booking within 24 hours. Holds are useful when you want to secure a seat but need time to prepare.",
      category: "Booking",
      icon: Zap
    },
    {
      id: 3,
      question: "How do I cancel a booking?",
      answer: "You can cancel confirmed bookings from your Bookings page. Click on the booking, then select the cancel option. Cancellations are subject to your refund policy.",
      category: "Booking",
      icon: RotateCcw
    },
    {
      id: 4,
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, debit cards, and digital wallets. Your payment information is securely encrypted and never stored on our servers.",
      category: "Payment",
      icon: CreditCard
    },
    {
      id: 5,
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption (SSL/TLS) to protect all payment information. We comply with PCI DSS standards and never store full credit card details on our servers.",
      category: "Payment",
      icon: CreditCard
    },
    {
      id: 6,
      question: "Can I use multiple payment methods?",
      answer: "Yes, you can save multiple payment methods in your account settings and choose which one to use during checkout.",
      category: "Payment",
      icon: CreditCard
    },
    {
      id: 7,
      question: "How do I update my profile?",
      answer: "Go to Profile, click on your avatar to upload a new profile picture, or select 'Profile Management' to update your personal information.",
      category: "Account",
      icon: User
    },
    {
      id: 8,
      question: "How do I reset my password?",
      answer: "On the login page, click 'Forgot Password' and follow the instructions sent to your email. You'll be able to set a new password within 24 hours.",
      category: "Account",
      icon: Lock
    },
    {
      id: 9,
      question: "How do I delete my account?",
      answer: "You can delete your account by going to Profile > Profile Management. Note that this action is permanent and cannot be undone. All your bookings and data will be removed.",
      category: "Account",
      icon: Lock
    },
    {
      id: 10,
      question: "What should I do if I forget my username?",
      answer: "Your username is your email address. If you can't remember your email, you can use the password reset feature and check the email address used for the account.",
      category: "Account",
      icon: User
    },
  ];

  const categories = [...new Set(faqs.map(f => f.category))];
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: faqs.filter(f => f.category === cat).length
  }));

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const getCategoryColor = (category) => {
    const colors = {
      "Booking": "from-blue-500 to-blue-600 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30",
      "Payment": "from-green-500 to-green-600 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30",
      "Account": "from-purple-500 to-purple-600 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30",
    };
    return colors[category] || "from-gray-500 to-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30";
  };
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 pb-4 border-b border-brand-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/help"
            className="p-1.5 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
          </Link>
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
            Frequently Asked Questions
          </h1>
        </div>
        <p className="text-sm text-brand-secondary dark:text-gray-400 px-1">
          Find answers to common questions about Secure My Seat
        </p>
      </div>
      {/* Search Bar bar*/}
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-secondary dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 md:py-4 bg-white dark:bg-gray-800 rounded-xl border border-brand-border dark:border-gray-700 text-brand-primary dark:text-gray-100 placeholder-brand-secondary dark:placeholder-gray-400 focus:outline-none focus:border-brand-primary dark:focus:border-blue-400 transition-colors text-sm md:text-base"
        />
      </div>
      {/* Category Filter */}
      <div className="mb-8">
        <p className="text-xs font-bold text-brand-secondary dark:text-gray-400 uppercase tracking-widest mb-2">
          Filter by Category
        </p>
        <div className="flex gap-1 md:gap-2 flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              selectedCategory === null
                ? "bg-brand-primary text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-brand-primary dark:text-gray-100 border border-brand-border dark:border-gray-700 hover:border-brand-primary dark:hover:border-blue-400"
            }`}>
            <span className="hidden md:inline">All ({faqs.length})</span>
            <span className="md:hidden">All</span>
          </button>
          {categoryStats.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                selectedCategory === cat.name
                  ? "bg-brand-primary text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-brand-primary dark:text-gray-100 border border-brand-border dark:border-gray-700 hover:border-brand-primary dark:hover:border-blue-400"
              }`}
            >
              <span className="hidden md:inline">{cat.name} ({cat.count})</span>
              <span className="md:hidden">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Stats */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base font-semibold text-brand-primary dark:text-gray-100">
            {filteredFaqs.length} of {faqs.length} FAQs
          </span>
        </div>
        {filteredFaqs.length === 0 && (
          <span className="text-xs text-brand-secondary dark:text-gray-400">
            No matching results found
          </span>
        )}
      </div>
      {/* FAQ Items */}
      <div className="space-y-3 mb-10">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isExpanded={expandedFAQ === faq.id}
              onToggle={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
              categoryColor={getCategoryColor(faq.category)}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-brand-secondary dark:text-gray-500 mx-auto mb-4 opacity-40" />
            <p className="text-base font-semibold text-brand-primary dark:text-gray-100 mb-2">
              No FAQs Found
            </p>
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {/* Help Section */}
      {filteredFaqs.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 md:p-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
                Didn't find what you're looking for?
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Visit our <Link href="/help" className="underline font-semibold hover:no-underline">Help & Support</Link> page to contact our support team or view more resources.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="h-10"></div>
    </AppLayout>
  );
}

/* ================= COMPONENTS ================= */

function FAQItem({ faq, isExpanded, onToggle, categoryColor }) {
  const IconComponent = faq.icon;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 overflow-hidden transition-all ${
        isExpanded ? "shadow-lg" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 md:px-6 py-4 md:py-5 hover:bg-brand-background dark:hover:bg-gray-700/50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-brand-background dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <IconComponent size={20} className="text-brand-primary dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-brand-primary dark:text-gray-100 text-sm md:text-base leading-snug">
              {faq.question}
            </h3>
            {/* <span className={`inline-block text-xs font-bold mt-2 px-3 py-1 rounded-full ${categoryColor}`}>
              {faq.category}
            </span> */}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-brand-secondary dark:text-gray-400 transition-transform ml-3 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-4 md:px-6 py-5 bg-brand-background/50 dark:bg-gray-700/30 border-t border-brand-border dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
          <p className="text-sm md:text-base text-brand-secondary dark:text-gray-300 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}
