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

/* xóa category */
router.post("/deletecategory/:id", async (req, res) => {
  try {
    const category = await BookCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }

    await BookCategory.findByIdAndDelete(req.params.id);
    res.status(200).json("category has been deleted");
  } catch (err) {
    return res
      .status(403)
      .json({ error: "Failed to delete category", details: err });
  }
});

/* cập nhật category */
router.post("/updatecategory/:id", async (req, res) => {
  try {
    await BookCategory.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("category has been update");
  } catch (err) {
    return res
      .status(403)
      .json({ error: "Failed to update category", details: err });
  }
});

export default router;
