import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import {
  HelpCircle,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  BookOpen,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export default function HelpAndSupport() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      value: "support@secureyourseat.com",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us anytime",
      value: "+91 1234567890",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with us in real-time",
      value: "Available 9AM - 6PM",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      color: "text-purple-600 dark:text-purple-400"
    },
  ];

  const resources = [
    {
      icon: BookOpen,
      title: "User Guide",
      description: "Learn how to use Secure My Seat",
      href: "#",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Frequently asked questions",
      href: "#",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: AlertCircle,
      title: "Troubleshooting",
      description: "Solve common issues",
      href: "#",
      color: "from-orange-500 to-orange-600"
    },
  ];



  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 pb-4 border-b border-brand-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
            Help & Support
          </h1>
        </div>
        <p className="text-sm text-brand-secondary dark:text-gray-400 px-1">
          Find answers and get help when you need it
        </p>
      </div>

      {/* Contact Methods */}
      <div className="mb-10 md:mb-12">
        <SectionTitle title="Get in Touch" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactMethods.map((method) => (
            <div
              key={method.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-lg transition-all hover:border-brand-primary dark:hover:border-blue-400"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 md:w-14 md:h-14 ${method.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <method.icon size={18} className={method.color} />
                </div>
                <h3 className="text-sm md:text-base font-bold text-brand-primary dark:text-gray-100">
                  {method.title}
                </h3>
              </div>
              <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400 mb-3">
                {method.description}
              </p>
              <p className="text-sm font-semibold text-brand-primary dark:text-blue-400 break-all">
                {method.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Resources */}
      <div className="mb-10 md:mb-12">
        <SectionTitle title="Quick Resources" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/faqs"
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-card border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <HelpCircle size={24} className="text-white" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-brand-primary dark:text-gray-100 mb-1 group-hover:text-brand-primary transition-colors">
                FAQs
              </h3>
              <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400">
                Browse frequently asked questions
              </p>
            </div>
          </Link>

          <Link
            href="/user-guide"
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-card border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-brand-primary dark:text-gray-100 mb-1 group-hover:text-brand-primary transition-colors">
                User Guide
              </h3>
              <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400">
                Learn how to use Secure My Seat
              </p>
            </div>
          </Link>

          <Link
            href="/raise-query"
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-card border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <MessageSquare size={24} className="text-white" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-brand-primary dark:text-gray-100 mb-1 group-hover:text-brand-primary transition-colors">
                Raise a Query
              </h3>
              <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400">
                Submit your issue or question
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 md:p-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Need Immediate Assistance?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Our support team typically responds within 24 hours. For urgent matters, please call our support line.
            </p>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-brand-background dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-brand-primary dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-brand-primary dark:text-gray-100 text-lg">Operating Hours</h3>
        </div>
        <div className="space-y-3">
          <OperatingHoursRow day="Monday - Friday" time="9:00 AM - 6:00 PM" isOpen={true} />
          <OperatingHoursRow day="Saturday" time="10:00 AM - 4:00 PM" isOpen={true} />
          <OperatingHoursRow day="Sunday" time="Closed" isOpen={false} />
        </div>
      </div>

      <div className="h-10"></div>
    </AppLayout>
  );
}

/* ================= COMPONENTS ================= */

function SectionTitle({ title }) {
  return (
    <p className="text-[11px] tracking-widest text-brand-secondary dark:text-gray-400 uppercase mb-4 mt-6 font-bold">
      {title}
    </p>
  );
}



function OperatingHoursRow({ day, time, isOpen }) {
  return (
    <div className="flex items-center justify-between p-3 bg-brand-background/50 dark:bg-gray-700/30 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500" : "bg-gray-400"}`} />
        <span className="text-sm font-medium text-brand-primary dark:text-gray-100">{day}</span>
      </div>
      <span className={`text-sm font-semibold ${isOpen ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
        {time}
      </span>
    </div>
  );
}
