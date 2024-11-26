import express from "express";
import BookCategory from "../models/BookCategory.js";

const router = express.Router();

/* Lấy tất cả danh mục */
router.get("/allcategories", async (req, res) => {
  try {
    const categories = await BookCategory.find({});
    res.status(200).json(categories);
  } catch (err) {
    return res
      .status(504)
      .json({ error: "Failed to fetch categories", details: err });
  }
});

/* Thêm danh mục mới */
router.post("/addcategory", async (req, res) => {
  try {
    const newCategory = new BookCategory({
      categoryName: req.body.categoryName,
    });

    const category = await newCategory.save();
    res.status(200).json(category);
  } catch (err) {
    return res
      .status(504)
      .json({ error: "Failed to add category", details: err });
  }
});

export default router;
