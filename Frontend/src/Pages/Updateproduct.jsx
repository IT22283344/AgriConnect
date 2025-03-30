
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextInput,
  Select,
  Textarea,
  Label,
  Alert,
  Spinner,
} from "flowbite-react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function UpdateProduct() {
  const [formData, setFormData] = useState({
    productname: "",
    description: "",
    price: 0,
    quantity: 0,
    unit: "kg",
    category: "vegetables",
    discountedPrice: 0,
    isAvailable: true,
    images: []
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/getproductlists/${productId}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }

        const data = await res.json();
        setFormData({
          productname: data.productname || "",
          description: data.description || "",
          price: data.price || 0,
          quantity: data.quantity || 0,
          unit: data.unit || "kg",
          category: data.category || "vegetables",
          discountedPrice: data.discountedPrice || 0,
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
          images: data.images || [],
          _id: data._id
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUploadImages = async () => {
    try {
      if (files.length > 0) {
        if (formData.images.length + files.length > 6) {
          return setImageUploadError("Maximum 6 images allowed");
        }

        setUploadingImages(true);
        setImageUploadError(null);

        const uploadPromises = files.map((file) => {
          if (file.size > 2 * 1024 * 1024) {
            throw new Error("File size exceeds 2MB");
          }

          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);

          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
              },
              (error) => reject(error),
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then(resolve)
                  .catch(reject);
              }
            );
          });
        });

        const urls = await Promise.all(uploadPromises);
        setFormData({
          ...formData,
          images: [...formData.images, ...urls]
        });
        setFiles([]);
        setImageUploadProgress(null);
      }
    } catch (error) {
      setImageUploadError(
        error.message || "Image upload failed (max 2MB per image)"
      );
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const res = await fetch(
        `/api/product/updateproduct/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      setSuccessMessage("Product updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-3">
    <h1 className="text-3xl font-semibold text-center my-7 text-green-700">
      Update Product
    </h1>

    {/* Added success message display */}
    {successMessage && (
      <Alert color="success" className="mb-4">
        {successMessage}
      </Alert>
    )}

    {error && (
      <Alert color="failure" className="mb-4">
        {error}
      </Alert>
    )}

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="productname" value="Product Name" />
          <TextInput
            id="productname"
            type="text"
            placeholder="Product name"
            required
            onChange={handleChange}
            value={formData.productname}
          />
        </div>

        <div>
          <Label htmlFor="category" value="Category" />
          <Select
            id="category"
            required
            onChange={handleChange}
            value={formData.category}
          >
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="price" value="Price (Rs.)" />
          <TextInput
            id="price"
            type="number"
            placeholder="Price"
            required
            onChange={handleChange}
            value={formData.price}
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="quantity" value="Quantity" />
          <TextInput
            id="quantity"
            type="number"
            placeholder="Quantity"
            required
            onChange={handleChange}
            value={formData.quantity}
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="unit" value="Unit" />
          <Select
            id="unit"
            required
            onChange={handleChange}
            value={formData.unit}
          >
            <option value="kg">Kilogram</option>
            <option value="g">Gram</option>
            <option value="l">Liter</option>
            <option value="ml">Milliliter</option>
            <option value="piece">Piece</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="discountedPrice" value="Discounted Price (Rs.)" />
          <TextInput
            id="discountedPrice"
            type="number"
            placeholder="Discounted Price"
            onChange={handleChange}
            value={formData.discountedPrice}
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isAvailable"
            className="w-4 h-4"
            onChange={handleChange}
            checked={formData.isAvailable}
          />
          <Label htmlFor="isAvailable">Available</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="description" value="Description" />
        <Textarea
          id="description"
          placeholder="Product description..."
          rows="4"
          onChange={handleChange}
          value={formData.description}
        />
      </div>

      {/* Image Upload Section */}
      <div className="flex flex-col gap-4">
        <Label>Product Images</Label>
        <div className="flex gap-4">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="border rounded-lg p-2 w-full"
            accept="image/*"
          />
          <Button
            type="button"
            onClick={handleUploadImages}
            disabled={uploadingImages || files.length === 0}
            gradientDuoTone="greenToBlue"
            outline
          >
            {uploadingImages ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {imageUploadError && (
          <Alert color="failure">{imageUploadError}</Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {formData.images?.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        gradientDuoTone="greenToBlue"
        outline
        disabled={loading}
        className="mt-4"
      >
        {loading ? "Updating..." : "Update Product"}
      </Button>
    </form>
  </div>
  );
}