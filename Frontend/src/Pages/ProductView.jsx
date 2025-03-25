import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
//import Contact from "../Components/Contact";
//import FloatingWhatsAppButton from "../Components/Floatingwhatsappbutton";

export default function ProductView() {
  SwiperCore.use([Navigation]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/product/getproductlists/${params.productId}`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.productId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-red-700 text-center my-7 text-2xl">
          Something went wrong!
        </p>
      )}
      {product && !error && !loading && (
        <div>
          <Swiper navigation>
            {console.log(product.images)}
            {product?.images?.length > 0 ? (
              <Swiper navigation>
                {product.images.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="h-[650px] bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>No images available</p>
            )}
          </Swiper>

          {/* Share link copy button functionality */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            />
          </div>

          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {product.productname} - $ {product.price.toLocaleString("en-US")}
              {product.catogory}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-lg">
              {product.quantity} {product.unit}
            </p>

            <div className="flex gap-4 pb-3">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {product.catogory}
              </p>
              {product.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  $ {+product.price - +product.discountedPrice} OFF
                </p>
              )}
            </div>

            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {product.description}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
