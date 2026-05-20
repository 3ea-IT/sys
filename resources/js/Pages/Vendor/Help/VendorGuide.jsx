import React, { useEffect } from 'react';
import { Head, Link, usePage } from "@inertiajs/react";
import VendorAppLayout from "@/Layouts/VendorAppLayout";
import {
  ArrowLeft,
  Zap,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  TrendingUp,
  Lock,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

const SECTIONS = [
  { id: "section-1", title: "1. Getting Started", icon: Zap },
  { id: "section-2", title: "2. Profile & Verification", icon: Lock },
  { id: "section-3", title: "3. Creating Experiences", icon: FileText },
  { id: "section-4", title: "4. Pricing & Inventory", icon: DollarSign },
  { id: "section-5", title: "5. Managing Bookings", icon: Clock },
  { id: "section-6", title: "6. Understanding Holds", icon: AlertCircle },
  { id: "section-7", title: "7. Analytics & Reports", icon: BarChart3 },
  { id: "section-8", title: "8. Settlements & Payments", icon: DollarSign },
  { id: "section-9", title: "9. Customer Management", icon: Users },
  { id: "section-10", title: "10. Ratings & Reviews", icon: Smartphone },
  { id: "section-11", title: "11. Best Practices", icon: TrendingUp },
  { id: "section-12", title: "12. Support & Troubleshooting", icon: ShieldAlert },
];

export default function VendorGuide() {
  const { user } = usePage().props;

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    console.log('Clicking: ', sectionId, 'Element:', !!element);
    if (element) {
      const mainElement = document.querySelector('main.overflow-y-auto');
      
      if (mainElement) {
        // Desktop view - scroll the main container
        console.log('Scrolling in main container (desktop)');
        const mainRect = mainElement.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = elementRect.top - mainRect.top + mainElement.scrollTop;
        const scrollTop = relativeTop - 100;
        
        mainElement.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      } else {
        // Mobile view - use scrollIntoView
        console.log('Using scrollIntoView (mobile)');
        element.scrollIntoView({ behavior: 'smooth' });
      }
      
      window.location.hash = sectionId;
    }
  };

  // Handle scroll on page load with hash
  useEffect(() => {
    const performScroll = () => {
      const hash = window.location.hash.substring(1);
      console.log('Hash from URL:', hash);
      
      if (hash) {
        const element = document.getElementById(hash);
        console.log('Element exists:', !!element);
        
        if (element) {
          console.log('Scrolling to:', hash);
          
          // First, find the scrollable main container (desktop)
          const mainElement = document.querySelector('main.overflow-y-auto');
          
          if (mainElement) {
            // Desktop view - scroll the main container
            console.log('Scrolling in main container (desktop view)');
            // Calculate position relative to main container
            const mainRect = mainElement.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const relativeTop = elementRect.top - mainRect.top + mainElement.scrollTop;
            const scrollTop = relativeTop - 100;
            
            console.log('Main rect:', mainRect);
            console.log('Element rect:', elementRect);
            console.log('Relative top:', relativeTop);
            console.log('Scroll to:', scrollTop);
            
            mainElement.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            });
          } else {
            // Mobile view - use scrollIntoView
            console.log('Using scrollIntoView (mobile/default behavior)');
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        } else {
          console.warn('Element not found:', hash);
          // List all section IDs
          const sections = document.querySelectorAll('[id^="section-"]');
          console.log('Available sections:', Array.from(sections).map(s => s.id));
        }
      } else {
        console.log('No hash in URL');
      }
    };

    // Try scrolling with multiple delays to ensure DOM is ready
    performScroll();
    setTimeout(performScroll, 50);
    setTimeout(performScroll, 200);
    setTimeout(performScroll, 500);
    setTimeout(performScroll, 1000);
  }, []);

  return (
    <VendorAppLayout user={user}>
      <Head title="Vendor Guide" />

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
            Vendor Guide
          </h1>
        </div>
        <p className="text-sm text-brand-secondary dark:text-gray-400 px-1">
          Master your vendor dashboard and maximize your bookings
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-brand-border dark:border-gray-700 p-4 md:p-6">
        <h2 className="text-lg font-bold text-brand-primary dark:text-gray-100 mb-4">Table of Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={(e) => handleNavClick(e, section.id)}
              className="text-left text-sm text-brand-primary dark:text-blue-400 hover:underline focus:outline-none transition-colors"
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8 mb-10">
        {/* Section 1: Getting Started */}
        <SectionContent
          id="section-1"
          title="1. Getting Started"
          icon={Zap}
        >
          <Subsection title="Welcome to Your Vendor Dashboard">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
              Your vendor dashboard is your command center for managing all experiences and bookings. Here's what you can do:
            </p>
            <ul className="space-y-2">
              {[
                "Create and manage multiple experiences",
                "Track real-time bookings and holds",
                "Monitor customer interactions",
                "View detailed analytics and revenue reports",
                "Manage settlements and payments",
                "Respond to customer queries"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-brand-secondary dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-brand-success flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Dashboard Overview">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">The main dashboard displays:</p>
            <ul className="space-y-1">
              {["Total bookings and revenue", "Real-time occupancy rates", "Upcoming events", "Recent customer bookings"].map((item, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {item}</li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 2: Profile & Verification */}
        <SectionContent
          id="section-2"
          title="2. Profile & Verification"
          icon={Lock}
        >
          <Subsection title="Complete Your KYC">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
              To activate your vendor account and accept payments, complete the KYC verification:
            </p>
            <div className="space-y-2 mb-3">
              {[
                { step: "Personal Information", desc: "Valid ID, address, contact details" },
                { step: "Business Information", desc: "Business name, type, registration details" },
                { step: "Bank Details", desc: "Account number for settlements" },
                { step: "KYC Documents", desc: "Government-issued ID, proof of address" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-2 bg-brand-background dark:bg-gray-700/30 rounded-lg">
                  <span className="text-sm font-semibold text-brand-primary dark:text-gray-100 min-w-fit">{item.step}</span>
                  <span className="text-sm text-brand-secondary dark:text-gray-400">{item.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-brand-secondary dark:text-gray-400 font-semibold">
              ⏱ Verification typically takes 24-48 hours after submission.
            </p>
          </Subsection>

          <Subsection title="Update Your Profile">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Keep your profile updated for:</p>
            <ul className="space-y-1">
              {["Professional appearance", "Better customer trust", "Accurate payment processing"].map((item, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {item}</li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 3: Creating Experiences */}
        <SectionContent
          id="section-3"
          title="3. Creating Experiences"
          icon={FileText}
        >
          <Subsection title="Add a New Experience">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">Follow these steps to create an experience:</p>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              {[
                "Click 'Add Experience' in your dashboard",
                "Fill in experience details (name, category, description)",
                "Set location and date/time",
                "Upload high-quality images",
                "Define pricing and capacity",
                "Set hold duration and rules",
                "Submit for approval"
              ].map((step, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">{step}</li>
              ))}
            </ol>
          </Subsection>

          <Subsection title="Best Practices for Experience Details">
            <ul className="space-y-1 mb-3">
              {[
                "Use clear, descriptive titles",
                "Write detailed descriptions (what to expect, duration, etc.)",
                "Include high-resolution images (minimum 3-5 images)",
                "Clearly mention any restrictions or requirements",
                "Be accurate with timing and location",
                "Include cancellation and refund policies"
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-brand-secondary dark:text-gray-400">
                  <TrendingUp className="w-4 h-4 text-brand-success mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Experience Categories">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Choose the correct category:</p>
            <ul className="space-y-1">
              {[
                "🎬 Entertainment (Movies, Concerts, Shows)",
                "🎓 Professional Events (Workshops, Seminars)",
                "🛕 Religious & Wellness (Spiritual gatherings)",
                "🍽 Dining (Table reservations)",
                "✈ Travel & Attractions (Entry passes)",
              ].map((cat, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">{cat}</li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 4: Pricing & Inventory */}
        <SectionContent
          id="section-4"
          title="4. Pricing & Inventory"
          icon={DollarSign}
        >
          <Subsection title="Set Your Pricing">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">Competitive pricing helps attract more bookings:</p>
            <ul className="space-y-1 mb-3">
              {[
                "Research similar experiences on the market",
                "Consider your experience value and features",
                "Factor in operational costs and profit margin",
                "You can adjust prices anytime"
              ].map((tip, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {tip}</li>
              ))}
            </ul>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Tip:</strong> Offer early-bird discounts or loyalty pricing to incentivize bookings
              </p>
            </div>
          </Subsection>

          <Subsection title="Manage Inventory & Availability">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Set your capacity and availability:</p>
            <ul className="space-y-1 mb-3">
              {[
                "Define total seats/slots per experience",
                "Set blocklist dates when not available",
                "Mark special events with different pricing",
                "Manage seasonal variations"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {item}</li>
              ))}
            </ul>
            <p className="text-sm text-brand-secondary dark:text-gray-400 font-semibold">
              Keep inventory accurate to avoid overbooking.
            </p>
          </Subsection>
        </SectionContent>

        {/* Section 5: Managing Bookings */}
        <SectionContent
          id="section-5"
          title="5. Managing Bookings"
          icon={Clock}
        >
          <Subsection title="Track All Bookings">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">Your Bookings section shows:</p>
            <ul className="space-y-1 mb-3">
              {[
                "All confirmed reservations",
                "Customer details and contact information",
                "Payment status",
                "Booking date and experience details",
                "Check-in status"
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {item}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Customer Communication">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Best practices for customer interaction:</p>
            <ul className="space-y-1">
              {[
                "Respond to customer queries promptly",
                "Send preparatory information before the event",
                "Confirm attendance 24 hours before",
                "Provide clear entry and arrival instructions"
              ].map((tip, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {tip}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Check-In & Attendance">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Validate customer attendance:</p>
            <ul className="space-y-1">
              {[
                "Use check-in feature on event day",
                "Mark attendance to confirm participation",
                "This unlocks payment settlements",
                "Customers receive completion confirmation"
              ].map((step, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {step}</li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 6: Understanding Holds */}
        <SectionContent
          id="section-6"
          title="6. Understanding Holds"
          icon={AlertCircle}
        >
          <Subsection title="Hold Mechanism Overview">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
              Holds allow customers to reserve a seat temporarily before making full payment.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-3 space-y-2 mb-3">
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>How it works:</strong>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                {[
                  "Customer holds a seat with token payment",
                  "Seat becomes unavailable to others",
                  "Timer starts (duration you set)",
                  "Customer must confirm or release before expiry",
                  "If expired: seat auto-releases to waitlist"
                ].map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </Subsection>

          <Subsection title="Setting Hold Duration">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">
              Configure ideal hold duration per experience:
            </p>
            <ul className="space-y-1">
              {[
                "Short duration (15-30 min): High-demand events",
                "Medium duration (1-2 hours): Standard events",
                "Long duration (4-24 hours): Premium experiences",
                "Emergency tickets: Shorter holds recommended"
              ].map((option, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {option}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Hold Revenue Impact">
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              ✔ Token payment collected immediately when hold created
              <br />✔ Full payment adjustment when customer confirms
              <br />✔ Token refunded if hold expires or customer cancels
            </p>
          </Subsection>
        </SectionContent>

        {/* Section 7: Analytics & Reports */}
        <SectionContent
          id="section-7"
          title="7. Analytics & Reports"
          icon={BarChart3}
        >
          <Subsection title="Dashboard Metrics">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">Track these key performance indicators:</p>
            <div className="space-y-2">
              {[
                { metric: "Total Bookings", desc: "Complete reservations including confirmed and held" },
                { metric: "Total Revenue", desc: "30-day rolling revenue from all bookings" },
                { metric: "Total Holds", desc: "Currently active seat reservations" },
                { metric: "Occupancy Rate", desc: "Percentage of seats booked vs available" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-2 bg-brand-background dark:bg-gray-700/30 rounded-lg">
                  <span className="text-sm font-semibold text-brand-primary dark:text-gray-100 min-w-fit">{item.metric}</span>
                  <span className="text-sm text-brand-secondary dark:text-gray-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </Subsection>

          <Subsection title="Detailed Reports">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Access comprehensive analytics:</p>
            <ul className="space-y-1 mb-3">
              {[
                "Bookings by Status (Confirmed, On Hold, Cancelled)",
                "Revenue trends (daily, weekly, monthly)",
                "Top performing experiences",
                "Category-wise breakdown",
                "Customer acquisition metrics"
              ].map((report, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {report}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Using Data to Improve">
            <ul className="space-y-1">
              {[
                "Identify best-performing experiences",
                "Adjust pricing based on demand",
                "Optimize capacity planning",
                "Plan new experiences based on trends",
                "Time your marketing campaigns"
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-brand-secondary dark:text-gray-400">
                  <TrendingUp className="w-4 h-4 text-brand-success mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 8: Settlements & Payments */}
        <SectionContent
          id="section-8"
          title="8. Settlements & Payments"
          icon={DollarSign}
        >
          <Subsection title="Understanding Settlements">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
              Settlements are the transfer of your earned revenue to your bank account.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-3 space-y-1 mb-3">
              <div className="text-sm text-green-700 dark:text-green-400">
                <strong>Settlement Cycle:</strong>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Payments are typically settled within 5-7 business days after customer attendance confirmation (check-in).
              </p>
            </div>
          </Subsection>

          <Subsection title="Settlement Status">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Track payment status:</p>
            <ul className="space-y-1">
              {[
                "Processing: Payment confirmed, awaiting bank transfer",
                "Settled: Successfully transferred to your account",
                "Pending: Awaiting customer check-in/confirmation",
                "Failed: Transaction issue (retry available)"
              ].map((status, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {status}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Platform Commission">
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              The platform charges a standard commission on each booking. Your settlement amount will reflect this deduction. Detailed breakdown is available in the settlements report.
            </p>
          </Subsection>
        </SectionContent>

        {/* Section 9: Customer Management */}
        <SectionContent
          id="section-9"
          title="9. Customer Management"
          icon={Users}
        >
          <Subsection title="Build Personal Relationships">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">Strong customer relationships lead to repeat bookings:</p>
            <ul className="space-y-1 mb-3">
              {[
                "Remember returning customers",
                "Offer loyalty incentives",
                "Send personalized follow-ups",
                "Thank customers after successful experiences"
              ].map((tip, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {tip}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Handling Customer Issues">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Best practices for problem resolution:</p>
            <ul className="space-y-1">
              {[
                "Respond promptly to inquiries",
                "Be professional and courteous",
                "Offer fair solutions quickly",
                "Document interactions for reference",
                "Escalate to support if needed"
              ].map((practice, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {practice}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Customer Communication Channels">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Stay connected through:</p>
            <ul className="space-y-1">
              {[
                "In-app messaging system",
                "Email notifications",
                "SMS updates",
                "Booking confirmations"
              ].map((channel, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {channel}</li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 10: Ratings & Reviews */}
        <SectionContent
          id="section-10"
          title="10. Ratings & Reviews"
          icon={Smartphone}
        >
          <Subsection title="Why Ratings Matter">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
              Your rating directly impacts your visibility and booking conversion rate.
            </p>
            <ul className="space-y-1 mb-3">
              {[
                "Higher ratings = more bookings",
                "Better visibility in search results",
                "Increased customer trust",
                "Competitive advantage"
              ].map((reason, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-brand-secondary dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-brand-success flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Improving Your Rating">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 space-y-2">
              {[
                "✔ Deliver exactly as described",
                "✔ Provide exceptional customer service",
                "✔ Maintain cleanliness and professionalism",
                "✔ Respond to reviews professionally",
                "✔ Request feedback after positive interactions",
              ].map((tip, idx) => (
                <div key={idx} className="text-sm text-blue-700 dark:text-blue-300">
                  {tip}
                </div>
              ))}
            </div>
          </Subsection>

          <Subsection title="Responding to Reviews">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">
              Always respond to reviews, especially negative ones:
            </p>
            <ul className="space-y-1">
              {[
                "Thank positive reviewers",
                "Address concerns professionally",
                "Offer solutions to problems",
                "Show commitment to improvement"
              ].map((step, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {step}</li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 11: Best Practices */}
        <SectionContent
          id="section-11"
          title="11. Best Practices"
          icon={TrendingUp}
        >
          <Subsection title="Maximize Your Bookings">
            <ul className="space-y-1 mb-3">
              {[
                "Keep experience details fresh and accurate",
                "Update availability proactively",
                "Respond to holds quickly during peak hours",
                "Optimize pricing with seasonal changes",
                "Encourage repeat bookings with incentives"
              ].map((practice, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-brand-secondary dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-brand-success mt-0.5 flex-shrink-0" />
                  {practice}
                </li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Compliance & Quality">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-3 space-y-1">
              {[
                "⚠ Follow all local regulations and permits",
                "⚠ Maintain insurance for liability",
                "⚠ Ensure safety standards are met",
                "⚠ Keep accurate records of all transactions",
                "⚠ Respect customer privacy and data protection"
              ].map((rule, idx) => (
                <div key={idx} className="text-sm text-yellow-800 dark:text-yellow-200">
                  {rule}
                </div>
              ))}
            </div>
          </Subsection>

          <Subsection title="Growth Strategies">
            <ul className="space-y-1">
              {[
                "Monitor analytics to identify opportunities",
                "Expand your experience catalog",
                "Test different pricing strategies",
                "Build partnerships with other vendors",
                "Leverage seasonal trends and events"
              ].map((strategy, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {strategy}</li>
              ))}
            </ul>
          </Subsection>
        </SectionContent>

        {/* Section 12: Support & Troubleshooting */}
        <SectionContent
          id="section-12"
          title="12. Support & Troubleshooting"
          icon={ShieldAlert}
        >
          <Subsection title="Common Issues & Solutions">
            <div className="space-y-2">
              {[
                { issue: "Can't update experience details", solution: "Wait for approval status to change, then try again" },
                { issue: "Payment not settled", solution: "Check if customer check-in is confirmed; contact support if issue persists" },
                { issue: "Hold expired automatically", solution: "This is normal - seat returns to available once hold expires" },
                { issue: "Low booking conversion", solution: "Review and update experience description, photos, and pricing" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-brand-background dark:bg-gray-700/30 rounded-lg">
                  <p className="text-sm font-semibold text-brand-primary dark:text-gray-100 mb-1">{item.issue}</p>
                  <p className="text-sm text-brand-secondary dark:text-gray-400">{item.solution}</p>
                </div>
              ))}
            </div>
          </Subsection>

          <Subsection title="Getting Help">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">Multiple ways to get support:</p>
            <ul className="space-y-1 mb-3">
              {[
                "📧 Email: vendor-support@secureyourseat.com",
                "📞 Phone: +1 (555) 123-4568",
                "💬 Live Chat: Available 8AM - 7PM",
                "❓ FAQs: Check our detailed FAQ section",
                "🎫 Raise a Query: Submit tickets through your dashboard"
              ].map((contact, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">{contact}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Support Response Times">
            <div className="space-y-1">
              {[
                "🔴 Urgent Issues: 2-4 hours",
                "🟠 High Priority: 4-8 hours",
                "🟡 Medium Priority: 24 hours",
                "🟢 General Inquiries: 1-2 business days"
              ].map((time, idx) => (
                <p key={idx} className="text-sm text-brand-secondary dark:text-gray-400">{time}</p>
              ))}
            </div>
          </Subsection>
        </SectionContent>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-brand-primary/5 to-brand-primary/10 border border-brand-border dark:border-brand-primary/20 dark:from-brand-primary/10 dark:to-brand-primary/5 rounded-lg p-4 md:p-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-brand-primary dark:text-blue-400 mt-0.5" />
          </div>
          <div>
            <h3 className="font-bold text-brand-primary dark:text-blue-100 mb-1">Need More Help?</h3>
            <p className="text-sm text-brand-secondary dark:text-blue-200">
              Visit our <Link href="/vendor/help" className="underline font-semibold hover:no-underline">Support Center</Link> to contact our vendor success team or explore more resources.
            </p>
          </div>
        </div>
      </div>

      <div className="h-10"></div>
    </VendorAppLayout>
  );
}

/* ================= COMPONENTS ================= */

function SectionContent({ id, title, icon: Icon, children }) {
  return (
    <div id={id} className="pt-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-brand-background dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-primary dark:text-blue-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-brand-primary dark:text-gray-100">
          {title}
        </h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-brand-border dark:border-gray-700 p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}

function Subsection({ title, children }) {
  return (
    <div className="mt-4 pt-4 border-t border-brand-border dark:border-gray-700">
      <h3 className="text-base font-bold text-brand-primary dark:text-gray-100 mb-3">{title}</h3>
      {children}
    </div>
  );
}
