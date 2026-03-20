export default function Navbar() {
    return (
        <header className="w-full border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900">AI Event Concierge</p>
                <span className="text-xs sm:text-sm text-gray-500">Corporate Offsite Planner</span>
            </div>
        </header>
    );
}