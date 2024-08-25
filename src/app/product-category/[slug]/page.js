"use client";
import React, { useState, useEffect } from "react";
import TopBar from "../../Components/Header/topBar";
import { Container, Box } from "@mui/material";
import SideNav from "../../Components/SideNav/sideNav";
import Footer from "../../Components/Footer/footer";
import ShoppingCardContainer from "../../Components/shoppingCardContainer";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import Link from "next/link";
import "../../../styles/styles.scss";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useGetCategoryDataQuery, useGetSearchProductDataQuery } from "@/redux/features/product/productApi";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollTopButton from "@/app/Components/scrollToTop";

export default function ProductDetails({ params }) {
  const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageCount = searchParams.get("page");
  const perPageCount = searchParams.get("perPage");
  const sort = searchParams.get("sort");
  const initialPage = pageCount ? parseInt(pageCount, 10) : 1;
  const initialShowBy = perPageCount ? parseInt(perPageCount, 10) : 20;
  const initialSort = sort || "latest";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState(initialSort);
  const [showBy, setShowBy] = useState(initialShowBy);

  const [searchVal, setSearcVal] = useState('');
  const [loading, setLoading] = useState(false);
  const slug = params.slug;
  const [noProductsMessage, setNoProductsMessage] = useState(false);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (searchVal) {
      router.push(`/allproducts/${searchVal}?page=${value}&perPage=${showBy}&sort=${sortBy}`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/product-category/${params?.slug}?page=${value}&perPage=${showBy}&sort=${sortBy}`, undefined, {
        shallow: true,
      });
    }
  };

  const transformSlug = (slug) => {
    return slug.replace(/-/g, " ").toUpperCase();
  };

  const products1 = useGetCategoryDataQuery({
    params: params.slug,
    page: currentPage,
    count: showBy,
    sort: sortBy
  });
  const [categoryData, setCategoryData] = useState(null);

  const search_results = useGetSearchProductDataQuery({ params: searchVal, page: currentPage, count: showBy, sort: sortBy });

  useEffect(() => {
    if (searchVal) {
      if (search_results?.status === "pending") {
        setLoading(true);
      } else {
        setLoading(false);
        if (search_results?.status === "fulfilled") {
          setCategoryData(search_results?.data?.products?.data);
          setTotalPages(search_results?.data?.products?.last_page);
          setNoProductsMessage(search_results?.data?.products?.data.length === 0);
        } else {
          setCategoryData([]);
        }
      }
    } else {
      if (products1?.isSuccess) {
        setLoading(false);
        setCategoryData(products1?.data?.data);
        setTotalPages(products1?.data?.last_page);
        setNoProductsMessage(products1?.data?.data.length === 0);
        
      } else {
        setLoading(true);
        setCategoryData([]);
      }
    }
  }, [search_results, searchVal, products1]);

  useEffect(() => {
    if (pageCount) {
      setCurrentPage(parseInt(pageCount, 10));
    }
  }, [pageCount]);

  const renderShimmerEffect = () => (
    <div className="shopping-cards-container grid-container">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="shopping-card shimmer-card flex flex-col">
          <div className="shimmer shimmer-image"></div>
          <div className="shimmer shimmer-title"></div>
          <div className="shimmer shimmer-price"></div>
          <div className="shimmer shimmer-button"></div>
        </div>
      ))}
    </div>
  );

  return (
    <Container className="container">
      <TopBar setSearcVal={setSearcVal} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center", 
          minHeight: "80vh", 
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            padding: "20px",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          <div className="top-content">
            <Link href={"/"}>
              <HomeOutlinedIcon style={{ color: "#777" }} />
            </Link>
            <ChevronRightOutlinedIcon style={{ color: "#777" }} />
            <Link href={"/new-arrival"} className="tab-names">
              SHOP
            </Link>
            <ChevronRightOutlinedIcon style={{ color: "#777" }} />
            <span className="tab-names">
              {searchVal ? searchVal : transformSlug(params.slug)}
            </span>
          </div>

          {loading ? (
            renderShimmerEffect()
          ) : categoryData ? (
            <ShoppingCardContainer products={categoryData} sortBy={sortBy} showBy={showBy} setSortBy={setSortBy} setShowBy={setShowBy} searchVal={searchVal} currentPage={currentPage} slug={slug} noProductsMessage={noProductsMessage}/>
          ) : (
            <p>Loading products...</p>
          )}

          <Stack spacing={2} mt={4} alignItems="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
