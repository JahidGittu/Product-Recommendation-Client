import React from 'react';

const FeaturedRecommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 italic">
        কোনো বিশেষ রিকোমেন্ডেশন পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-red-700">
        Featured Recommendations (বিশেষ রিকোমেন্ডেশন)
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <div
            key={rec._id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col"
          >
            <img
              src={rec.productImage}
              alt={rec.productName}
              className="w-full h-48 object-cover rounded-md mb-4"
            />

            <h3 className="text-xl font-semibold mb-2 text-red-600">
              {rec.recommendationTitle}
            </h3>

            <p className="text-gray-700 mb-4 line-clamp-3" title={rec.recommendationReason}>
              {rec.recommendationReason}
            </p>
            <div className="mt-auto flex flex-col gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>❤️ {rec.likes?.length || 0} জন</span>
                <span>💬 {rec.comments?.length || 0} টি মন্তব্য</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={rec.recommenderPhoto}
                  alt={rec.recommenderName}
                  className="w-10 h-10 rounded-full border-2 border-red-600"
                  title={`Recommended by ${rec.recommenderName}`}
                />
                <div>
                  <p className="font-medium">{rec.recommenderName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(rec.timestamp).toLocaleDateString('bn-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRecommendations;
