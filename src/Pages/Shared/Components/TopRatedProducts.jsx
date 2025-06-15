import React from 'react';

const TopRatedProducts = ({topProducts}) => {


    if (topProducts.length === 0) return <p>কোনো টপ রেটেড প্রোডাক্ট নেই</p>;

    return (
        <section className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
                Top Rated Products (সবচেয়ে বেশি পছন্দ)
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {topProducts.map(rec => (
                    <div key={rec._id} className="bg-white border border-gray-500 rounded-lg shadow-md p-6 flex flex-col">
                        <img
                            src={rec?.productImage}
                            alt={rec.productName}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />

                        <h3 className="text-xl font-semibold mb-2 text-blue-600">
                            {rec.recommendationTitle}
                        </h3>

                        <p className="text-gray-700 mb-4 line-clamp-3" title={rec.recommendationReason}>
                            {rec.recommendationReason}
                        </p>

                        <div className="mt-auto flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <img
                                    src={rec.recommenderPhoto}
                                    alt={rec.recommenderName}
                                    className="w-10 h-10 rounded-full border-2 border-blue-600"
                                    title={`Recommended by ${rec.recommenderName}`}
                                />
                                <p className="font-medium">{rec.recommenderName}</p>
                            </div>

                            <span className="text-sm text-gray-500">
                                👍 {rec.likes ? rec.likes.length : 0}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TopRatedProducts;
