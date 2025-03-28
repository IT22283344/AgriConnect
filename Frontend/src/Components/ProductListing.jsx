import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ProductListing({ product }) {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden w-full sm:w-[290px] transition-all duration-300 hover:shadow-xl hover:scale-105">
      <Link to={`/productview/${product._id}`} className="block">
        <div className="relative">
          <img
            src={
              product.images[0] ||
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400"
            }
            alt={product.productname}
            className="h-[220px] w-full object-cover"
          />
          <span className="absolute top-2 left-2 bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-800 truncate">
            {product.productname}
          </h2>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <p className="truncate">{product.quantity} available</p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-bold text-green-700">
              Rs.{product.price?.toLocaleString("en-US") || product.price?.toLocaleString("en-US")}
            </p>
            {product.discountedPrice ? (
              <p className="text-sm line-through text-gray-500">
                Rs.{product.discountedPrice?.toLocaleString("en-US")}
              </p>
            ):( <p className="text-sm line-through text-gray-500">
                Rs.{product.discountedPrice?.toLocaleString("en-US")}
              </p>)}
          </div>

          <button className="w-full mt-3 bg-lime-700 text-white font-semibold py-2 rounded-lg transition-all hover:bg-lime-800">
            View Details
          </button>
        </div>
      </Link>
    </div>
  );
}
