import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

export const addProduct = async (req, res, next) => {
  try {
    const { productname, userId, district, province, town } = req.body;
    if (!req.user.role === "farmer") {
      return next(errorHandler(403, "You are not allowed to add product"));
    }
    if (
      !req.body.productname ||
      !req.body.unit ||
      !req.body.category ||
      !req.body.price ||
      !req.body.quantity
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const newProduct = new Product({
      ...req.body,
      productname,
      userId,
      province,
      district,
      town,
    });
    const savedProduct = await newProduct.save();
    const productSlug = `${productname
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "")}-${savedProduct._id}`;

    savedProduct.productSlug = productSlug;
    const updatedProduct = await savedProduct.save();

    res.status(201).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

//get product dashboard
export const getProducts = async (req, res, next) => {
  try {
    const {
      productSlug,
      searchTerm,
      page = 1,
      limit = 8,
      category,
      price,
      userId, // Added userId
    } = req.query;
    
    const queryOptions = {};

    if (userId) {
      queryOptions.userId = userId; // Filter by userId
    }

    if (productSlug) {
      queryOptions.productSlug = productSlug;
    }

    if (searchTerm) {
      queryOptions.productname = { $regex: searchTerm, $options: "i" };
    }

    if (category) {
      queryOptions.category = category;
    }

    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      queryOptions.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Fetch filtered products
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


export const getProductavgprices = async (req, res, next) => {
  try {
    const { category } = req.query;
    const queryOptions = {};

    if (category) {
      queryOptions.category = category;
    }

    // Calculate average price per district and overall averages
    const [districtPrices, overallAverages] = await Promise.all([
      // District-wise averages
      Product.aggregate([
        { $match: queryOptions },
        {
          $group: {
            _id: { 
              district: "$district",
              productname: "$productname"
            },
            averagePrice: { $avg: "$price" },
            unit: { $first: "$unit" } // Include unit from first matching document
          }
        },
        { $sort: { "_id.district": 1, "_id.productname": 1 } }
      ]),
      
      // Overall product averages
      Product.aggregate([
        { $match: queryOptions },
        {
          $group: {
            _id: "$productname",
            averagePrice: { $avg: "$price" },
            unit: { $first: "$unit" }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    // Transform data for better frontend consumption
    const transformedData = {
      districtPrices: districtPrices.map(item => ({
        district: item._id.district,
        productname: item._id.productname,
        averagePrice: item.averagePrice,
        unit: item.unit || 'per kg'
      })),
      averagePrices: overallAverages.map(item => ({
        productname: item._id,
        averagePrice: item.averagePrice,
        unit: item.unit || 'per kg'
      }))
    };

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error in getProductavgprices:', error);
    next(error);
  }
};

//get product into product listing page
export const getProductListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let category = req.query.category;

    if (!category || category === "all") {
      category = { $in: ["vegetables", "fruits", "grains", "other"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const products = await Product.find({
      productname: { $regex: searchTerm, $options: "i" },
      category,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
      

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const products = await Product.findById(req.params.id);
    if (!products) {
      return next(errorHandler(404, "No product not found"));
    }
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the farmer who created the product
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this product" });
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
    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json("The product has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.params.id }).populate(
      "farmer",
      "name email phone"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
