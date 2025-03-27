import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between px-10 py-20 md:py-32 bg-[#f8f8f8]">
      {/* Left Side - Text Content */}
      <div className="md:w-1/2 space-y-6 text-center md:text-left" data-aos="fade-up">
        <h2 className="text-lg font-semibold text-green-600 uppercase tracking-wide">
          Welcome to <span className="text-lime-700">AGRI-CONNECT+</span>
        </h2>
        <h1 className="text-5xl font-bold leading-tight text-gray-900">
          Connecting <span className="text-lime-700">Farmers & Wholesalers</span> for a Better Future.
        </h1>
        <p className="text-lg text-gray-600">
          Get fair pricing, reliable connections, and expert recommendations on crops based on weather and time.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center md:justify-start">
          <Link to='/productpage'>
            <button className="bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all">
              Explore Now
            </button>
          </Link>
          <Link to='/about'>
            <button className="bg-white border border-lime-700 text-lime-700 hover:bg-lime-700 hover:text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* Right Side - Images */}
      <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center relative" data-aos="slide-left">
        <div className="grid grid-cols-2 gap-4">
          <img 
            src="https://static.vecteezy.com/system/resources/thumbnails/024/495/516/small_2x/agricultural-technologies-for-growing-plants-and-scientific-research-in-the-field-of-biology-and-chemistry-of-nature-living-green-sprout-in-the-hands-of-a-farmer-generate-ai-free-photo.jpg"
            alt="Farmers"
            className="rounded-xl  shadow-lg"
          />
          <img 
            src="https://www.treehugger.com/thmb/Ya1Mnkkyz_14Ip4AwfQPpmz0aQM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1211728499-9d9159040aa845f59ddfed810edd2cfc.jpg"
            alt="Marketplace"
            className="rounded-xl shadow-lg"
          />
          <img 
            src="https://www.agrivi.com/wp-content/uploads/2021/05/Vegetable-Farming-From-its-Beginnings-1200x565.jpeg"
            alt="Collaboration"
            className="rounded-xl shadow-lg col-span-2 w-full"
          />
        </div>
      </div>

      {/* Background Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-10"></div>
    </div>
  );
};

export default HeroSection;
