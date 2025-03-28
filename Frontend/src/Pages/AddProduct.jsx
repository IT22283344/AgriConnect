import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Button, Label, Select, Table } from "flowbite-react";

export default function AddProduct() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  console.log(currentUser);
  const [formData, setFormData] = useState({
    productname: "",
    category: "",
    description: "",
    price: "",
    unit: "",
    quantity: "",
    discountedPrice: 0,
    images: [],
    productSlug: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  console.log(formData);

  const handleSubmitImages = (e) => {
    if (files.length > 0 && files.length + formData.images.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            images: formData.images.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload Failed!(Max 2 Mb per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing.");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "offer") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.images.length < 1)
        return setError("You must upload at least one image.");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discounted price must be lower than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch("/api/product/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser.userId,
          province: currentUser.province,
          district: currentUser.district,
          town: currentUser.town,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/dashboard?tab=profile`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const [priceData, setPriceData] = useState({
    averagePrices: [],
    districtPrices: [],
  });
  const [activeTab, setActiveTab] = useState("district");
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setPriceLoading(true);
        const res = await fetch(`/api/product/getProductavgprices`);
        const data = await res.json();

        if (res.ok) {
          setPriceData({
            averagePrices: data.averagePrices || [],
            districtPrices: data.districtPrices || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch price data:", error);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  return (
    <main className=" max-w-4xl mx-auto border rounded-lg m-5 p-4 shadow-lg">
      <section className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Market Price Reference</h2>

        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "average"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("average")}
          >
            Product Averages
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "district"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("district")}
          >
            District Prices
          </button>
        </div>

        {priceLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === "average" ? (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Product</Table.HeadCell>
                <Table.HeadCell>Avg Price (Rs.)</Table.HeadCell>
                <Table.HeadCell>Unit</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {priceData.averagePrices.length > 0 ? (
                  priceData.averagePrices.map((item, index) => (
                    <Table.Row key={`avg-${index}`}>
                      <Table.Cell className="font-medium">
                        {item.productname}
                      </Table.Cell>
                      <Table.Cell>{item.averagePrice?.toFixed(2)}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={3} className="text-center py-4">
                      No average price data available
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>District</Table.HeadCell>
                <Table.HeadCell>Product</Table.HeadCell>
                <Table.HeadCell>Price (Rs.)</Table.HeadCell>
                <Table.HeadCell>Unit</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {priceData.districtPrices.length > 0 ? (
                  priceData.districtPrices.map((item, index) => (
                    <Table.Row key={`dist-${index}`}>
                      <Table.Cell className="font-medium">
                        {item.district}
                      </Table.Cell>
                      <Table.Cell>{item.productname}</Table.Cell>
                      <Table.Cell>{item.averagePrice?.toFixed(2)}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="text-center py-4">
                      No district price data available
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}
      </section>
      <h1 className="text-3xl font-semibold text-center my-7">Add product</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col">
            <Label>ProductName</Label>
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="productname"
              maxLength="62"
              minLength="5"
              required
              onChange={handleChange}
              value={formData.productname}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="meat">Meat</option>
              <option value="grains">Grains</option>
              <option value="other">Others</option>
            </Select>
          </div>
          <div className="flex flex-col">
            <Label>Description</Label>
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-row justify-between gap-5">
            <div className="flex flex-col">
              <Label>Quantity</Label>
              <input
                type="number"
                placeholder="Quantity"
                className="border p-3 rounded-lg"
                id="quantity"
                maxLength="62"
                minLength="5"
                required
                onChange={handleChange}
                value={formData.quantity}
              />
            </div>
            <div className="flex flex-col">
              <Label>Units</Label>
              <input
                type="text"
                placeholder="Units"
                className="border p-3 rounded-lg"
                id="unit"
                required
                onChange={handleChange}
                value={formData.unit}
              />
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-row justify-start items-center gap-2">
            <div className="flex flex-col">
              <Label>Unit Price (Rs.)</Label>
              <input
                type="number"
                id="price"
                min="50"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.price}
              />
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <Label>Discounted Unit Price (Rs.)</Label>
                  <input
                    type="number"
                    id="discountedPrice"
                    min="0"
                    max="10000"
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.discountedPrice}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 pl-6">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              First image will be the cover(Max 6)
            </span>
          </p>
          <div className="flex m-1  gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              disabled={uploading}
              onClick={handleSubmitImages}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((url, index) => (
                <div
                  key={url}
                  className="relative group border rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={url}
                    alt="Listing image"
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold uppercase shadow-md hover:bg-red-600 transition"
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="p-3 text-center bg-white rounded-b-xl">
                    <p className="text-sm text-gray-600 truncate">
                      Image {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white border  rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}

// In your return statement, replace the price section with:
