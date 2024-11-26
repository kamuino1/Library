import express from "express";
import Book from "../models/Book.js";
import BookTransaction from "../models/BookTransaction.js";

const router = express.Router();

/* Thêm phiên mượn sách mới */
router.post("/add-transaction", async (req, res) => {
  try {
    if (req.body.isAdmin === true) {
      const newTransaction = new BookTransaction({
        bookId: req.body.bookId,
        borrowerId: req.body.borrowerId,
        bookName: req.body.bookName,
        borrowerName: req.body.borrowerName,
        transactionType: req.body.transactionType,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
      });

      const transaction = await newTransaction.save();
      const book = await Book.findById(req.body.bookId);
      if (book) {
        await book.updateOne({ $push: { transactions: transaction._id } });
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ error: "Không tìm thấy sách" });
      }
    } else {
      res.status(403).json("Bạn thông được phép thêm phiên mượn sách");
    }
  } catch (err) {
    res.status(504).json(err);
  }
});

/* Lấy tất cả phiên mượn sách */
router.get("/all-transactions", async (req, res) => {
  try {
    const transactions = await BookTransaction.find({}).sort({ _id: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(504).json(err);
  }
});

/* Cập nhật thông tin phiên mượn sách */
router.put("/update-transaction/:id", async (req, res) => {
  try {
    if (req.body.isAdmin) {
      await BookTransaction.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("phiên mượn sách cập nhật thành công");
    } else {
      res.status(403).json("Bạn không được phép cập nhật phiên mượn sách");
    }
  } catch (err) {
    res.status(504).json(err);
  }
});

/* Xóa phiên mượn sách */
router.delete("/remove-transaction/:id", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const transaction = await BookTransaction.findByIdAndDelete(
        req.params.id
      );
      if (!transaction) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy phiên mượn sách" });
      }

      const book = await Book.findById(transaction.bookId);
      if (book) {
        await book.updateOne({ $pull: { transactions: req.params.id } });
      }
      res.status(200).json("Phiên mượn sách xóa thành công");
    } catch (err) {
      res.status(504).json(err);
    }
  } else {
    res.status(403).json("Bạn không được phép xóa phiên mượn sách!");
  }
});

export default router;
