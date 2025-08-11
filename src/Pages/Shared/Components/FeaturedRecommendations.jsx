import React, { useState } from "react";

const FeaturedRecommendations = ({ recommendations }) => {
  const [selectedRec, setSelectedRec] = useState(null);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 italic">
        কোনো বিশেষ রিকোমেন্ডেশন পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#4B0C5D] to-[#951B80] bg-clip-text text-transparent">
          Featured Recommendations
        </h2>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((rec) => (
            <article
              key={rec._id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[420px]"
              aria-label={`Recommendation: ${rec.recommendationTitle}`}
            >
              <img
                src={rec.productImage?.trim() || "/default-product.png"}
                alt={rec.productName || "Product image"}
                className="w-full h-40 object-cover rounded-t-lg"
              />

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-3 text-[#4B0C5D]">
                  {rec.recommendationTitle}
                </h3>

                <p
                  className="text-gray-700 mb-4 line-clamp-3"
                  title={rec.recommendationReason}
                >
                  {rec.recommendationReason}
                </p>

                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                    <span>❤️ {rec.likes?.length || 0} জন</span>
                    <span>💬 {rec.comments?.length || 0} টি মন্তব্য</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={rec.recommenderPhoto || "/default-user.png"}
                      alt={rec.recommenderName || "Recommender"}
                      className="w-10 h-10 rounded-full border-2 border-[#4B0C5D] object-cover"
                    />
                    <div>
                      <p className="font-medium">{rec.recommenderName}</p>
                      <time
                        className="text-sm text-gray-500"
                        dateTime={new Date(rec.timestamp).toISOString()}
                      >
                        {new Date(rec.timestamp).toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRec(rec)}
                    className="mt-4 bg-[#0E6EFF] text-white px-4 py-2 rounded font-medium hover:opacity-90 transition"
                    aria-haspopup="dialog"
                    aria-expanded={selectedRec?._id === rec._id}
                  >
                    বিস্তারিত দেখুন
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedRec && (
        <aside
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedRec(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRec(null)}
              className="absolute top-4 right-4 bg-base-300 px-2 rounded-2xl text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>

            <img
              src={selectedRec.productImage?.trim() || "/default-product.png"}
              alt={selectedRec.productName || "Product image"}
              className="w-full h-60 object-cover rounded-md mb-6"
            />

            <h3
              id="modal-title"
              className="text-2xl font-bold mb-4 text-[#4B0C5D]"
            >
              {selectedRec.recommendationTitle}
            </h3>

            <p className="mb-6 text-gray-700 whitespace-pre-line">
              {selectedRec.recommendationReason}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedRec.recommenderPhoto || "/default-user.png"}
                alt={selectedRec.recommenderName || "Recommender"}
                className="w-12 h-12 rounded-full border-2 border-[#4B0C5D] object-cover"
              />
              <div>
                <p className="font-semibold">{selectedRec.recommenderName}</p>
                <time
                  className="text-sm text-gray-500"
                  dateTime={new Date(selectedRec.timestamp).toISOString()}
                >
                  {new Date(selectedRec.timestamp).toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>

            <div className="flex justify-between text-gray-600 font-medium text-sm mb-4">
              <span>❤️ {selectedRec.likes?.length || 0} জন</span>
              <span>💬 {selectedRec.comments?.length || 0} টি মন্তব্য</span>
            </div>

            <div className="border-t border-gray-300 pt-4 max-h-64 overflow-y-auto">
              {selectedRec.comments && selectedRec.comments.length > 0 ? (
                selectedRec.comments.map((comment, index) => (
                  <div
                    key={comment._id || comment.id || index}
                    className="flex items-start gap-3 mb-4"
                  >
                    <img
                      src={comment.userPhoto || "/default-user.png"}
                      alt={comment.userName || "User"}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {comment.userName || "Anonymous"}
                      </p>
                      <p className="text-gray-700 text-sm">
                        {comment.text || comment.commentText || ""}
                      </p>
                      <time
                        className="text-xs text-gray-400"
                        dateTime={
                          comment.timestamp
                            ? new Date(comment.timestamp).toISOString()
                            : undefined
                        }
                      >
                        {comment.timestamp
                          ? new Date(comment.timestamp).toLocaleDateString(
                              "bn-BD",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </time>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 italic">
                  কোনো মন্তব্য পাওয়া যায়নি।
                </p>
              )}
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default FeaturedRecommendations;
