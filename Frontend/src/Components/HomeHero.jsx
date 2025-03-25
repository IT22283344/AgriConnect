import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaCalendarAlt,
  FaClock,
  FaMoneyBill,
  FaTag,
  FaSpinner,
  FaStar,
} from "react-icons/fa";
export const HomeHero = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
  }, []);
  return (
    <>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 text-black p-32 rounded-lg shadow-lg flex flex-wrap">
        {/* Left Section: Title and Description */}
        <div className="flex-1 mb-8 mt-24" data-aos="fade-up">
          <h1 className="text-5xl font-semibold">Find Your Hostel.</h1>
          <p className="text-lg mt-2">
            Choose where to stay and we’ll show you who with!
          </p>
          <p className="text-gray-600 text-md w-8/12">
            We understand that finding the right place to stay is crucial for
            your travel experience. Our carefully curated selection of hostels
            offers you the best options to suit your budget and preferences.
            With verified listings, user reviews, and a commitment to quality,
            you can trust us to help you find the ideal hostel that feels like
            home. Start your adventure with confidence—your perfect stay is just
            a click away!
          </p>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 px-3 rounded-lg mt-5">
            Get Started
          </button>
        </div>

        {/* Right Section: Profile Images and Text */}
        <div
          className="flex flex-col justify-start items-end space-y-4 relative mb-12 flex-none"
          data-aos="slide-left"
        >
          {/* Profiles */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User 1"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <p className="bg-purple-600 text-sm py-1 px-2 rounded-lg text-white">
                Hostel bar, 9pm?
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User 2"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <p className="bg-purple-600 text-sm py-1 px-2 rounded-lg text-white">
                Anyone else here looking for a hostel?
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/12.jpg"
                alt="User 3"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <p className="bg-purple-600 text-sm py-1 px-2 rounded-lg text-white">
                Do we have easy access to the university?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="text-center w-1/2 justify-center border rounded-lg p-5 m-5 content-center mt-4 text-sm text-black">
       
              <>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`mr-1 cursor-pointer ${
                        ( 0) >= star
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                     // onClick={() => handleRatingChange(booking.orderId, star)}
                    />
                  ))}
                </div>
                <textarea
                  className="w-full p-2 border rounded-lg mb-2"
                  placeholder="Write your review..."
                  //value={reviewMessages[booking.orderId] || ""}
                 
                />
                {/*<button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() =>
                    handleReviewClick(booking.orderId, booking.eventType)
                  }
                >
                  Submit Review
                </button>*/}
              </>
            
          </div>
        
    </>
  );
};

export default HomeHero;
