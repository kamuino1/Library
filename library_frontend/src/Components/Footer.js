import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Grid, Image } from "semantic-ui-react";
import Footer from "../Components/Footer";

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
    <div id="home">
      <div className="container mt-5">
        {isLoading ? (
          <div>Đang tải sách...</div>
        ) : (
          <Grid container stackable columns={3}>
            {books.map((book) => (
              <Grid.Column key={book._id}>
                <Card>
                  <Image
                    src={book.image || "https://via.placeholder.com/150"} // Ảnh mặc định nếu không có ảnh
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
      <Footer />
    </div>
  );
}

export default Home;
