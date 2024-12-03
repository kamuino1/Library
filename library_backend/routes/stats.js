import express from "express";
import mongoose from "mongoose";
import BookTransaction from "../models/BookTransaction.js";
import User from "../models/User.js";
import Book from "../models/Book.js";

const router = express.Router();

router.get("/list-most-borrowed-books", async (req, res) => {
  try {
    const mostBorrowedBooks = await BookTransaction.aggregate([
      {
        $match: { transactionType: "Issued" },
      },
      {
        $group: {
          _id: "$bookId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const booksWithDetails = await Promise.all(
      mostBorrowedBooks.map(async (book) => {
        const bookDetails = await Book.findById(book._id);
        return {
          bookId: book._id,
          bookName: bookDetails ? bookDetails.bookName : "Unknown",
          borrowCount: book.count,
        };
      })
    );

    res.status(200).json(booksWithDetails);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi khi thống kê các đầu sách được mượn nhiều nhất" });
  }
});

router.get("/list-most-active-users", async (req, res) => {
  try {
    const mostActiveUsers = await BookTransaction.aggregate([
      {
        $match: { transactionType: "Issued" },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const usersWithDetails = await Promise.all(
      mostActiveUsers.map(async (user) => {
        const userDetails = await User.findById(
          mongoose.Types.ObjectId(user._id)
        );
        return {
          userId: user._id,
          username: userDetails.username,
          borrowCount: user.count,
        };
      })
    );

    res.status(200).json(usersWithDetails);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi khi thống kê danh sách người mượn nhiều sách nhất" });
  }
});

export default router;
