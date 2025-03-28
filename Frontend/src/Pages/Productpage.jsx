import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductListing from "../Components/ProductListing";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

export default function ProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    category: "all",
    sort: "createdAt",
    order: "desc",
    isNearby: false,
  });
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const categoryFromUrl = urlParams.get("category");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const isNearbyFromUrl = urlParams.get("isNearby") === "true";

    setSidebardata({
      searchTerm: searchTermFromUrl || "",
      category: categoryFromUrl || "all",
      sort: sortFromUrl || "createdAt",
      order: orderFromUrl || "desc",
      isNearby: isNearbyFromUrl,
    });

    const fetchingProducts = async () => {
      setLoading(true);
      setShowMore(false);

      const urlParams = new URLSearchParams(location.search);

      if (currentUser?.district) {
        urlParams.set("district", currentUser.district);
      }

      if (isNearbyFromUrl) {
        urlParams.set("isNearby", "true");
      }

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/product/getproductlists?${searchQuery}`);
      let data = await res.json();

      if (isNearbyFromUrl && currentUser?.district) {
        data = data.filter(
          (product) => product.district === currentUser.district
        );
      }

      const sortedData = data.sort((a, b) => {
        if (
          a.district === currentUser?.district &&
          b.district !== currentUser?.district
        ) {
          return -1;
        } else if (
          b.district === currentUser?.district &&
          a.district !== currentUser?.district
        ) {
          return 1;
        }
        return 0;
      });

      setShowMore(data.length > 7);
      setProducts(data);
      setLoading(false);
    };

    fetchingProducts();
  }, [location.search, currentUser?.district]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (["all", "vegetables", "fruits", "grains", "other"].includes(id)) {
      setSidebardata({ ...sidebardata, category: id });
    }

    if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata({ ...sidebardata, sort, order });
    }

    if (id === "nearbyMe") {
      setSidebardata({ ...sidebardata, isNearby: checked });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("category", sidebardata.category);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    urlParams.set("isNearby", sidebardata.isNearby);
    navigate(`/productpage?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = products.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const res = await fetch(
      `/api/product/getproductlists?${urlParams.toString()}`
    );
    const data = await res.json();
    if (data.length < 8) setShowMore(false);
    setProducts([...products, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-6 w-full md:w-1/4 lg:w-1/5 bg-white shadow-lg rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Search:</label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              className="border rounded-lg p-3 w-full mt-1 text-gray-800 focus:ring-2 focus:ring-lime-600 outline-none transition"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Category:</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {["all", "vegetables", "fruits", "grains", "other"].map((cat) => (
                <label
                  key={cat}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg 
                  ${
                    sidebardata.category === cat
                      ? "bg-lime-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  } 
                  hover:bg-lime-500 hover:text-white transition`}
                >
                  <input
                    type="radio"
                    id={cat}
                    className="hidden"
                    onChange={handleChange}
                    checked={sidebardata.category === cat}
                  />
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Sort By:</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-3 mt-1 text-gray-800 focus:ring-2 focus:ring-lime-100 outline-none transition"
            >
              <option value="createdAt_desc"> Latest</option>
              <option value="createdAt_asc"> Oldest</option>
              <option value="price_desc"> Price: High to Low</option>
              <option value="price_asc"> Price: Low to High</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="nearbyMe"
              checked={sidebardata.isNearby}
              onChange={handleChange}
            />
            <label htmlFor="nearbyMe" className="font-semibold text-gray-700">
              Nearby Me
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <button className="bg-lime-700 text-white font-semibold py-3 rounded-lg hover:bg-lime-800 transition">
              Search
            </button>
            <button
              type="button"
              // onClick={clearFilters}
              className="bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 w-4/5 m-4 relative">
        <h1 className="text-2xl font-semibold border-b text-start p-4 pb-6">
          Product Listings
        </h1>

        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-600"></div>
          </div>
        )}

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {!loading && products.length === 0 && (
            <p className="text-center text-gray-500 w-full">
              No Products Found!
            </p>
          )}

          {products.map((product) => (
            <ProductListing key={product._id} product={product} />
          ))}
        </div>

        {showMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={onShowMoreClick}
              className="bg-lime-700 text-white font-semibold py-2 px-8 rounded-lg hover:bg-lime-800 transition"
            >
              Show More ...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
