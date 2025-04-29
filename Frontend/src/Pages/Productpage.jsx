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

      const searchParams = new URLSearchParams(location.search);
      if (sidebardata.isNearby && currentUser?.district) {
        searchParams.set("district", currentUser.district);
      }

      const res = await fetch(`/api/product/getproductlists?${searchParams}`);
      let data = await res.json();

      if (sidebardata.isNearby && currentUser?.district) {
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
      setProducts(sortedData);
      setLoading(false);
    };

    fetchingProducts();
  }, [location.search, currentUser?.district]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (["all", "vegetables", "fruits", "grains", "other"].includes(id)) {
      setSidebardata((prev) => ({ ...prev, category: id }));
    }

    if (id === "searchTerm") {
      setSidebardata((prev) => ({ ...prev, searchTerm: value }));
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSidebardata((prev) => ({ ...prev, sort, order }));
    }

    if (id === "nearbyMe") {
      setSidebardata((prev) => ({ ...prev, isNearby: checked }));
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
    const res = await fetch(`/api/product/getproductlists?${urlParams}`);
    const data = await res.json();
    if (data.length < 8) setShowMore(false);
    setProducts((prev) => [...prev, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/4 lg:w-1/5 bg-white p-4 rounded-lg shadow border border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Search:</label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              className="border rounded-lg p-2 w-full text-gray-800 focus:ring-2 focus:ring-lime-600 outline-none"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700">Category:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["all", "vegetables", "fruits", "grains", "other"].map((cat) => (
                <label
                  key={cat}
                  className={`cursor-pointer flex items-center px-3 py-1 rounded-full text-sm font-medium transition 
                  ${
                    sidebardata.category === cat
                      ? "bg-lime-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-lime-500 hover:text-white"
                  }`}
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
              className="border rounded-lg p-2 text-gray-800 focus:ring-2 focus:ring-lime-600 outline-none"
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

          <button className="bg-lime-700 text-white font-semibold py-2 rounded-lg hover:bg-lime-800 transition">
            Search
          </button>
        </form>
      </div>

      <div className="w-full md:flex-1">
        <h1 className="text-xl md:text-2xl font-semibold border-b pb-3 px-2">
          Product Listings
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-600"></div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
          {!loading && products.length === 0 && (
            <p className="text-center text-gray-500 w-full">No Products Found!</p>
          )}

          {products.map((product) => (
            <ProductListing key={product._id} product={product} />
          ))}
        </div>

        {showMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={onShowMoreClick}
              className="bg-lime-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-lime-800 transition"
            >
              Show More ...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}