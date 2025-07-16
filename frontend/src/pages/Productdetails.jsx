import React, { useState } from "react"; // Import useState for notification state
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useAggregateRating from "../hooks/useAggregateRating";
import useWishlist from "../hooks/useWishlist";
import Notification from "../components/Notification"; // Import the Notification component
import PaymentModal from "../components/PaymentModal"; // Import the PaymentModal component

function Productdetails() {
  const { id } = useParams();

  // State for managing the notification
  const [notification, setNotification] = useState(null); // { message: '', type: 'success' | 'error' }
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch product details
  const { data: product, loading: productLoading, error: productError } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
  // Fetch reviews for the product
  const { data: reviews, loading: reviewsLoading, error: reviewsError } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/product/${id}`);

  // Utilize the useWishlist hook. It now handles fetching its own initial state.
  const {
    isInWishlist,
    loading: wishlistActionLoading, // This now covers initial fetch of wishlist status and add/remove actions
    error: wishlistActionError,
    addToWishlist,
    removeFromWishlist
  } = useWishlist(id); // Pass only productId

  // Calculate average rating
  const { avgRating, total } = useAggregateRating(reviews);

  // Function to show a notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  // Function to clear the notification
  const clearNotification = () => {
    setNotification(null);
  };

  // Handle payment success
  const handlePaymentSuccess = (transaction) => {
    showNotification('Payment successful! Your order has been placed.', 'success');
    // You can redirect to order confirmation page or user profile here
  };

  // Handle overall loading states
  if (productLoading || reviewsLoading || wishlistActionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white dark:text-gray-300">
        Loading product details...
      </div>
    );
  }

  // Handle overall error states
  if (productError || reviewsError || wishlistActionError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400">
        Error loading product: {productError?.message || reviewsError?.message || wishlistActionError?.message || "Unknown error"}
      </div>
    );
  }

  // Handle case where product is not found after loading
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-300">
        Product not found.
      </div>
    );
  }

  // Handle wishlist button click
  const handleWishlistClick = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist();
        showNotification("Removed from wishlist!", "success");
      } else {
        await addToWishlist();
        showNotification("Added to wishlist!", "success");
      }
    } catch (err) {
      showNotification(wishlistActionError || "Failed to update wishlist.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-16 px-4 sm:px-8 lg:px-16 flex justify-center items-start">
      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        product={product}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <div className="w-full max-w-6xl mt-5 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">

        {/* Product Layout (Row) */}
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 bg-gray-200 dark:bg-gray-700 flex items-center justify-center p-6">
            <img
              className="w-full h-full object-contain rounded"
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `${import.meta.env.VITE_API_BASE_URL}/uploads/productImages/${product.image}`
              }
              alt={product.name}
            />
          </div>

          {/* Info */}
          <div className="md:w-1/2 p-8 space-y-6 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-green-500 mb-2">₹{product.price}</h2>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating)
                        ? "text-yellow-400 dark:text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.044 3.21a1 1 0 00.95.69h3.396c.969 0 1.371 1.24.588 1.81l-2.748 2.006a1 1 0 00-.364 1.118l1.045 3.21c.3.921-.755 1.688-1.538 1.118L10 13.348l-2.748 2.006c-.783.57-1.838-.197-1.538-1.118l1.045-3.21a1 1 0 00-.364-1.118L3.647 8.637c-.783-.57-.38-1.81.588-1.81h3.396a1 1 0 00.95-.69l1.044-3.21z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {avgRating} ({total} reviews)
                </span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col mt-4 mb-4 sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
                >
                  Buy Now
                </button>
                <button
                  className={`flex-1 px-6 py-3 rounded-lg text-lg transition ${
                    isInWishlist
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } ${wishlistActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleWishlistClick}
                  disabled={wishlistActionLoading}
                >
                  {wishlistActionLoading
                    ? (isInWishlist ? "Removing..." : "Adding...")
                    : (isInWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
                </button>
              </div>
              {wishlistActionError && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                  {wishlistActionError}
                </p>
              )}

              {/* Description */}
              <h3 className="text-lg font-bold mt-10 text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
            </div>
          </div>
        </div>

        {/* User Reviews Section — Placed Right Below */}
        {reviews && reviews.length > 0 && (
          <div className="w-full p-6 border-t border-gray-300 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">User Reviews</h3>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm border dark:border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800 dark:text-white">{r.userName}</h4>
                    <span className="text-sm text-yellow-400">⭐ {r.rating}/5</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productdetails;
