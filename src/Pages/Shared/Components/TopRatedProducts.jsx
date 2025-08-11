import React, { useState } from "react";

const TopRatedProducts = ({ topProducts }) => {
  const [selectedRec, setSelectedRec] = useState(null);

  if (!topProducts || topProducts.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500 italic">
        কোনো টপ রেটেড প্রোডাক্ট নেই
      </p>
    );
  }

  return (
    <>
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        aria-labelledby="top-rated-heading"
      >
        <h2
          id="top-rated-heading"
          className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#4B0C5D] to-[#951B80] bg-clip-text text-transparent"
        >
          Top Rated Recommendation Products
        </h2>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {topProducts.map((rec) => (
            <article
              key={rec._id}
              className="bg-[#fdf6fb] border border-[#4B0C5D] rounded-lg shadow-md p-6 flex flex-col hover:shadow-xl transition-shadow duration-300 max-h-[480px] overflow-hidden"
              aria-label={`Product recommendation: ${rec.recommendationTitle}`}
            >
              <img
                src={rec.productImage?.trim() || "/default-product.png"}
                alt={rec.productName || "Product image"}
                className="w-full h-48 object-cover rounded-md mb-4 flex-shrink-0"
                loading="lazy"
              />

              <h3 className="text-xl font-semibold mb-2 text-[#4B0C5D]">
                {rec.recommendationTitle}
              </h3>

              <p
                className="text-gray-700 mb-4 line-clamp-3"
                title={rec.recommendationReason}
              >
                {rec.recommendationReason}
              </p>

              <div className="mt-auto flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={rec.recommenderPhoto || "/default-user.png"}
                    alt={rec.recommenderName || "Recommender"}
                    className="w-10 h-10 rounded-full border-2 border-[#4B0C5D] object-cover"
                    title={`Recommended by ${rec.recommenderName || "Unknown"}`}
                    loading="lazy"
                  />
                  <p className="font-medium text-[#4B0C5D]">
                    {rec.recommenderName || "Unknown"}
                  </p>
                </div>

                <span className="text-sm text-[#4B0C5D]">
                  👍 {rec.likes?.length || 0}
                </span>
              </div>

              {/* Details Button */}
              <button
                onClick={() => setSelectedRec(rec)}
                className="bg-[#0E6EFF] text-white px-4 py-2 rounded font-medium hover:opacity-90 transition"
              >
                বিস্তারিত দেখুন
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedRec && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedRec(null)}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedRec(null)}
              className="absolute top-4 right-4 bg-base-300 px-2 rounded-2xl text-gray-600 hover:text-gray-900 text-3xl font-bold leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Modal Content */}
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

            <p
              id="modal-description"
              className="mb-6 text-gray-700 whitespace-pre-line"
            >
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
                <p className="text-sm text-gray-500">
                  {selectedRec.timestamp
                    ? new Date(selectedRec.timestamp).toLocaleDateString("bn-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex justify-between text-gray-600 font-medium text-sm mb-4">
              <span>👍 {selectedRec.likes?.length || 0}</span>
              <span>💬 {selectedRec.comments?.length || 0} টি মন্তব্য</span>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-300 pt-4 max-h-64 overflow-y-auto">
              {selectedRec.comments && selectedRec.comments.length > 0 ? (
                selectedRec.comments.map((comment) => (
                  <div
                    key={comment._id || comment.id || Math.random()}
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
                      <p className="text-xs text-gray-400">
                        {comment.timestamp
                          ? new Date(comment.timestamp).toLocaleDateString("bn-BD", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </p>
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
        </div>
      )}
    </>
  );
};

export default TopRatedProducts;
