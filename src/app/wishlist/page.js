"use client";
import React, { useState, useEffect } from 'react';
import axiosInstance from '../Components/axiosInstance';
import TopBar from '../Components/Header/topBar';
import SideNav from '../Components/SideNav/sideNav';
import Footer from '../Components/Footer/footer';
import { Container, Box, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import Cookies from 'js-cookie';
import '../../styles/styles.scss';
import Link from 'next/link';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ScrollTopButton from '../Components/scrollToTop';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const token = Cookies.get('token') || null;
  const username = Cookies.get('username') || null;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    axiosInstance.get(`get-wishlist?username=${username}`, { headers })
      .then(response => {
        setWishlistItems(response.data.wishlist);
      })
      .catch(error => {
        console.error('Error fetching wishlist items:', error);
      });
  }, [username, token]);

  const handleRemove = (productId) => {
    axiosInstance.post(`delete-wishlistitem?username=${username}`, { product_id: productId }, { headers })
      .then(response => {
        setWishlistItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      })
      .catch(error => {
        console.error('Error removing item from wishlist:', error);
      });
  };

  return (
    <Container className="container">
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <SideNav />
        <Box sx={{ flexGrow: 1, padding: '20px' }}>
          <div className='wishlist-content'>
            <h1>My WishList</h1>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Product Image</TableCell>
                    <TableCell align="center">Product Name</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Stock Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wishlistItems?.map(item => (
                    <TableRow key={item.product_id}>
                      <TableCell>
                        <img src={item.product_thumbnail} alt={item.product_slug} style={{ width: 100 }} />
                      </TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.inStock ? 'In Stock' : 'Out of Stock'}</TableCell>
                      <TableCell>
                        <div className='flex gap-2'>
                          <Link href={`/product/${item.product_slug}`} className="cart-button">
                            <ShoppingCartOutlinedIcon style={{ fontSize: '1.3rem', marginRight: '0.5rem' }} />View Options
                          </Link>
                          <button onClick={() => handleRemove(item.product_id)} className='remove-button'><DeleteOutlineOutlinedIcon /></button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
