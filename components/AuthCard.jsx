
export default function AuthCard({ children, title }) {
  return (
    <div className="min-h-[70vh] w-full flex items-start justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur shadow-2xl p-6 md:p-8">
        {title && <h2 className="text-2xl font-medium text-gray-800 mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
