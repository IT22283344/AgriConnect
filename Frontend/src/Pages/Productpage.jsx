import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductListing from "../Components/ProductListing";

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
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const categoryFromUrl = urlParams.get("category");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    setSidebardata({
      searchTerm: searchTermFromUrl || "",
      category: categoryFromUrl || "all",
      sort: sortFromUrl || "createdAt",
      order: orderFromUrl || "desc",
    });

    const fetchingProducts = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/product/getproductlists?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) setShowMore(true);
      else setShowMore(false);
      setProducts(data);
      setLoading(false);
    };

    fetchingProducts();
  }, [location.search]);

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("category", sidebardata.category);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
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
    if (data.length < 9) setShowMore(false);
    setProducts([...products, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 w-1/5 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Search:</label>
            <input
              type="text"
              placeholder="Search..."
              id="searchTerm"
              className="border rounded-lg p-2 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Category:</label>
            {["all", "vegetables", "fruits", "grains", "other"].map((cat) => (
              <div key={cat} className="flex items-center gap-1">
                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <input
                  type="radio"
                  id={cat}
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.category === cat}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-2"
            >
              <option value="price_desc">Price High to Low</option>
              <option value="price_asc">Price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-green-600 text-white rounded-lg p-2 hover:bg-green-700">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1  w-4/5 m-4">
        <h1 className="text-2xl font-semibold border-b pb-2">
          Product Listings
        </h1>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {!loading && products.length === 0 && <p>No Products Found!</p>}
          {loading && (
            <div className="flex flex-col items-center justify-center w-full my-6 animate-fadeIn">
              <div className="animate-spin rounded-full h-12 w-6 border-t-4 border-green-500 border-solid"></div>
              <p className="mt-2 text-sm text-gray-600">Fetching Products...</p>
            </div>
          )}
          {products.map((product) => (
            <ProductListing key={product._id} product={product} />
          ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
