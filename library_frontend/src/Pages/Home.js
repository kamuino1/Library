import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Grid, Image } from "semantic-ui-react";
import Footer from "../Components/Footer";
import "./Home.css";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [books, setAllBooks] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getallBooks = async () => {
      try {
        const response = await axios.get(API_URL + "api/books/allbooks");
        console.log(response.data);
        setAllBooks(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getallBooks();
  }, [API_URL]);

  return (
    <div className="home-container">
      {" "}
      {/* Sử dụng class từ CSS */}
      <div className="content-container">
        {isLoading ? (
          <div>Đang tải sách...</div>
        ) : (
          <Grid container stackable columns={3}>
            {books.map((book) => (
              <Grid.Column key={book._id}>
                <Card>
                  <Image
                    src={book.photo_url || "https://via.placeholder.com/150"}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header>{book.bookName}</Card.Header>
                    <Card.Meta>
                      <span className="date">{book.author}</span>
                    </Card.Meta>
                    <Card.Description>
                      <strong>Publisher:</strong>{" "}
                      {book.publisher || "Chưa có nhà xuất bản"}
                    </Card.Description>
                    <Card.Description>
                      <strong>Available:</strong> {book.bookCountAvailable}{" "}
                      copy(s)
                    </Card.Description>
                    <Card.Description>
                      <strong>Categories:</strong>{" "}
                      {book.categories && book.categories.length > 0
                        ? book.categories
                            .map((category) => category.categoryName)
                            .join(", ")
                        : "Chưa có thể loại"}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
}

export default Home;
