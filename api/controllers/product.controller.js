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
    } = req.query;
    const queryOptions = {};

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

    // Calculate average price per district
    const averagePrices = await Product.aggregate([
      { $match: queryOptions }, // Apply filters
      {
        $group: {
          _id: { district: "$district", productname: "$productname" },
          averagePrice: { $avg: "$price" }, 
        },
      },
      { $sort: { "_id.district": 1, "_id.productname": 1 } }, 
    ]);

    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
      averagePrices, // Send average prices per district
    });
    console.log(averagePrices);
  } catch (error) {
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
