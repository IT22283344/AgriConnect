import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function OrderSuccess() {
 
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-evenly min-h-screen bg-gray-50 gap-10">
      {/* Text Section */}
      <div className="mx-28" data-aos="fade-up">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Your order is received!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
         Farmer will contact you soon when your order is ready. Thank you for connecting with us!
        </p>
        <Link to='/'>
          <button className='bg-lime-600 hover:bg-lime-700 text-white p-2 rounded-lg px-3'>Home</button>
        </Link>
        <Link to='/productpage'>
          <button className='bg-lime-700 hover:bg-lime-700 text-white p-2 rounded-lg px-3 mx-5'>Return</button>
        </Link>
      </div>

      {/* Image Section */}
      <div className="p-6" data-aos="zoom-in">
        <img 
          src="/img/oredercomp.png" 
          alt="Order Success" 
          className="w-8/12 h-auto mx-24"
        />
      </div>
    </div>
  );
}
