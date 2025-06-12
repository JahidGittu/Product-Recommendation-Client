import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useAuth from "../../../hooks/useAuth";


const Reviews = () => {
  const [testimonials, setTestimonials] = useState([]);
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/reviews");
        const data = await res.json();

        const enriched = data.map((review) => ({
          ...review,
          photo: review.userPhoto || "/default.jpg",
          name: review.userName || "Anonymous",
          location: review.userEmail || "",
          rating: parseInt(review.rating),
        }));

        setTestimonials(enriched);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchData();
  }, []);

  const chunked = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    chunked.push(testimonials.slice(i, i + 3));
  }

  const settings = {
    dots: true,
    infinite: chunked.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  // ✅ Check if user's email exists in any review
  const hasUserReview = testimonials.some((review) => review.location === user?.email);

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        💬 ইউজারদের অভিজ্ঞতা
      </h2>

      {/* ✅ Show a card if user has no review */}
      {user?.email && !hasUserReview && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-xl mb-6 max-w-xl mx-auto">
          <p className="font-medium text-center">To see your name, please review first.</p>
        </div>
      )}

      <Slider {...settings}>
        {chunked.map((group, idx) => (
          <div key={idx}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              {group.map((item) => (
                <div
                  key={item._id}
                  className="bg-white shadow-md p-6 rounded-xl border border-gray-200 transition hover:shadow-lg"
                >
                  <p className="text-sm text-gray-700 italic mb-4">
                    “{item.comment}”
                  </p>

                  {/* রেটিং */}
                  <div className="rating rating-sm mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <input
                        key={i}
                        type="radio"
                        className="mask mask-star-2 bg-orange-400"
                        readOnly
                        checked={item.rating === i}
                      />
                    ))}
                  </div>

                  {/* ইউজার ইনফো */}
                  <div className="flex items-center gap-4 mt-4">
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs">{item.location}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString("bn-BD", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Reviews;
