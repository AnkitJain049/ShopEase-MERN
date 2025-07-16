import express from 'express';
import Product from '../models/ProductModel.js';
import { isAuthenticated } from '../utils/auth.js';
import { uploadProductImage } from '../utils/imgupload.js';
import { searchProducts } from '../utils/recommendation.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Search products (must come before /:id route)
router.get('/search/:query', async (req, res) => {
  try {
    const result = await searchProducts(req.params.query, req.user?._id);
    
    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', isAuthenticated, uploadProductImage.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      brand,
      sellerId: req.user._id,
      image
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', isAuthenticated, uploadProductImage.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    const updateData = { name, description, price: parseFloat(price), brand };
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router; 