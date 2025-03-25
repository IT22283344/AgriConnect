import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Reviews from "./Reviews";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Modal, Button } from "flowbite-react";

export default function ReviewDisplay({ productId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchReviews = async (startIndex = 0) => {
    try {
      const res = await fetch(`/api/reviews/getProductReview/${productId}?startIndex=${startIndex}&limit=4`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setReviews((prevReviews) => [...prevReviews, ...data]);
          if (data.length < 4) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleShowMore = () => {
    fetchReviews(reviews.length);
  };

  const handleUpdate = (review, updatedContent) => {
    setReviews(
      reviews.map((r) =>
        r._id === review._id ? { ...r, content: updatedContent } : r
      )
    );
  };

  const handleDelete = async (reviewId) => {
    try {
      setShowModal(false);
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/reviews/deleteReview/${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          {/* Add any content for signed-in users here */}
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to the system
          <Link className="text-blue-600 hover:underline" to="/sign-in">
            Sign In
          </Link>
        </div>
      )}
      {reviews.length === 0 ? (
        <p className="text-sm my-5">No Reviews yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p className="font-semibold">Reviews</p>
            <div className="border border-gray-400 py-1 px-2 rounded-md">
              <p className="font-semibold">{reviews.length}</p>
            </div>
          </div>
          {reviews.map((review) => (
            <Reviews
              key={review._id}
              review={review}
              onUpdate={handleUpdate}
              onDelete={(reviewId) => {
                setShowModal(true);
                setReviewToDelete(reviewId);
              }}
            />
          ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More Reviews
            </button>
          )}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
                  Are you sure you want to delete this review?
                </h3>
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => handleDelete(reviewToDelete)}
                >
                  Yes, I am sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
