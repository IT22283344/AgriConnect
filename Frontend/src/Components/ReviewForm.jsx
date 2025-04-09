import { Textarea, Alert, Button, FileInput, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function ReviewForm({ productname }) {
  const { currentUser } = useSelector((state) => state.user);
  const [reviewError, setReviewError] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [error, setError] = useState(false);
  const [product, setProduct] = useState("");
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (review.length > 300) {
        return;
      }
      if (file) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);

        const resizedFile = await resizeImage(file); // Resize the image

        const uploadTask = uploadBytesResumable(storageRef, resizedFile);

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

              setFormData({ ...formData, image: downloadURL });
              submitReview({ ...formData, reviewimage: downloadURL });

              setFile(null);
              setFormData({ ...formData, image: null });
            });
          }
        );
      } else {
        submitReview({ ...formData, productname });
      }
    } catch (error) {
      console.log(error);
      setImageUploadError("Failed to upload image");
      setImageUploadProgress(null);
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 50; // Define maximum width for resized image
          const MAX_HEIGHT = 50; // Define maximum height for resized image
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
              });
              resolve(resizedFile);
            },
            "image/jpeg",
            0.9
          );
        };
        reader.onerror = (error) => reject(error);
      };
    });
  };

  const submitReview = async (formData) => {
    try {
      const res = await fetch(`/api/reviews/add`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          content: review,
          rating,
          productname: product.productname,
          productId: product._id,
          farmerId: product.userId,
          userrefId: currentUser._id,
          userId: currentUser.userId,
          reviewimage: formData.reviewimage,
          username: currentUser.username,
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setReview("");
        setRating();
        setReviewError(null);
      }
      if (!res.ok) {
        setReviewError(data.message);
        return;
      }
    } catch (error) {
      setReviewError(error.message);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/product/getproductlists/${params.productId}`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setProduct(data);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchProduct();
  }, [params.productId]);

  const handleRatingChange = (star) => {
    setRating(star);
  };

  const handleUploadImage = () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
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
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Failed to upload image");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  return (
    <form
      className=" gap-10 border max-w-3xl justify-center items-start border-teal-500 rounded-xl p-3"
      onSubmit={handleSubmit}
    >
      <div className="p-2">
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`mr-1 text-xl cursor-pointer ${
                rating >= star ? "text-yellow-300" : "text-gray-400"
              }`}
              onClick={() => handleRatingChange(star)} // Set rating directly
            />
          ))}
        </div>
      </div>
      <Textarea
        placeholder="Add review.."
        rows="3"
        maxLength="300"
        onChange={(e) => setReview(e.target.value)}
        value={review}
      />
      <p className="text-gray-500 text-xs">
        {300 - review.length} characters remaining
      </p>
      <div className="mt-5">
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-82 object-cover"
          />
        )}
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-10 border-4 border-teal-500 border-dotted p-3 w-full">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="pl-40">
              <Button
                onClick={handleUploadImage}
                type="button"
                gradientDuoTone="purpleToBlue"
                size="sm"
                outline
                disabled={imageUploadProgress}
              >
                {imageUploadProgress ? (
                  <div className="w-16 h-16 ">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}`}
                    />
                  </div>
                ) : (
                  "Upload Image"
                )}
              </Button>
            </div>
          </div>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
      </div>
      <button
        type="submit"
        className="gap-8 m-2 dark:bg-slate-800 border bg-slate-300 border-teal-500 rounded-xl w-full py-2"
      >
        Submit
      </button>
      {reviewError && <Alert color="failure">{reviewError}</Alert>}
    </form>
  );
}
