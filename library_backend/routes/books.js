import express from "express";
import Book from "../models/Book.js";
import BookCategory from "../models/BookCategory.js";
const router = express.Router();

router.get("/allbooks", async (req, res) => {
  try {
    const books = await Book.find({})
      .populate({
        path: "categories",
        select: "categoryName", // Chỉ lấy categoryName từ BookCategory
      })
      .sort({ _id: -1 });
    res.status(200).json(books);
  } catch (err) {
    res.status(504).json({ error: "Lỗi lấy tất cả sách", details: err });
  }
});

/* Lấy sách theo ID */
router.get("/getbook/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("transactions")
      .populate("categories", "categoryName");
    if (!book) {
      return res.status(404).json({ error: "Không tìm thấy sách" });
    }
    res.status(200).json(book);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Lỗi lấy tất cả sách:", details: err });
  }
});

/* Lấy sách theo tên danh mục */
router.get("/", async (req, res) => {
  const category = req.query.category;
  try {
    const categoryData = await BookCategory.findOne({
      categoryName: category,
    }).populate("books");
    if (!categoryData) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }
    res.status(200).json(categoryData);
  } catch (err) {
    return res.status(504).json({ error: "Lỗi lấy danh mục", details: err });
  }
});

/* Thêm sách mới */
router.post("/addbook", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const newBook = new Book({
        bookName: req.body.bookName,
        author: req.body.author,
        bookCountAvailable: req.body.bookCountAvailable,
        language: req.body.language,
        publisher: req.body.publisher,
        photo_url: req.body.photo_url,
        bookStatus: req.body.bookStatus,
        categories: req.body.categories,
      });
      const book = await newBook.save();
      await BookCategory.updateMany(
        { _id: { $in: book.categories } },
        { $push: { books: book._id } }
      );
      res.status(200).json(book);
    } catch (err) {
      res.status(504).json({ error: "Không thể thêm sách", details: err });
    }
  } else {
    return res.status(403).json({ error: "Bạn không có quyền thêm sách!" });
  }
});

/* Cập nhật thông tin sách */
router.put("/updatebook/:id", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!book) {
        return res.status(404).json({ error: "Không tìm thấy sách" });
      }

      await BookCategory.updateMany(
        { _id: { $in: book.categories } },
        { $addToSet: { books: book._id } }
      );

      res
        .status(200)
        .json({ message: "Cập nhật thành công thông tin sách", book });
    } catch (err) {
      res.status(504).json({ error: "Lỗi cập nhật sách", details: err });
    }
  } else {
    return res.status(403).json({ error: "Bạn không có quyền cập nhật sách!" });
  }
});

/* Xóa sách */
router.delete("/removebook/:id", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Không tìm thấy sách" });
      }
      await book.remove();
      await BookCategory.updateMany(
        { _id: { $in: book.categories } },
        { $pull: { books: book._id } }
      );
      res.status(200).json({ message: "Đã xóa sách" });
    } catch (err) {
      return res.status(504).json({ error: "Lỗi xóa sách", details: err });
    }
  } else {
    return res.status(403).json({ error: "Bạn không có quyền xóa sách!" });
  }
});

export default router;
