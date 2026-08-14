import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductDetails from "../components/productDetails/ProductDetails";
import { API_BASE } from "../api";

export default function ProductDetailsPage(prop) {
  const {
    wishList,
    setWishList,
    setWishListCount,
    cart,
    setCart,
    setCartCount,
    userData,
    isAuthenticated,
    setSnackBarMessage,
    setOpenSuccessSnackBar,
    setOpenErrorSnackBar,
  } = prop;
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productUrl = `${API_BASE}/Products/${params.productId}`;
  useEffect(() => {
    function getSingleProduct() {
      axios
        .get(productUrl)
        .then((response) => {
          if (response.data === "") {
            setError(response);
            setLoading(false);
          } else {
            setProduct(response.data);
            setLoading(false);
          }
        })
        .catch((response) => {
          setError(response);
          setLoading(false);
        });
    }
    getSingleProduct();
  }, [productUrl]);

  return (
    <div>
      <ProductDetails
        product={product}
        loading={loading}
        error={error}
        wishList={wishList}
        setWishList={setWishList}
        setWishListCount={setWishListCount}
        cart={cart}
        setCart={setCart}
        setCartCount={setCartCount}
        userData={userData}
        isAuthenticated={isAuthenticated}
        setSnackBarMessage={setSnackBarMessage}
        setOpenSuccessSnackBar={setOpenSuccessSnackBar}
        setOpenErrorSnackBar={setOpenErrorSnackBar}
      />
    </div>
  );
}
