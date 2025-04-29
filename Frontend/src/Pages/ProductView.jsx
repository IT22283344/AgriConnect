


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";
import ReviewDisplay from "../Components/ReviewsDisplay";
import ReviewForm from "../Components/ReviewForm";
import MODRating from "../Components/ModRating";
import { HiStar } from "react-icons/hi";
import { addToCart } from "../redux/cart/cartSlice";

export default function ProductView() {
  SwiperCore.use([Navigation]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [Fivestar, setFivestar] = useState(0);
  const [Fourstar, setFourstar] = useState(0);
  const [Threestar, setThreestar] = useState(0);
  const [Twostar, setTwostar] = useState(0);
  const [Onestar, setOnestar] = useState(0);
  const [moderateRating, setmoderateRating] = useState(0);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/product/getproductlists/${params.productId}`
        );
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(data);
        setLoading(false);
        setError(false);
        getModeratereviews(data._id);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.productId]);

  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addToCart({ product, userId: user.id, FId: product.userId ,proId:product._id}));
      showNotification("Product added to the cart");
    } else {
      console.log("User not logged in");
    }
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
    setTimeout(() => {
      setNotification({ visible: false, message: "" });
    }, 3000);
  };

  const getModeratereviews = async (productId) => {
    try {
      const resStar = await fetch(
        `/api/reviews/getModarateRating/${productId}`
      );

      if (resStar.ok) {
        const starfilter = await resStar.json();
        console.log(starfilter);
        setFivestar(starfilter.Fivestar);
        setFourstar(starfilter.Fourstar);
        setThreestar(starfilter.Threestar);
        setTwostar(starfilter.Twostar);
        setOnestar(starfilter.Onestar);
        setmoderateRating(starfilter.moderateRating);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const StarRatingDisplay = ({
    Fivestar,
    Fourstar,
    Threestar,
    Twostar,
    Onestar,
    totalRatings,
  }) => {
    const calculateWidth = (starCount) => {
      return totalRatings > 0 ? (starCount / totalRatings) * 100 : 0;
    };

    return (
      <div className="lg:flex lg:flex-row ">
        <div className="lg:w-1/8 justify-items-end  pt-3  w-24 p-2 m-2 rounded-md flex flex-col items-center">
          <p className="text-3xl font-semibold text-center pt-8">
            {moderateRating >= 4.4 ? (
              <p className="text-sm bg-yellow-300  text-white  p-1 rounded-lg flex">
                <HiStar className="text-white text-lg" />
                TopRated{" "}
              </p>
            ) : (
              " "
            )}
          </p>
          <p className="text-3xl font-semibold text-center">
            <span className="font-semibold text-5xl font-sans"></span>{" "}
            {moderateRating}
          </p>
          <MODRating rating={moderateRating} />
          <p className="text-center">{totalRatings} ratings</p>
        </div>

        <div className="flex flex-wrap  lg:w-0 mr-2 ml-6 rounded-md border border-gray-200"></div>

        <div className="flex flex-wrap  p-8 lg:w-2/4 rounded-md ">
          <div className="flex flex-wrap justify-between  w-full items-center  m-1 rounded-md ">
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <div className="relative bg-gray-300 h-2 rounded-full flex-1 mx-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full"
                style={{ width: `${calculateWidth(Fivestar)}%` }}
              ></div>
            </div>
            <div className="text-sm pl-1"> {Fivestar}</div>
          </div>

          <div className="flex flex-wrap justify-between  w-full items-center  m-1 rounded-md ">
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <div className="relative bg-gray-300 h-2 rounded-full flex-1 mx-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full"
                style={{ width: `${calculateWidth(Fourstar)}%` }}
              ></div>
            </div>
            <div className="text-sm pl-1">{Fourstar}</div>
          </div>

          <div className="flex flex-wrap justify-between  w-full items-center  m-1 rounded-md ">
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <div className="relative bg-gray-300 h-2 rounded-full flex-1 mx-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full"
                style={{ width: `${calculateWidth(Threestar)}%` }}
              ></div>
            </div>
            <div className="text-sm pl-1">{Threestar}</div>
          </div>

          <div className="flex flex-wrap justify-between  w-full items-center  m-1 rounded-md ">
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <div className="relative bg-gray-300 h-2 rounded-full flex-1 mx-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full"
                style={{ width: `${calculateWidth(Twostar)}%` }}
              ></div>
            </div>
            <div className="text-sm pl-1">{Twostar}</div>
          </div>

          <div className="flex flex-wrap justify-between  w-full items-center  m-1 rounded-md ">
            <HiStar className="text-yellow-300 text-2xl" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <HiStar className="text-gray-200 text-2xl  border-gray-300" />
            <div className="relative bg-gray-300 h-2 rounded-full flex-1 mx-2 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full"
                style={{ width: `${calculateWidth(Onestar)}%` }}
              ></div>
            </div>
            <div className="text-sm pl-1">{Onestar}</div>
          </div>
        </div>
      </div>
    );
  };

  const totalRatings = Fivestar + Fourstar + Threestar + Twostar + Onestar;

  return (
    <main className="max-w-6xl mx-auto p-6">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-red-700 text-center my-7 text-2xl">
          Something went wrong!
        </p>
      )}
      {product && !error && !loading && (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Image Carousel */}
          <div className="relative w-full max-h-[500px] overflow-hidden rounded-xl shadow-lg">
            {product?.images?.length > 0 ? (
              <Swiper navigation>
                {product.images.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt="Product"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-center">No images available</p>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-4">
            <div className="flex flex-row justify-between">
              <span className="px-4 py-2 bg-red-600 text-white rounded-md">
                {product.category}
              </span>

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
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {product.productname}
            </h1>
            <p className="text-xl text-green-600 font-semibold">
              Rs. {product.price.toLocaleString("en-US")}
            </p>
            <p className="text-gray-700">{product.description}</p>

            <div className="flex items-center space-x-4">
              {product.offer && (
                <span className="px-4 py-2 bg-green-600 text-white rounded-md">
                  Rs. {+product.price - +product.discountedPrice} OFF
                </span>
              )}
            </div>
            <h1 className="text-xl font-semibold text-gray-900">

              Available stocks :{product.quantity}
              {product.unit}
              {product.quantity < 100 && <span style={{ color: 'red' }}> (Low Stock)</span>}

            </h1>

            {currentUser?.role === "wholeseller" && (
              <div className="flex flex-row gap-6">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            )}

            {copied && <p className="text-green-500 text-sm">Link copied!</p>}
          </div>
          <StarRatingDisplay
            Fivestar={Fivestar}
            Fourstar={Fourstar}
            Threestar={Threestar}
            Twostar={Twostar}
            Onestar={Onestar}
            totalRatings={totalRatings}
          />
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-6">
        {/*currentUser?.role === "wholeseller" && <ReviewForm />*/}
        <ReviewDisplay productId={product?._id} />
      </div>

      {notification.visible && (
        <div className="fixed bottom-4 right-4 bg-lime-700 text-white py-2 px-4 rounded-lg p-6">
          {notification.message}
        </div>
      )}
    </main>
  );
}

