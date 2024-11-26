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
      .json({ error: "Lỗi lấy tất cả danh mục", details: err });
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
    return res.status(504).json({ error: "Lỗi thêm danh mục", details: err });
  }
});

/* xóa category */
router.post("/deletecategory/:id", async (req, res) => {
  try {
    const category = await BookCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Danh mục không tìm thấy" });
    }

    await BookCategory.findByIdAndDelete(req.params.id);
    res.status(200).json("Danh mục đã xóa");
  } catch (err) {
    return res.status(403).json({ error: "Lỗi xóa danh mục", details: err });
  }
});

/* cập nhật category */
router.post("/updatecategory/:id", async (req, res) => {
  try {
    await BookCategory.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Danh mục đã cập nhật");
  } catch (err) {
    return res
      .status(403)
      .json({ error: "Lỗi cập nhật danh mục", details: err });
  }
});

export default router;
