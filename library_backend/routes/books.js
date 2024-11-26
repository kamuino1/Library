import express from "express";
import Book from "../models/Book.js";
import BookCategory from "../models/BookCategory.js";
const router = express.Router();

/* Lấy tất cả các sách */
router.get("/allbooks", async (req, res) => {
  try {
    const books = await Book.find({})
      .populate("transactions")
      .sort({ _id: -1 });
    res.status(200).json(books);
  } catch (err) {
    return res
      .status(504)
      .json({ error: "Failed to fetch books", details: err });
  }
});

/* Lấy sách theo ID */
router.get("/getbook/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("transactions");
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch book", details: err });
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
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(categoryData);
  } catch (err) {
    return res
      .status(504)
      .json({ error: "Failed to fetch category", details: err });
  }
});

/* Thêm sách mới */
router.post("/addbook", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const newBook = new Book({
        bookName: req.body.bookName,
        alternateTitle: req.body.alternateTitle,
        author: req.body.author,
        bookCountAvailable: req.body.bookCountAvailable,
        language: req.body.language,
        publisher: req.body.publisher,
        bookStatus: req.body.bookStatus, // Đã sửa lỗi chính tả
        categories: req.body.categories,
      });
      const book = await newBook.save();
      await BookCategory.updateMany(
        { _id: { $in: book.categories } },
        { $push: { books: book._id } }
      );
      res.status(200).json(book);
    } catch (err) {
      res.status(504).json({ error: "Failed to add book", details: err });
    }
  } else {
    return res
      .status(403)
      .json({ error: "You don't have permission to add a book!" });
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
        return res.status(404).json({ error: "Book not found" });
      }
      res
        .status(200)
        .json({ message: "Book details updated successfully", book });
    } catch (err) {
      res.status(504).json({ error: "Failed to update book", details: err });
    }
  } else {
    return res
      .status(403)
      .json({ error: "You don't have permission to update this book!" });
  }
});

/* Xóa sách */
router.delete("/removebook/:id", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      await book.remove();
      await BookCategory.updateMany(
        { _id: { $in: book.categories } },
        { $pull: { books: book._id } }
      );
      res.status(200).json({ message: "Book has been deleted" });
    } catch (err) {
      return res
        .status(504)
        .json({ error: "Failed to delete book", details: err });
    }
  } else {
    return res
      .status(403)
      .json({ error: "You don't have permission to delete this book!" });
  }
});

export default router;
