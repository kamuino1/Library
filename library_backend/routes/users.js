import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/* Lấy thông tin người dùng theo ID */
router.get("/getuser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -updatedAt")
      .populate("activeTransactions")
      .populate("prevTransactions");

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* Lấy tất cả thành viên trong thư viện */
router.get("/allmembers", async (req, res) => {
  try {
    const users = await User.find({})
      .populate("activeTransactions")
      .populate("prevTransactions")
      .sort({ _id: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* Cập nhật thông tin người dùng theo ID */
router.put("/updateuser/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Tài khoản đã được cập nhật");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Bạn chỉ có thể cập nhật tài khoản của bạn!");
  }
});

/* Thêm phiên mượn sách vào danh sách phiên mượn sách đang hoạt động */
router.put("/:id/move-to-activetransactions", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ error: "Không tìm thấy người dùng" });
      }

      await user.updateOne({ $push: { activeTransactions: req.params.id } });
      res.status(200).json("Đã được thêm vào phiên mượn sách");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Chỉ quản trị viên mới được thêm phiên mượn sách");
  }
});

/* Di chuyển phiên mượn sách từ danh sách đang hoạt động sang danh sách đã hoàn thành */
router.put("/:id/move-to-prevtransactions", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await user.updateOne({ $pull: { activeTransactions: req.params.id } });
      await user.updateOne({ $push: { prevTransactions: req.params.id } });
      res.status(200).json("Đã thêm vào phiên mượn sách hoàn thành");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Chỉ quản trị viên được chuyển");
  }
});

/* xóa phiên mượn sách */
router.put("/:id/delete-activetransactions", async (req, res) => {
  if (req.body.isAdmin) {
    try {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await user.updateOne({ $pull: { activeTransactions: req.params.id } });
      res.status(200).json("Đã xóa phiên mượn sách");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Chỉ quản trị viên được xóa");
  }
});

/* Xóa người dùng theo ID */
router.delete("/deleteuser/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "Không tìm thấy người dùng" });
      }

      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Tài khoản đã bị xóa");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Chỉ được xóa tài khoản của bạn!");
  }
});

export default router;
