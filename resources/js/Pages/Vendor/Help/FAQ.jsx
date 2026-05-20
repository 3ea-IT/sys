import VendorAppLayout from "@/Layouts/VendorAppLayout";
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
  AlertCircle,
  BarChart3,
  Shield,
  Clock
} from "lucide-react";
import { useState } from "react";

export default function VendorFAQ() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const faqs = [
    // Experience Management
    {
      id: 1,
      question: "How do I list a new experience?",
      answer: "Go to your Vendor Dashboard, click 'Add Experience', fill in the experience details (name, description, price, duration, capacity), upload images, and set your availability schedule. Once submitted, our team will review and verify the experience within 24 hours.",
      category: "Experience Management",
      icon: Zap
    },
    {
      id: 2,
      question: "What are the requirements for adding an experience?",
      answer: "Your experience must have a clear description, at least 2 high-quality images, a competitive price, maximum capacity, duration information, and availability schedule. Experiences should be unique and engaging to attract more customers.",
      category: "Experience Management",
      icon: Zap
    },
    {
      id: 3,
      question: "Can I edit my experience after listing?",
      answer: "Yes, you can edit most details like description, images, pricing, and schedule. However, major changes may require re-verification by our team. If you edit capacity or experience type significantly, the system may flag it for review.",
      category: "Experience Management",
      icon: Zap
    },
    {
      id: 4,
      question: "What should I do if my experience is rejected?",
      answer: "You'll receive a notification explaining the rejection reason. Common reasons include incomplete details, image quality, or policy violations. Review the feedback, make corrections, and resubmit.",
      category: "Experience Management",
      icon: Zap
    },
    {
      id: 5,
      question: "How do I delete an experience?",
      answer: "Go to Experience Management, find the experience, and click the delete button. Note: You cannot delete experiences with active or pending bookings. Cancel or complete all bookings first.",
      category: "Experience Management",
      icon: Zap
    },

    // Booking Management
    {
      id: 6,
      question: "What's the difference between Instant Book and Hold?",
      answer: "Instant Book means customers get confirmed access immediately. Hold is a temporary reservation that you must confirm within 24 hours. During this time, you can verify availability and customer details before confirming.",
      category: "Booking Management",
      icon: Clock
    },
    {
      id: 7,
      question: "How do I check in a customer?",
      answer: "On the day of the experience, go to your Dashboard or Bookings section, find the booking, and click 'Check In'. This confirms the customer has arrived. You can also check in multiple customers at once from the batch check-in feature.",
      category: "Booking Management",
      icon: Clock
    },
    {
      id: 8,
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel confirmed bookings from your Bookings page. The customer will receive a refund according to your cancellation policy. Be mindful as cancellations may affect your vendor rating.",
      category: "Booking Management",
      icon: Clock
    },
    {
      id: 9,
      question: "What happens if a customer doesn't show up?",
      answer: "If a customer is marked absent after the experience time passes, the booking is marked as 'No Show'. You still keep the payment. The customer is notified and their rating may be affected.",
      category: "Booking Management",
      icon: Clock
    },
    {
      id: 10,
      question: "How can I view pending holds?",
      answer: "Go to your Dashboard > Bookings or the dedicated Holds section. You'll see all pending holds with their expiration times. Confirm or decline holds within the required timeframe (usually 24 hours).",
      category: "Booking Management",
      icon: Clock
    },

    // Payments & Commissions
    {
      id: 11,
      question: "How do I get paid?",
      answer: "Payments are processed automatically to your linked bank account every 7 days (or monthly, depending on your agreement). Ensure your banking details are verified in Account Settings > Payment Information.",
      category: "Payments & Commissions",
      icon: CreditCard
    },
    {
      id: 12,
      question: "What commission does Secure Seat take?",
      answer: "Commission varies based on your vendor tier and experience type, typically 15-25%. You'll see the exact amount per booking in your Dashboard Revenue section. Premium vendors may negotiate lower rates.",
      category: "Payments & Commissions",
      icon: CreditCard
    },
    {
      id: 13,
      question: "Are there any transaction fees?",
      answer: "Besides the platform commission, payment gateway fees (1-2%) are applied. Tax and GST (if applicable) are calculated separately. All fees are transparent and shown in your revenue reports.",
      category: "Payments & Commissions",
      icon: CreditCard
    },
    {
      id: 14,
      question: "When will I receive my refund for cancellations?",
      answer: "Refunds are processed to customers first (if applicable based on your policy), and your reconciled amount will be reflected in your next payout cycle. Dispute refunds may take 7-14 additional days.",
      category: "Payments & Commissions",
      icon: CreditCard
    },
    {
      id: 15,
      question: "Can I adjust my pricing?",
      answer: "Yes, you can adjust pricing anytime from Experience Management. Changes apply to future bookings only. Existing confirmed bookings will use the original quoted price.",
      category: "Payments & Commissions",
      icon: CreditCard
    },

    // Account & Verification
    {
      id: 16,
      question: "What is vendor verification (KYC)?",
      answer: "KYC (Know Your Customer) is our identity verification process for vendors. It ensures security and compliance. You'll need to submit valid ID, proof of address, and banking details. Verification typically takes 2-3 business days.",
      category: "Account & Verification",
      icon: Shield
    },
    {
      id: 17,
      question: "Why does my account show 'Pending Verification'?",
      answer: "Your account is under review by our compliance team. This usually takes 24-48 hours. You can still add experiences, but they won't go live until verification is complete. Check your email for any additional document requests.",
      category: "Account & Verification",
      icon: Shield
    },
    {
      id: 18,
      question: "What documents do I need for vendor verification?",
      answer: "You'll need: valid government ID (passport/driver's license), proof of address (utility bill/lease), and bank account details (cancelled check or bank statement). All documents must match your registered name.",
      category: "Account & Verification",
      icon: Shield
    },
    {
      id: 19,
      question: "Can I update my bank account information?",
      answer: "Yes, go to Account Settings > Payment Information to update your banking details. Changes may require re-verification and typically take 1-2 business days to take effect.",
      category: "Account & Verification",
      icon: Shield
    },
    {
      id: 20,
      question: "What should I do if my account is suspended?",
      answer: "You'll receive an email explaining the suspension reason. Common reasons include policy violations, verification failure, or suspicious activity. Review the details and contact our support team with any clarifications or appeals.",
      category: "Account & Verification",
      icon: Shield
    },

    // Analytics & Dashboard
    {
      id: 21,
      question: "How do I track my earnings?",
      answer: "Your Dashboard displays real-time earnings, with details in the Revenue section. Filter by date, experience, or booking status. You can also download detailed reports for accounting purposes.",
      category: "Analytics & Dashboard",
      icon: BarChart3
    },
    {
      id: 22,
      question: "What metrics matter most for my performance?",
      answer: "Key metrics include: Booking conversion rate, customer ratings, occupancy rate, and revenue per experience. Monitor these in your Dashboard to optimize pricing, availability, and experience quality.",
      category: "Analytics & Dashboard",
      icon: BarChart3
    },
    {
      id: 23,
      question: "How can I improve my occupancy rate?",
      answer: "Adjust pricing competitively, increase availability, improve experience descriptions and images, encourage customer reviews, and use promotions. Our dashboard shows occupancy trends to help identify opportunities.",
      category: "Analytics & Dashboard",
      icon: BarChart3
    },
    {
      id: 24,
      question: "Can I see customer feedback and ratings?",
      answer: "Yes, all customer reviews and ratings are visible in your Dashboard's Reviews section. Use feedback to improve your experience and respond to customer comments professionally.",
      category: "Analytics & Dashboard",
      icon: BarChart3
    },
    {
      id: 25,
      question: "How is my vendor rating calculated?",
      answer: "Your rating is based on customer reviews (1-5 stars), booking completion rate, response time to holds, and overall customer satisfaction. Maintaining a rating above 4.0 is recommended for visibility.",
      category: "Analytics & Dashboard",
      icon: BarChart3
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
      "Experience Management": "from-blue-500 to-blue-600 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30",
      "Booking Management": "from-purple-500 to-purple-600 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30",
      "Payments & Commissions": "from-green-500 to-green-600 text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30",
      "Account & Verification": "from-orange-500 to-orange-600 text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30",
      "Analytics & Dashboard": "from-cyan-500 to-cyan-600 text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/30",
    };
    return colors[category] || "from-gray-500 to-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30";
  };

  return (
    <VendorAppLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 pb-4 border-b border-brand-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/vendor/help"
            className="p-1.5 hover:bg-brand-border dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-brand-secondary dark:text-gray-400" />
          </Link>
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
            Vendor FAQ
          </h1>
        </div>
        <p className="text-sm text-brand-secondary dark:text-gray-400 px-1">
          Find answers to common vendor questions
        </p>
      </div>

      {/* Search Bar */}
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
        <div className="flex gap-1 md:gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
              selectedCategory === null
                ? "bg-brand-primary text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-brand-primary dark:text-gray-100 border border-brand-border dark:border-gray-700 hover:border-brand-primary dark:hover:border-blue-400"
            }`}
          >
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
                Visit our <Link href="/vendor/help" className="underline font-semibold hover:no-underline">Help & Support</Link> page to contact our support team or view more resources.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="h-10"></div>
    </VendorAppLayout>
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
