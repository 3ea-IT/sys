import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import {
  ArrowLeft,
  Smartphone,
  Mail,
  Lock,
  Search,
  Filter,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Wallet,
  Gift,
  BookOpen,
  Bell,
  RotateCcw,
  HeadphonesIcon,
  CheckSquare,
} from "lucide-react";

export default function UserGuide() {
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
            User Guide
          </h1>
        </div>
        <p className="text-sm text-brand-secondary dark:text-gray-400 px-1">
          Learn how to use the platform and make the most of your bookings
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-brand-border dark:border-gray-700 p-4 md:p-6">
        <h2 className="text-lg font-bold text-brand-primary dark:text-gray-100 mb-4">Table of Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "1. Getting Started",
            "2. Exploring Experiences",
            "3. Booking Options",
            "4. Seat Status Explained",
            "5. Waitlist System",
            "6. Payments & Wallet",
            "7. Rewards & Benefits",
            "8. Managing Your Booking",
            "9. Notifications",
            "10. Cancellation & Refunds",
            "11. Support & Assistance",
            "12. Important Guidelines",
          ].map((item) => (
            <a
              key={item}
              href={`#${item.replace(/\s+/g, "-").toLowerCase()}`}
              className="text-sm text-brand-primary dark:text-blue-400 hover:underline"
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-8 mb-10">

        {/* Section 1: Getting Started */}
        <Section
          id="1.-getting-started"
          title="1. Getting Started"
          icon={Smartphone}
        >
          <Subsection title="Create an Account">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
              You can log in using:
            </p>
            <ul className="space-y-2 mb-3">
              <li className="flex items-center gap-2 text-sm text-brand-secondary dark:text-gray-400">
                <Smartphone className="w-4 h-4 text-brand-primary dark:text-blue-400" />
                Mobile Number (OTP verification)
              </li>
              <li className="flex items-center gap-2 text-sm text-brand-secondary dark:text-gray-400">
                <Mail className="w-4 h-4 text-brand-primary dark:text-blue-400" />
                Email (OTP verification)
              </li>
              <li className="flex items-center gap-2 text-sm text-brand-secondary dark:text-gray-400">
                <Lock className="w-4 h-4 text-brand-primary dark:text-blue-400" />
                Optional Multi-Factor Authentication (if enabled)
              </li>
            </ul>
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              After login, you can complete your profile and set your preferences for a personalized experience.
            </p>
          </Subsection>
        </Section>

        {/* Section 2: Exploring Experiences */}
        <Section
          id="2.-exploring-experiences"
          title="2. Exploring Experiences"
          icon={Search}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-4">
            You can discover and book across multiple categories:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {[
              { emoji: "🎬", text: "Entertainment (Movies, Concerts, Shows)" },
              { emoji: "🎓", text: "Professional Events (Workshops, Seminars)" },
              { emoji: "🛕", text: "Religious & Wellness (Darshan slots, Spiritual gatherings)" },
              { emoji: "🍽", text: "Dining Access (Table reservations)" },
              { emoji: "✈", text: "Travel & Attractions (Entry passes, Special access)" },
            ].map((category, idx) => (
              <div key={idx} className="text-sm text-brand-secondary dark:text-gray-400">
                <span className="mr-2">{category.emoji}</span>
                {category.text}
              </div>
            ))}
          </div>
          <Subsection title="Filter Your Search">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Use filters to refine your search by:</p>
            <ul className="space-y-1">
              {["Date & Time", "Price", "Distance", "Availability", "Popularity", "Membership Benefits"].map((filter) => (
                <li key={filter} className="flex items-center gap-2 text-sm text-brand-secondary dark:text-gray-400">
                  <Filter className="w-3.5 h-3.5 text-brand-primary dark:text-blue-400" />
                  {filter}
                </li>
              ))}
            </ul>
          </Subsection>
        </Section>

        {/* Section 3: Booking Options */}
        <Section
          id="3.-booking-options"
          title="3. Booking Options"
          icon={Zap}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-4">
            You have two flexible ways to secure your seat.
          </p>

          <Subsection title="Option 1: Instant Booking">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2 font-semibold">Best for immediate confirmation.</p>
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">How It Works:</p>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              {["Select your experience", "Choose seat/slot", "Pay the full amount", "Receive instant confirmation"].map((step, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">{step}</li>
              ))}
            </ol>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                Seat is immediately confirmed
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                Ticket is generated
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                Notification sent via app/email/SMS
              </div>
            </div>
          </Subsection>

          <Subsection title="Option 2: Hold (Reserve Now, Confirm Later)">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2 font-semibold">Perfect if you need time before final payment.</p>
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">How It Works:</p>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              {["Select your seat/slot", "Pay a small token amount", "Seat is temporarily locked", "Countdown timer starts", "Confirm or release within time limit"].map((step, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">{step}</li>
              ))}
            </ol>
            <p className="text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">Important Rules for Hold:</p>
            <ul className="space-y-1">
              {[
                "The seat is unavailable to others during your hold period.",
                "The timer duration depends on the event.",
                "If you confirm → token adjusts in final payment.",
                "If timer expires → seat is auto-released.",
                "If you release manually → it goes to the next user in waitlist."
              ].map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-brand-secondary dark:text-gray-400">
                  <AlertCircle className="w-4 h-4 text-brand-warning mt-0.5 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </Subsection>
        </Section>

        {/* Section 4: Seat Status */}
        <Section
          id="4.-seat-status-explained"
          title="4. Seat Status Explained"
          icon={CheckSquare}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
            Each seat or slot may display one of the following states:
          </p>
          <div className="space-y-2">
            {[
              { status: "Available", meaning: "Open for booking" },
              { status: "Held", meaning: "Temporarily reserved by a user" },
              { status: "Expiring", meaning: "Hold time is about to end" },
              { status: "Confirmed", meaning: "Fully booked" },
              { status: "Released", meaning: "Previously held but now available" },
              { status: "Waitlisted", meaning: "Assigned to queue" },
            ].map((item) => (
              <div key={item.status} className="flex items-start gap-3 p-2 bg-brand-background dark:bg-gray-700/30 rounded-lg">
                <span className="text-sm font-semibold text-brand-primary dark:text-gray-100 min-w-fit">{item.status}</span>
                <span className="text-sm text-brand-secondary dark:text-gray-400">{item.meaning}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 5: Waitlist */}
        <Section
          id="5.-waitlist-system"
          title="5. Waitlist System"
          icon={Users}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">If an experience is full:</p>
          <ul className="space-y-1 mb-3">
            {["You may join the waitlist.", "Seats are allocated automatically if someone releases or expires."].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-brand-secondary dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-brand-success flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-brand-primary dark:text-gray-100 mb-2">Allocation priority may depend on:</p>
          <ul className="space-y-1 mb-3">
            {["Membership level", "Booking time", "Platform rules"].map((item, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400 ml-4">• {item}</li>
            ))}
          </ul>
          <p className="text-sm text-brand-secondary dark:text-gray-400">
            You will be notified instantly if a seat becomes available for you.
          </p>
        </Section>

        {/* Section 6: Payments */}
        <Section
          id="6.-payments-&-wallet"
          title="6. Payments & Wallet"
          icon={Wallet}
        >
          <Subsection title="Supported Payment Methods">
            <ul className="space-y-1">
              {["UPI", "Debit/Credit Cards", "Net Banking"].map((method, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {method}</li>
              ))}
            </ul>
          </Subsection>

          <Subsection title="Wallet Usage">
            <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Your wallet can be used for:</p>
            <ul className="space-y-1 mb-3">
              {["Token payments", "Refund credits", "Cashback", "Reward redemption"].map((item, idx) => (
                <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {item}</li>
              ))}
            </ul>
            <p className="text-sm text-brand-secondary dark:text-gray-400">
              Wallet balance can be viewed inside your profile.
            </p>
          </Subsection>
        </Section>

        {/* Section 7: Rewards */}
        <Section
          id="7.-rewards-&-benefits"
          title="7. Rewards & Benefits"
          icon={Gift}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">You earn reward points for:</p>
          <ul className="space-y-1 mb-3">
            {["Early reservations", "Repeat bookings", "Membership upgrades"].map((item, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {item}</li>
            ))}
          </ul>
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
            Points can be redeemed inside the wallet for future bookings.
          </p>
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-1 font-semibold">Members may also receive:</p>
          <ul className="space-y-1">
            {["Priority access", "Longer hold duration", "Exclusive listings"].map((benefit, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {benefit}</li>
            ))}
          </ul>
        </Section>

        {/* Section 8: Managing Bookings */}
        <Section
          id="8.-managing-your-booking"
          title="8. Managing Your Booking"
          icon={BookOpen}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">Go to My Bookings to:</p>
          <ul className="space-y-1">
            {["View upcoming events", "Confirm held seats", "Cancel bookings (as per policy)", "Download tickets", "Track refunds"].map((action, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {action}</li>
            ))}
          </ul>
        </Section>

        {/* Section 9: Notifications */}
        <Section
          id="9.-notifications"
          title="9. Notifications"
          icon={Bell}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">You will receive alerts for:</p>
          <ul className="space-y-1 mb-4">
            {["Reservation expiry reminders", "Booking confirmations", "Event updates", "Waitlist upgrades", "Special priority access"].map((alert, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {alert}</li>
            ))}
          </ul>
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-2">Notifications are sent via:</p>
          <ul className="space-y-1">
            {["Push Notifications", "SMS", "Email"].map((channel, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {channel}</li>
            ))}
          </ul>
        </Section>

        {/* Section 10: Cancellation */}
        <Section
          id="10.-cancellation-&-refunds"
          title="10. Cancellation & Refunds"
          icon={RotateCcw}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">
            Refund policies vary by event and are visible before payment.
          </p>
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3 font-semibold">Possible scenarios:</p>
          <ul className="space-y-1 mb-3">
            {["Full refund", "Partial refund", "Token forfeiture (if hold expires)", "Wallet credit refund"].map((scenario, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {scenario}</li>
            ))}
          </ul>
          <p className="text-sm text-brand-secondary dark:text-gray-400 font-semibold">
            Always review event-specific policies before booking.
          </p>
        </Section>

        {/* Section 11: Support */}
        <Section
          id="11.-support-&-assistance"
          title="11. Support & Assistance"
          icon={HeadphonesIcon}
        >
          <p className="text-sm text-brand-secondary dark:text-gray-400 mb-3">If you need help:</p>
          <ul className="space-y-1 mb-3">
            {["Visit Help Centre", "Raise a Support Ticket", "Use Live Chat (if available)", "Track escalation status"].map((option, idx) => (
              <li key={idx} className="text-sm text-brand-secondary dark:text-gray-400">• {option}</li>
            ))}
          </ul>
          <p className="text-sm text-brand-secondary dark:text-gray-400">
            Our support team will assist you as quickly as possible.
          </p>
        </Section>

        {/* Section 12: Important Guidelines */}
        <Section
          id="12.-important-guidelines"
          title="12. Important Guidelines"
          icon={AlertCircle}
        >
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-4 space-y-2">
            {[
              "✔ Confirm held seats before timer expires",
              "✔ Ensure payment success before closing app",
              "✔ Arrive on time for entry validation",
              "✔ Follow venue rules",
            ].map((guideline, idx) => (
              <div key={idx} className="text-sm text-yellow-800 dark:text-yellow-200">
                {guideline}
              </div>
            ))}
          </div>
        </Section>

      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 md:p-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Need More Help?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Visit our <Link href="/help" className="underline font-semibold hover:no-underline">Help & Support</Link> page to contact our support team or view more resources.
            </p>
          </div>
        </div>
      </div>

      <div className="h-10"></div>
    </AppLayout>
  );
}

/* ================= COMPONENTS ================= */

function Section({ id, title, icon: Icon, children }) {
  return (
    <div id={id} className="scroll-mt-20">
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
