import Product from '../models/product.model.js'

export const addProduct = async (req, res, next) => {
    try {
      if (!req.user.role==="farmer") {
        return next(errorHandler(403, 'You are not allowed to add product'));
      }
      if (!req.body.productname || !req.body.unit || !req.body.category || !req.body.price || !req.body.quantity) {
        return next(errorHandler(400, 'Please provide all required fields'));
      }
  
      const productSlug = req.body.productname.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
      const newProduct = new Product({
        ...req.body,
        productSlug,
        farmer: req.user._id

      });
  
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      next(error);
    }
  }
  export const getProducts = async (req, res, next) => {
    try {
      const { productSlug, searchTerm, page = 1, limit = 9, category, priceRange } = req.query;
      const queryOptions = {};
  
      if (productSlug) {
        queryOptions.productSlug = productSlug;
      }
  
      if (searchTerm) {
        queryOptions.title = { $regex: searchTerm, $options: 'i' };
      }
  
      if (category) {
        queryOptions.category = category;
      }
  
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        queryOptions.price = { $gte: minPrice, $lte: maxPrice };
      }
  
      const totalProducts = await Product.countDocuments(queryOptions);
      const products = await Product.find(queryOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      res.status(200).json({
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      next(error);
    }
  };


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('farmer', 'name email phone');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user is the farmer who created the product
        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this product' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user is the farmer who created the product
        if (product.farmer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this product' });
        }

        await product.remove();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getFarmerProducts = async (req, res) => {
    try {
        const products = await Product.find({ farmer: req.params.id })
            .populate('farmer', 'name email phone');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};