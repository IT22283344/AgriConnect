import { Alert, Badge, Button, FileInput, Select, TextInput } from "flowbite-react";
import { HiOutlineCloudUpload, HiOutlineTrash } from "react-icons/hi";

import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaStar, FaTimes } from "react-icons/fa";

export default function UpdateReview() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchReview = async () => {
        const res = await fetch(`/api/reviews/getReviews?reviewId=${reviewId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.reviews[0]);
        }
      };

      fetchReview();
    } catch (error) {
      console.log(error.message);
    }
  }, [reviewId]);

  const handleUploadImage = () => {
    try {
      if (!file) {
        setImageUploadError("please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },

        (error) => {
          setImageUploadError("Image upload failed");
          console.error("Upload error:", error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, reviewimage: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Failed to upload image");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/reviews/UpdateReview/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        window.location.reload();
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleCancel = () => {
    // Redirect to the product slug
    window.location.reload();
  };

  const handleRatingChange = (star) => {
    setRating(star);
    setFormData({ ...formData, rating: star }); 
  };

  const removeImage = () => {
    setFormData({ ...formData, reviewimage: "" });
    setFile(null);
  };
  

  return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Update Your Review</h1>
        <p className="text-gray-500 mt-2">
          Share your updated experience with this product
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleUpdateReview}>
        {/* Rating Section */}
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none"
              >
                <FaStar
                  className={`text-2xl mx-1 ${
                    formData.rating >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {formData.rating} out of 5 stars
          </span>
        </div>

        {/* Review Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium mb-1"
          >
            Your Review
          </label>
          <TextInput
            id="content"
            type="text"
            placeholder="Share your thoughts..."
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Review Image
          </label>
          
          {formData.reviewimage ? (
            <div className="relative group">
              <img
                src={formData.reviewimage}
                alt="Review"
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md text-red-500 hover:bg-red-50 transition-all"
                aria-label="Remove image"
              >
                <HiOutlineTrash className="w-5 h-5" />
              </button>
              <Badge color="success" className="absolute top-2 left-2">
                Uploaded
              </Badge>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <HiOutlineCloudUpload className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drag & drop your image here, or click to select
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="review-image-upload"
                />
                <label
                  htmlFor="review-image-upload"
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  Select Image
                </label>
              </div>
            </div>
          )}

          {file && !formData.reviewimage && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700 truncate max-w-xs">
                {file.name}
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={imageUploadProgress}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {imageUploadProgress ? (
                    <div className="w-6 h-6">
                      <CircularProgressbar
                        value={imageUploadProgress}
                        text={`${imageUploadProgress}%`}
                        styles={{
                          path: { stroke: "#ffffff" },
                          text: { fill: "#ffffff", fontSize: "24px" },
                        }}
                      />
                    </div>
                  ) : (
                    "Upload"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          {imageUploadError && (
            <Alert color="failure" className="mt-2">
              {imageUploadError}
            </Alert>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="px-6 py-2"
          >
            Update Review
          </Button>
        </div>

        {publishError && (
          <Alert color="failure" className="mt-4">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
