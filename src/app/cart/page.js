"use client";
import React from "react";
import TopBar from "../Components/Header/topBar";
import { Container, Box } from "@mui/material";
import Footer from "../Components/Footer/footer";
import Cart from "./cart";
import ScrollTopButton from "../Components/scrollToTop";

export default function Page() {
  return (
    <Container className="container">
      <TopBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Cart />
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
