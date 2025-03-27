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
      <div className="bg-gradient-to-r from-green-50 to-green-100 text-black p-32 rounded-lg shadow-lg flex flex-wrap">
        {/* Left Section: Title and Description */}
        <div className="flex-1 mb-8 mt-24" data-aos="fade-up">
          <h1 className="text-5xl font-semibold">
            Connect with Farmers & Wholesalers.
          </h1>
          <p className="text-lg mt-2">
            Bridging the gap to ensure fair prices and sustainability for all!
          </p>
          <p className="text-gray-600 text-md w-8/12">
            At Agri Connect, we understand the importance of fostering strong
            relationships between farmers and wholesalers. Our platform allows
            you to access a wide range of crops, fair pricing, and direct
            communication with trusted suppliers. Whether you're a farmer
            looking for wholesalers or a wholesaler seeking high-quality
            produce, our system ensures you get the best deals and access to
            valuable insights for a sustainable agricultural market. Join us
            today and be part of a brighter, fairer future for agriculture.
          </p>

          <button className="bg-green-600 hover:bg-green-700 text-white p-2 px-3 rounded-lg mt-5">
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
              <p className="bg-green-600 text-sm py-1 px-2 rounded-lg text-white">
                "Found the perfect pricing for my crops!"
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User 2"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <p className="bg-green-600 text-sm py-1 px-2 rounded-lg text-white">
                "Great platform to connect with reliable wholesalers!"
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/12.jpg"
                alt="User 3"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <p className="bg-green-600 text-sm py-1 px-2 rounded-lg text-white">
                "A true game changer for the agriculture industry."
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeHero;
