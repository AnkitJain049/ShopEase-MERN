import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import { useSearchParams } from "react-router-dom";
import Notification from "../components/Notification";

function Landing() {
  const [view, setView] = useState(null); // 'login' | 'register' | null
  const [searchParams] = useSearchParams();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const message = searchParams.get('message');
    const status = searchParams.get('status');
    
    if (message) {
      setNotification({ message, type: status === 'success' ? 'success' : 'error' });
    }
  }, [searchParams]);

  const clearNotification = () => setNotification(null);

  const handleToggle = (type) => {
    setView((prev) => (prev === type ? null : type)); // toggle if same, else switch
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-500 px-4 py-10">
      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
      {/* Title + Buttons */}
      <div
        className={`flex flex-col items-center space-y-6 transition-all duration-500 ${
          view ? "mb-4" : "mb-16"
        }`}
      >
        <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white transition-all duration-500">
          SHOPEASE
        </h1>

        <div className="flex space-x-4">
          <button
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ${
              view === "login" ? "scale-105" : "scale-100"
            }`}
            onClick={() => handleToggle("login")}
          >
            Login
          </button>
          <button
            className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all ${
              view === "register" ? "scale-105" : "scale-100"
            }`}
            onClick={() => handleToggle("register")}
          >
            Register
          </button>
        </div>
      </div>

      {/* Form container */}
      <div
        className={`w-full max-w-md transition-all duration-500 transform ${
          view ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        }`}
      >
        {view === "login" && <Login onBack={() => setView(null)} />}
        {view === "register" && <Register onBack={() => setView(null)} />}
      </div>
    </div>
  );
}

export default Landing;
