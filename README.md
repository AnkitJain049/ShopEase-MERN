# ShopEase - MERN Stack E-commerce Application

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, product management, payment processing, and an AI-powered chatbot.

## 🚀 Features

- **User Authentication**: Secure login/register with session management
- **Product Management**: Add, edit, delete products with image uploads
- **Shopping Experience**: Browse products, add to wishlist, view details
- **Payment Integration**: Razorpay payment gateway integration
- **Review System**: Product reviews and ratings
- **AI Chatbot**: Intelligent customer support chatbot
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Search & Filter**: Advanced product search and filtering
- **Order Management**: Complete order history and tracking

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication
- **Multer** - File uploads
- **Razorpay** - Payment processing
- **Google AI** - Chatbot integration

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnkitJain049/ShopEase-MERN.git
   cd ShopEase-MERN
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CHATBOT_URL=your_chatbot_api_url
   ```

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure the following settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (deploy from root)

### Frontend Deployment (Vercel/Netlify)

1. Connect your GitHub repository
2. Configure build settings:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/shopease
SESSION_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CHATBOT_URL=your_chatbot_api_url
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/search/:query` - Search products

### Payments
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Ankit Jain**
- GitHub: [@AnkitJain049](https://github.com/AnkitJain049)
- LinkedIn: [Ankit Jain](https://www.linkedin.com/in/ankitjain-bpit/)
- Email: ankitjain.0142@gmail.com

## 🙏 Acknowledgments

- Razorpay for payment integration
- Google AI for chatbot capabilities
- MongoDB Atlas for database hosting
- Render for backend hosting
- Vercel for frontend hosting 