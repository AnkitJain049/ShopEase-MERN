import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Card from "../components/Card";
import useFetch from "../hooks/useFetch";
import { useSearchParams } from "react-router-dom";
import Notification from "../components/Notification";
import Chatbot from "../components/Chatbot";

function Home() {
  const { data } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // State for notification
  const [notification, setNotification] = useState(null);

  // Check for URL parameters on component mount
  useEffect(() => {
    const message = searchParams.get('message');
    const status = searchParams.get('status');
    
    if (message) {
      setNotification({ message, type: 'success' });
    } else if (status) {
      setNotification({ message: status, type: 'success' });
    }
  }, [searchParams]);

  // Check for search results from navigation state
  useEffect(() => {
    if (location.state?.searchResults) {
      setFilteredData(location.state.searchResults);
      setIsSearchMode(true);
      setSearchQuery(location.state.searchQuery || "");
      // Clear the state to prevent showing search results on refresh
      window.history.replaceState({}, document.title);
    } else {
      setIsSearchMode(false);
      setSearchQuery("");
    }
  }, [location.state]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (!isSearchMode && Array.isArray(data)) {
      setFilteredData(data);
    }
  }, [data, isSearchMode]);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const applyFilter = () => {
    let baseData = isSearchMode ? location.state?.searchResults || [] : data || [];
    
    if ((minPrice === "" || minPrice === "0") && (maxPrice === "" || maxPrice === "0")) {
      setFilteredData(baseData); // Show all
    } else {
      let result = [...baseData];
      if (minPrice !== "") result = result.filter((p) => p.price >= parseFloat(minPrice));
      if (maxPrice !== "") result = result.filter((p) => p.price <= parseFloat(maxPrice));
      setFilteredData(result);
    }
    setShowFilter(false);
  };

  const applySort = (order) => {
    if (order) {
      const sorted = [...filteredData].sort((a, b) =>
        order === "asc" ? a.price - b.price : b.price - a.price
      );
      setFilteredData(sorted);
    }
    setShowSort(false);
  };

  const clearSearch = () => {
    setIsSearchMode(false);
    setSearchQuery("");
    setFilteredData(data || []);
  };

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-700 p-4 pt-20 relative">
      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      <Navbar />

      {/* Search Results Header */}
      {isSearchMode && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Found {filteredData.length} product{filteredData.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Clear Search
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-3xl font-bold text-white m-4 md:px-6 lg:px-30">Products</div>

      {/* Filter + Sort Area (wrapped in relative container) */}
      <div className="m-4 md:px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex justify-between items-center">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2 ml-22">
            <label className="text-white text-sm">Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 bg-gray-800 text-white border border-gray-600 rounded text-sm"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={20}>20</option>
            </select>
            <span className="text-white text-sm">per page</span>
          </div>

          {/* Filter and Sort buttons */}
          <div className="flex space-x-4 mr-22">
            <button
              className="px-6 py-2 font-medium text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-500"
              onClick={() => {
                setShowFilter(!showFilter);
                setShowSort(false);
              }}
            >
              Filter
            </button>
            <button
              className="px-6 py-2 font-medium text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-500"
              onClick={() => {
                setShowSort(!showSort);
                setShowFilter(false);
              }}
            >
              Sort
            </button>
          </div>
        </div>

        {/* Floating Filter Box */}
        {showFilter && (
          <div className="absolute top-12 right-24 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-64 z-50 border border-gray-300 dark:border-gray-700">
            <h2 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">
              Filter by Price
            </h2>
            <input
              type="number"
              placeholder="Min Price"
              className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowFilter(false)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 text-black dark:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={applyFilter}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Floating Sort Box */}
        {showSort && (
          <div className="absolute top-12 right-4 bg-white dark:bg-gray-800 p-4 rounded shadow-md w-64 z-50 border border-gray-300 dark:border-gray-700">
            <h2 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">
              Sort by Price
            </h2>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSort(false)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 text-black dark:text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => applySort(sortOrder)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:px-6 lg:px-8 m-4">
        {currentItems.length > 0 ? (
          currentItems.map((product) => <Card key={product._id} product={product} />)
        ) : (
          <div className="text-center py-12 col-span-full">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {isSearchMode ? "No products found for your search" : "No products available"}
            </h3>
            <p className="text-gray-400">
              {isSearchMode ? "Try adjusting your search terms" : "Check back later for new products"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-8 mb-8 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Results info */}
            <div className="text-white text-sm ml-4">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center space-x-2 mr-4">
              {/* Previous button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    disabled={page === '...'}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
}

export default Home;
