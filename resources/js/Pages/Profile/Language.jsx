import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { useLanguage } from "@/Contexts/LanguageContext";
import { useState } from "react";

export default function Language() {
  let language, changeLanguage, languages;
  try {
    const context = useLanguage();
    if (context) {
      language = context.language || 'en';
      changeLanguage = context.changeLanguage || (() => {});
      languages = context.languages || {};
    } else {
      language = 'en';
      changeLanguage = () => {};
      languages = {};
    }
  } catch (error) {
    console.error('Error getting language context:', error);
    language = 'en';
    changeLanguage = () => {};
    languages = {};
  }

  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (newLanguage) => {
    setLoading(true);
    if (changeLanguage) {
      changeLanguage(newLanguage);
    }
  };

  if (!languages || Object.keys(languages).length === 0) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading language settings...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/profile"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Language Settings
        </h1>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Select your preferred language for the entire application. The interface will update immediately.
      </p>

      {/* Language Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code)}
            disabled={loading}
            className={`p-4 rounded-lg border-2 transition-all flex items-center justify-between disabled:opacity-50 ${
              language === code
                ? 'border-brand-primary dark:border-blue-400 bg-brand-primary/5 dark:bg-blue-400/10'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{flag}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{name}</p>
            </div>
            {language === code && (
              <Check className="w-5 h-5 text-brand-primary dark:text-blue-400" />
            )}
          </button>
        ))}
      </div>

      {/* Loading Message */}
      {loading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Globe className="w-4 h-4 animate-spin" />
            Translating page content...
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <strong>Note:</strong> The interface translations are powered by Google Translate. The page will reload to apply the new language.
        </p>
      </div>

      {/* Back Button */}
      <Link
        href="/profile"
        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        Back to Profile
      </Link>

      <div className="h-10"></div>
    </AppLayout>
  );
}
