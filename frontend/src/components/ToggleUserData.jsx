import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import ReviewForm from "../components/ReviewForm";
import EditProduct from "../components/EditProduct"; // Import the EditProduct component
import Notification from "./Notification";

function ToggleUserData() {
  const [activeTab, setActiveTab] = useState("orders");
  const [reviewingProductId, setReviewingProductId] = useState(null);
  // State to hold the ID of the product being edited (for inline display)
  const [editingProductId, setEditingProductId] = useState(null);

  // State for notification
  const [notification, setNotification] = useState(null);

  const { data: listings, refetch: refetchListings } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/products`);
  const { data: orders } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/transactions`);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const toggleReviewForm = (productId) => {
    if (reviewingProductId === productId) {
      setReviewingProductId(null);
    } else {
      setReviewingProductId(productId);
    }
    setEditingProductId(null); // Close edit form if review form is opened
  };

  // Function to handle clicking "Edit Listing"
  const handleEditListing = (productId) => {
    if (editingProductId === productId) {
      setEditingProductId(null); // If already editing, close it
    } else {
      setEditingProductId(productId); // Set the ID of the product to be edited
    }
    setReviewingProductId(null); // Close review form if edit form is opened
  };

  // Callback for when EditProduct successfully updates
  const handleProductUpdated = (updatedProduct) => {
    console.log("Product updated:", updatedProduct);
    setEditingProductId(null); // Close the edit form
    refetchListings(); // Re-fetch listings to show updated data
    showNotification("Listing updated successfully!", "success");
  };

  // Callback for when EditProduct is cancelled
  const handleCancelEdit = () => {
    setEditingProductId(null); // Close the edit form
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 my-8 max-w-5xl mx-auto">
      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab("orders");
            setReviewingProductId(null);
            setEditingProductId(null); // Close edit form if switching tabs
          }}
          className={`px-4 py-2 rounded ${
            activeTab === "orders"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
          }`}
        >
          My Orders
        </button>
        <button
          onClick={() => {
            setActiveTab("listings");
            setReviewingProductId(null); // Close review form if switching tabs
            setEditingProductId(null); // Close edit form if switching tabs
          }}
          className={`px-4 py-2 rounded ${
            activeTab === "listings"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
          }`}
        >
          My Listings
        </button>
      </div>

      {/* Orders Section */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {orders?.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/productImages/${order.productId?.image}`}
                    alt={order.productId?.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {order.productId?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ₹{order.productId?.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Ordered on: {new Date(order.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Status: {order.status}
                    </p>
                    <button
                      className="text-blue-600 hover:underline text-sm mt-2"
                      onClick={() => toggleReviewForm(order.productId._id)}
                    >
                      {reviewingProductId === order.productId._id
                        ? "Cancel Review"
                        : "Leave Review"}
                    </button>
                  </div>
                </div>
                {reviewingProductId === order.productId._id && (
                  <div className="mt-4">
                    {/* Pass onCancel to ReviewForm so it can close itself */}
                    <ReviewForm productId={order.productId._id} onCancel={() => setReviewingProductId(null)} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-8">
              No orders found.
            </p>
          )}
        </div>
      )}

      {/* Listings Section */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          {listings?.length > 0 ? (
            listings.map((product) => (
              <React.Fragment key={product._id}> {/* Use React.Fragment to group */}
                <div
                  className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/uploads/productImages/${product.image}`}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        ₹{product.price}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Brand: {product.brand || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Product ID: {product._id}
                      </p>
                      <button
                        className="text-blue-600 hover:underline text-sm mt-2"
                        onClick={() => handleEditListing(product._id)}
                      >
                        Edit Listing
                      </button>
                    </div>
                  </div>
                </div>
                {/* Conditionally render EditProduct directly below the clicked listing */}
                {editingProductId === product._id && (
                  <div >
                    <EditProduct
                      product={product} // Pass the full product object to EditProduct
                      onUpdate={handleProductUpdated}
                      onCancel={handleCancelEdit}
                    />
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-center py-8">
              No listings found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ToggleUserData;