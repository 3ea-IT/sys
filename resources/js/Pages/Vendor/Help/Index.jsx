import VendorAppLayout from "@/Layouts/VendorAppLayout";
import { Link, usePage } from "@inertiajs/react";
import {
  HelpCircle,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Settings,
  TrendingUp,
  MapPin
} from "lucide-react";

export default function VendorHelpAndSupport() {
  const { user } = usePage().props;

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      value: "vendor-support@secureyourseat.com",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call our vendor hotline",
      value: "+91 9876543210",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: MapPin,
      title: "Office Address",
      description: "Visit us in person",
      value: "123 Tech Street, City, Country",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      color: "text-purple-600 dark:text-purple-400"
    },
  ];

  return (
    <VendorAppLayout user={user}>
      {/* Header */}
      <div className="mb-6 md:mb-8 pb-4 border-b border-brand-border dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-brand-primary dark:text-gray-100">
            Vendor Support Center
          </h1>
        </div>
        <p className="text-sm text-brand-secondary dark:text-gray-400 px-1">
          Find answers and get help managing your experiences
        </p>
      </div>

      {/* Contact Methods */}
      <div className="mb-10 md:mb-12">
        <SectionTitle title="Get in Touch" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactMethods.map((method) => (
            <div
              key={method.title}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-lg transition-all hover:border-brand-primary dark:hover:border-blue-400"
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
        <SectionTitle title="Resources & Guides" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/vendor/help/guides"
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <BookOpen size={24} className="text-white" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-brand-primary dark:text-gray-100 mb-1 group-hover:text-brand-primary transition-colors">
                Vendor Guide
              </h3>
              <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400">
                Learn to manage experiences & bookings
              </p>
            </div>
          </Link>

          <Link
            href="/vendor/help/faq"
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity" />
            
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <HelpCircle size={24} className="text-white" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-brand-primary dark:text-gray-100 mb-1 group-hover:text-brand-primary transition-colors">
                FAQs
              </h3>
              <p className="text-xs md:text-sm text-brand-secondary dark:text-gray-400">
                Answers to common questions
              </p>
            </div>
          </Link>

          <Link
            href="/vendor/help/raise-query"
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all overflow-hidden"
          >
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

      {/* Vendor Quick Tips */}
      <div className="mb-10 md:mb-12">
        <SectionTitle title="Quick Tips for Success" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4 text-brand-success" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-primary dark:text-gray-100 mb-1">Optimize Your Experiences</h3>
                <p className="text-xs text-brand-secondary dark:text-gray-400">
                  High-quality descriptions and photos attract more bookings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-primary dark:text-gray-100 mb-1">Respond to Queries Promptly</h3>
                <p className="text-xs text-brand-secondary dark:text-gray-400">
                  Fast responses improve your rating and booking conversions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-brand-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-primary dark:text-gray-100 mb-1">Manage Hold Periods</h3>
                <p className="text-xs text-brand-secondary dark:text-gray-400">
                  Set appropriate hold durations to manage seat availability
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-brand-border dark:border-gray-700 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Settings className="w-4 h-4 text-brand-success" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-primary dark:text-gray-100 mb-1">Keep Information Updated</h3>
                <p className="text-xs text-brand-secondary dark:text-gray-400">
                  Update pricing, availability, and details regularly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-brand-border dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-brand-background dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-brand-primary dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-brand-primary dark:text-gray-100 text-lg">Support Hours</h3>
        </div>
        <div className="space-y-3">
          <OperatingHoursRow day="Monday - Friday" time="8:00 AM - 7:00 PM" isOpen={true} />
          <OperatingHoursRow day="Saturday" time="9:00 AM - 5:00 PM" isOpen={true} />
          <OperatingHoursRow day="Sunday" time="10:00 AM - 3:00 PM" isOpen={true} />
        </div>
      </div>

      <div className="h-10"></div>
    </VendorAppLayout>
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
