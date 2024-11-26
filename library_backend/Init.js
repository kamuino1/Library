import mongoose from "mongoose";
import User from "./models/User.js"; // Đảm bảo đường dẫn tới model User chính xác
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import BookCategory from "./models/BookCategory.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MONGODB CONNECTED"))
  .catch((error) => console.error("MONGODB CONNECTION ERROR:", error));

async function deleteAllUsers() {
  try {
    await User.deleteMany({});
    console.log("All user records deleted!");
  } catch (err) {
    console.error("Error deleting user records:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Hàm tạo user mới
async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash("admina", 10);
    const user = new User({
      userType: "admin",
      employeeId: "admin",
      userFullName: "admin",
      email: "admin1@example.com",
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
      isAdmin: true,
    });

    const savedUser = await user.save();
    console.log("User created:", savedUser);
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    mongoose.connection.close(); // Đóng kết nối sau khi hoàn tất
  }
}

/* Thêm danh mục mới */
async function addCate() {
  try {
    const newCategory = new BookCategory({
      categoryName: "Chính kịch",
    });

    const category = await newCategory.save();
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    mongoose.connection.close(); // Đóng kết nối sau khi hoàn tất
  }
}

// Gọi hàm để tạo user
addCate();
