export default function DetailLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-background dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-[430px] md:max-w-2xl lg:max-w-4xl pb-6">
        {children}
      </div>
    </div>
  );
}
