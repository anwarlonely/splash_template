"use client";
import React, { useState, useEffect, useCallback } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  useGetSearchProductDataQuery,
  useGetSearchProductALLDataQuery,
} from "@/redux/features/product/productApi";
import debounce from "lodash/debounce";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "white",
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  top: "0px",
  right: "0px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "58ch",
    },
  },
  display: "flex",
  alignItems: "center",
}));

const filtersConfig = [
  { name: "Product", label: "Product" },
  { name: "All", label: "All" },
];

export default function SearchBar({ setSearcVal }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    Product: true,
    All: false,
  });
  const [showResults, setShowResults] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const [totalResults, setTotalResults] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAllProductsPage, setIsAllProductsPage] = useState(false);
  const [showBy, setShowBy] = useState("20");
  const [showText, setShowText] = useState(false);
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  // const searchParams = useParams()

  // const searchValued = searchParams.get("perPage")

  console.log("searchQuery", searchQuery);

  const handleClick = () => {
    setShowText(true);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  let search_results;

  if (filters.All) {
    search_results = useGetSearchProductALLDataQuery({
      params: searchQuery,
      page: currentPage,
      count: showBy,
      sort: "latest",
    });
  } else {
    search_results = useGetSearchProductDataQuery({
      params: searchQuery,
      page: currentPage,
      count: showBy,
      sort: "latest",
    });
  }

  console.log("search_results", search_results);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1399) {
        setShowBy("15");
      } else {
        setShowBy("20");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showBy]);

  useEffect(() => {
    if (search_results?.status === "pending") {
      setLoading(true);
    } else {
      setLoading(false);
      if (search_results?.status === "fulfilled") {
        setResults(search_results?.data?.products?.data);
        setTotalResults(search_results?.data?.products?.total);
      } else {
        setResults([]);
      }
    }
  }, [search_results]);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;

    const updatedFilters = { ...filters };
    Object.keys(updatedFilters).forEach((filterName) => {
      updatedFilters[filterName] = filterName === name ? checked : false;
    });

    setFilters(updatedFilters);
  };

  const highlightSearchTerm = (title) => {
    return title?.replace(
      new RegExp(searchQuery, "gi"),
      (match) => `<strong>${match}</strong>`
    );
  };

  const handleShowAll = () => {
    setCurrentPage(1);
  };

  const handleSearchIconClick = () => {
    setShowResults(true);
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        Math.min(prevIndex + 1, results.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
    } else if (e.key === "Enter") {
      if (search_results?.status !== "fulfilled") {
        window.location.href = "#";

        // setTimeout(()=>{
        //   if (focusedIndex >= 0) {
        //     const selectedResult = results[focusedIndex];
        //     if (selectedResult) {
        //       window.location.href = `${frontendURL}/product/${selectedResult.slug}`;
        //     }
        //   } else if(search_results?.status !== "fulfilled") {
        //     window.location.href = `${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest`;
        //   }
        // },4000)
      }else {
        if (focusedIndex >= 0) {
          const selectedResult = results[focusedIndex];
          if (selectedResult) {
            window.location.href = `${frontendURL}/product/${selectedResult.slug}`;
          }
        } else {
          window.location.href = `${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest`;
        }
      }
      // } else {
      //   // window.location.href = searchQuery ? `${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest` : `${frontendURL}`
      //   window.location.href = "#";
      // }
    }
  };

  // Create a debounced version of handleChange using useCallback
  const debouncedHandleChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      if (typeof setSearcVal !== "undefined") {
        setSearcVal(value);
      }
      setShowResults(true);
      setFocusedIndex(-1);
    }, 1000), // 1000ms delay
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;

    console.log("anwarr", value);

    if (value.length > 0) {
      debouncedHandleChange(value);
      if (typeof setSearcVal !== "undefined") {
        setSearcVal(value);
      }
      setShowResults(true);
      setFocusedIndex(-1);
    } else {
      setSearchQuery("");
      if (typeof setSearcVal !== "undefined") {
        setSearcVal("");
      }
      setShowResults(false); // Or adjust based on your need
      setFocusedIndex(-1);
    }
  };

  // const handleChange = debounce((e) => {
  //   const value = e.target.value;
  //   setSearchQuery(value);
  //   if (typeof setSearcVal !== 'undefined') {
  //     setSearcVal(value);
  //   }
  //   setShowResults(true);
  //   setFocusedIndex(-1);
  // }, 1000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAllProductsPage(window.location.pathname.includes("/allproducts"));
    }
  }, []);

  const renderShimmerEffect = () => (
    <div className="shimmer-results">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="shimmer-result">
          <div className="shimmer shimmer-image"></div>
          <div className="shimmer shimmer-text"></div>
        </div>
      ))}
    </div>
  );

  const extractPath = (url) => {
    const pattern = /\/wp-content\/uploads\/\d{4}\/\d{2}\/[^/]+\.[a-z]{3,4}$/i;
    const match = url?.match(pattern);
    return match ? match[0] : null;
  };

  const renderSearchContent = () => (
    <div onMouseLeave={() => setShowResults(false)}>
      <SearchIconWrapper
        onClick={handleSearchIconClick}
        className="search-wrapper"
      >
        <SearchIcon
          className="search-icon-1 "
          style={{
            marginTop: isMobile ? "8px" : "",
          }}
        />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search for products…"
        inputProps={{ "aria-label": "search" }}
        // value={searchQuery}
        className="search-input p-1"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        endAdornment={
          loading ? (
            <CircularProgress size={20} style={{ marginRight: "1rem" }} />
          ) : null
        }
      />
      {showResults && (
        <>
          {loading && !isAllProductsPage && renderShimmerEffect()}
          {searchQuery && !loading && results.length > 0 && (
            <div className={`results ${isAllProductsPage ? "hidden" : ""}`}>
              <div className="title">PRODUCTS</div>
              {results.slice(0, 5).map((result, index) => (
                <Link
                  href={`/product/${result.slug}`}
                  className={`product flex flex-row items-center gap-4 ${
                    focusedIndex === index ? "focused" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`${wordpressURL}/${extractPath(result.thumbnail_url)}`}
                    alt="product-logo"
                    className="product-logo"
                  />
                  <div className="flex flex-col">
                    <div
                      className="product-name"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result?.title),
                      }}
                    ></div>
                    <div className="sku">
                      (SKU:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(
                            result?.meta[0]?.meta_value
                          ),
                        }}
                      ></span>
                      )
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest`}
                onClick={handleShowAll}
                className="product button"
              >
                Show All ({totalResults})
              </Link>
            </div>
          )}
          {!loading && results.length === 0 && searchQuery.length >= 3 && (
            <div className="results">
              <p>No results found</p>

              <FormGroup row>
                {filtersConfig.map((filter) => (
                  <FormControlLabel
                    key={filter.name}
                    control={
                      <Checkbox
                        checked={filters[filter.name]}
                        onChange={handleFilterChange}
                        name={filter.name}
                      />
                    }
                    label={filter.label}
                  />
                ))}
              </FormGroup>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderSearchContent1 = () => (
    <div
      onMouseLeave={() => setShowResults(false)}
      style={{
        paddingRight: "30px",
        width: "276%",
        right: "81px",
        position: "relative",
        top: "64px",
        zIndex: 30,
        paddingLeft: "10px",
        background: "white",
        borderRadius: "20px",
        border: "2px solid #f60;",
      }}
    >
      <SearchIconWrapper
        onClick={handleSearchIconClick}
        className="search-wrapper"
      ></SearchIconWrapper>
      <StyledInputBase
        placeholder="Search for products…"
        inputProps={{ "aria-label": "search" }}
        // value={searchQuery}
        className=" p-1"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        endAdornment={
          loading ? (
            <CircularProgress size={20} style={{ marginRight: "1rem" }} />
          ) : null
        }
      />
      {showResults && (
        <>
          {loading && !isAllProductsPage && renderShimmerEffect()}
          {searchQuery && !loading && results.length > 0 && (
            <div className={`results ${isAllProductsPage ? "hidden" : ""}`}>
              <div className="title">PRODUCTS</div>
              {results.slice(0, 5).map((result, index) => (
                <Link
                  href={`/product/${result.slug}`}
                  className={`product flex flex-row items-center gap-4 ${
                    focusedIndex === index ? "focused" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`${result.thumbnail_url}`}
                    alt="product-logo"
                    className="product-logo"
                  />
                  <div className="flex flex-col">
                    <div
                      className="product-name"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result?.title),
                      }}
                    ></div>
                    <div className="sku">
                      (SKU:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(
                            result?.meta[0]?.meta_value
                          ),
                        }}
                      ></span>
                      )
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest`}
                onClick={handleShowAll}
                className="product button"
              >
                Show All ({totalResults})
              </Link>
            </div>
          )}
          {!loading && results.length === 0 && searchQuery.length >= 3 && (
            <div className="results">
              <p>No results found</p>

              <FormGroup row>
                {filtersConfig.map((filter) => (
                  <FormControlLabel
                    key={filter.name}
                    control={
                      <Checkbox
                        checked={filters[filter.name]}
                        onChange={handleFilterChange}
                        name={filter.name}
                      />
                    }
                    label={filter.label}
                  />
                ))}
              </FormGroup>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="bg-red">
      {isMobile ? (
        <>
          {/* <IconButton >
            <SearchIcon style={{ color: "white" , marginTop:"10px"}} />
          </IconButton> */}
          {/* <Drawer
            
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <div style={{ padding: "16px", width: "100%", }}>
              <IconButton  onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
              <div >
              {renderSearchContent()}
              </div>
            </div>
          </Drawer> */}
          {/* {renderSearchContent()}  */}

          <div>
            {!showText && (
              <IconButton onClick={handleClick}>
                <SearchIcon style={{ color: "white", marginTop: "10px" }} />
              </IconButton>
            )}
            {showText && (
              // <Search
              //   className="searchBar1"
              //   onMouseEnter={() => setShowResults(true)}
              // >
              <>
                <div
                  style={{
                    position: "fixed",
                    top: "89px",
                    left: "215px",
                  }}
                >
                  <IconButton
                    onClick={() => setShowText(false)}
                    style={{ color: "white" }}
                  >
                    <CloseIcon style={{ color: "white" }} />
                  </IconButton>
                </div>
                {renderSearchContent1()}
              </>
              // </Search>
            )}
          </div>
        </>
      ) : (
        <Search className="searchBar" onMouseEnter={() => setShowResults(true)}>
          {renderSearchContent()}
        </Search>
      )}
    </div>
  );
}
