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
    const hashedPassword = await bcrypt.hash("tien012369", 10);
    const user = new User({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
      isAdmin: true,
    });

    const savedUser = await user.save();
    console.log("User created:", savedUser);
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    setTimeout(() => mongoose.connection.close(), 1000);
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
    setTimeout(() => mongoose.connection.close(), 1000); // Đóng kết nối sau khi hoàn tất
  }
}

async function migrate() {
  try {
    // Thêm trường "isActive" với giá trị mặc định là true
    await User.updateMany({}, { $set: { isActive: true } });
    console.log("Migration completed!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Gọi hàm để tạo user
createUser();
addCate();
