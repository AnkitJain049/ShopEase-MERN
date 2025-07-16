import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-screen-xl mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row md:justify-between items-center">

        {/* Logo */}
        <Link to="/products" className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          SHOPEASE
        </Link>

        {/* Links */}
        <ul className="flex flex-wrap justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <li><Link to="#" className="hover:underline">About</Link></li>
          <li><Link to="#" className="hover:underline">Privacy Policy</Link></li>
          <li><Link to="#" className="hover:underline">Licensing</Link></li>
          <li><Link to="#" className="hover:underline">Contact</Link></li>
        </ul>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-gray-300 dark:border-gray-700 text-center py-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 <Link to="/products" className="hover:underline">SHOPEASE</Link>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
