export default function EventCard({ item, highlightMode = false }) {
    return (
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
            {!highlightMode && (
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    {item.userPrompt}
                </p>
            )}

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {item.venueName}
            </h3>

            <p className="text-gray-600 mt-1">{item.location}</p>

            <p className="mt-3 inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800">
                Estimated Cost: {item.estimatedCost}
            </p>

            {highlightMode && (
                <>
                    <p className="mt-4 text-sm font-medium text-gray-700">Why it fits</p>
                    <p className="mt-1 text-gray-700">
                        {item.justification}
                    </p>

                    {item.highlights && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.highlights.map((h, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700"
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                    )}
                    {item.capacity && (
                        <p className="mt-4 text-sm text-gray-500">Capacity: {item.capacity}</p>
                    )}
                </>
            )}

            {!highlightMode && item.justification && (
                <p className="mt-3 text-sm text-gray-600">{item.justification}</p>
            )}
        </div>
    );
}