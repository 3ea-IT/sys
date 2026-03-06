import AppLayout from "@/Layouts/AppLayout";
import { usePage, router, Link } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import {
  Bell,
  Mail,
  Shield,
  KeyRound,
  ChevronRight,
  LogOut,
  Globe,
  User,
  Moon,
  Edit,
  Loader
} from "lucide-react";
import { useState, useRef } from "react";

export default function Profile() {
  const { auth } = usePage().props;
  const user = auth?.user;
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      // Convert to string and trim
      const dateStr = String(dateString).trim();
      
      // Parse MySQL datetime format: YYYY-MM-DD HH:MM:SS
      const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        const [, year, month, day] = match;
        // Create date with explicit integer parsing
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        // Validate the date
        if (!isNaN(date.getTime())) {
          const formatted = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
          // Add comma after month (e.g., "10 February, 2026")
          return formatted.replace(/(\d+\s+\w+)\s+(\d+)/, '$1, $2');
        }
      }
      
      // Fallback: Try standard Date parsing
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const formatted = date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
        // Add comma after month (e.g., "10 February, 2026")
        return formatted.replace(/(\d+\s+\w+)\s+(\d+)/, '$1, $2');
      }
      
      console.error('Date parsing failed for:', dateString);
      return 'Unknown';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Unknown';
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      await router.post('/profile/upload-image', formData, {
        onSuccess: () => {
          setUploading(false);
          // Reset file input
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: () => {
          setUploading(false);
          alert('Failed to upload image');
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  return (
    <AppLayout>

      {/* Top Section */}
      <div className="flex flex-col items-center mt-2 mb-6">

        {/* Avatar */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold shadow-card overflow-hidden">
            {user?.profile_image ? (
              <img
                src={`/assets/profile_images/${user.profile_image}`}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() ?? "U"}</span>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-1 right-1 w-7 h-7 bg-brand-primary dark:bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-brand-primary/90 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader size={14} className="text-white animate-spin" />
            ) : (
              <Edit size={14} className="text-white" />
            )}
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
        </div>

        {/* Name */}
        <h2 className="text-lg font-bold text-brand-primary dark:text-gray-100 mt-3">
          {user?.name ?? "User Name"}
        </h2>

        {/* Membership Row */}
        <div className="flex flex-col items-center gap-2 text-xs text-brand-secondary dark:text-gray-400">
          <span>Joined on {formatDate(user?.created_at)}</span>
        </div>
      </div>

      {/* PREFERENCES */}
      <SectionTitle title="Preferences" />
      <Card>
        {/* <MenuItem icon={KeyRound} label="Interests Selection" value="VIP, Jazz, Gala" /> */}
        {/* <Divider /> */}
        <MenuItem icon={Globe} label="Language" value="English (US)" href="/profile/language" />
        <Divider />
        <DarkModeToggle enabled={theme === 'dark'} onToggle={toggleTheme} />
      </Card>

      {/* ALERTS & PRIVACY */}
      <SectionTitle title="Alerts & Privacy" />
      <Card>
        <ToggleItem icon={Bell} label="Push Notifications" enabled />
        <Divider />
        <ToggleItem icon={Mail} label="Email Reports" />
      </Card>

      {/* SECURITY */}
      <SectionTitle title="Security" />
      <Card>
        <MenuItem href="/profile/edit" icon={Shield} label="Profile Management" />
        <Divider />
        <MenuItem icon={KeyRound} label="Two-Factor Auth" badge="ACTIVE" />
      </Card>

      {/* SIGN OUT */}
      <div className="mt-6">
        <button
          onClick={() => router.post("/logout")}
          className="w-full bg-white border border-brand-border rounded-2xl py-3 text-brand-danger font-semibold flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div className="h-10"></div>

    </AppLayout>
  );
}

/* ================= COMPONENTS ================= */

function SectionTitle({ title }) {
  return (
    <p className="text-[11px] tracking-widest text-brand-secondary dark:text-gray-400 uppercase mb-2 mt-6">
      {title}
    </p>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border border-brand-border dark:border-gray-700 overflow-hidden">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-brand-border dark:bg-gray-700" />;
}

function MenuItem({ icon: Icon, label, value, badge, href }) {
  const content = (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-background dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <Icon size={18} className="text-brand-primary dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-primary dark:text-gray-100">{label}</p>
          {value && (
            <p className="text-xs text-brand-secondary dark:text-gray-400">{value}</p>
          )}
        </div>
      </div>

      {badge ? (
        <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      ) : (
        <ChevronRight size={18} className="text-brand-secondary dark:text-gray-500" />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function ToggleItem({ icon: Icon, label, enabled }) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-background dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <Icon size={18} className="text-brand-primary dark:text-blue-400" />
        </div>
        <p className="text-sm font-semibold text-brand-primary dark:text-gray-100">{label}</p>
      </div>

      {/* Toggle */}
      <div
        className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-brand-primary dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </div>
    </div>
  );
}

function DarkModeToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-4 hover:bg-brand-background dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-background dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <Moon size={18} className="text-brand-primary dark:text-yellow-400" />
        </div>
        <p className="text-sm font-semibold text-brand-primary dark:text-gray-100">Dark Mode</p>
      </div>

      {/* Toggle */}
      <div
        className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-brand-primary dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </div>
    </button>
  );
}
