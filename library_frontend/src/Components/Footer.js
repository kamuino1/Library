import React from "react";
import { Container, Grid, Segment, Header, List } from "semantic-ui-react";

function Footer() {
  return (
    <Segment inverted vertical style={{ padding: "5em 0" }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as="h4" inverted>
                Contact Us
              </Header>
              <List link inverted>
                <List.Item as="a">Librarian Management</List.Item>
                <List.Item as="a">Pham Anh Tien</List.Item>
                <List.Item as="a">
                  <b>Email:</b> TIENPA.B19CN581@stu.ptit.edu.vn
                </List.Item>
              </List>
            </Grid.Column>

            <Grid.Column width={8}>
              <Header as="h4" inverted>
                Connect With Us
              </Header>
              <List link inverted>
                <List.Item as="a">Facebook</List.Item>
                <List.Item as="a">Instagram</List.Item>
                <List.Item as="a">Twitter</List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Segment inverted vertical style={{ textAlign: "center" }}>
          <p>&#169; 2024 All rights reserved</p>
        </Segment>
      </Container>
    </Segment>
  );
}

export default Footer;
