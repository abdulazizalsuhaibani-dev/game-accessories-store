import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OrderForm from "../forms/OrderForm";
import PaymentForm from "../forms/PaymentForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout(prop) {
  const {
    userData,
    setSnackBarMessage,
    setOpenSuccessSnackBar,
    setOpenErrorSnackBar,
    cart,
    setCart,
  } = prop;

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "",
    paymentDate: "",
    paymentStatus: false,
    totalPrice: 0,
    cartId: "00000000-0000-0000-0000-000000000000",
    orderId: "00000000-0000-0000-0000-000000000000",
    couponId: "00000000-0000-0000-0000-000000000000",
  });
  const [orderData, setOrderData] = useState({
    userId: userData.userId,
    cartId: "00000000-0000-0000-0000-000000000000",
    paymentId: "00000000-0000-0000-0000-000000000000",
    address: "",
    city: "",
    state: "",
    postalCode: 0,
    coordinateX: 0,
    coordinateY: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/products");
  };

  function processOrder() {
    // post the cart firstly
    const cartInfo = cart.map((item) => {
      delete item.product;
      return item;
    });
    const cartPost = {
      cartDetails: cartInfo,
      userId: userData.userId,
    };

    // post thr payment secondly
    const currDate = new Date();
    const token = localStorage.getItem("token");
    let paymentPost = paymentData;
    paymentPost.paymentDate = currDate.toISOString();
    paymentPost.paymentStatus = true;

    // lastly post the order
    let orderPost = orderData;

    axios
      .post("https://game-accessories-api.onrender.com/api/v1/Carts", cartPost, {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      })
      .then((response) => {
        paymentPost.cartId = response.data.id;
        paymentPost.totalPrice = response.data.totalPrice;
        axios
          .post(
            "https://game-accessories-api.onrender.com/api/v1/Payments",
            paymentPost,
            {
              headers: {
                Authorization: `Bearer ${token} `,
              },
            }
          )
          .then((response) => {
            orderPost.paymentId = response.data.paymentId;
            orderPost.cartId = response.data.cartId;
            axios
              .post(
                "https://game-accessories-api.onrender.com/api/v1/Orders",
                orderPost,
                {
                  headers: {
                    Authorization: `Bearer ${token} `,
                  },
                }
              )
              .then((response) => {
                localStorage.removeItem("cart");
                localStorage.removeItem("cartId");
                setCart([]);
                setOpenDialog(true);
              })
              .catch((error) => {
                setSnackBarMessage("We could not submit your order");
                setOpenErrorSnackBar(true);
              });
          })
          .catch((error) => {
            setSnackBarMessage("We could not submit your payment");
            setOpenErrorSnackBar(true);
          });
      })
      .catch((error) => {
        setSnackBarMessage("We couldn't submit your cart");
        setOpenErrorSnackBar(true);
      });
  }
  return (
    <div className="font-sans bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 inline-block pb-1">
            Checkout
          </h2>
        </div>

        <div className="mt-12">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-300">01</h3>
              <h3 className="text-xl font-bold text-gray-800 mt-1">
                Personal Details
              </h3>
            </div>

            <div className="md:col-span-2">
              <form>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First name"
                      value={userData.firstName}
                      disabled
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-pink-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={userData.lastName}
                      disabled
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-pink-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={userData.email}
                      disabled
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-pink-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Phone number"
                      value={userData.phoneNumber}
                      disabled
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-pink-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-300">02</h3>
              <h3 className="text-xl font-bold text-gray-800 mt-1">
                Shopping Address
              </h3>
            </div>
            <OrderForm orderData={orderData} setOrderData={setOrderData} />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-300">03</h3>
              <h3 className="text-xl font-bold text-gray-800 mt-1">
                Payment method
              </h3>
            </div>

            <div className="md:col-span-2">
              <PaymentForm
                paymentData={paymentData}
                setPaymentData={setPaymentData}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-4 mt-12">
            <button
              type="button"
              className="px-6 py-3 text-sm font-semibold tracking-wide bg-pink-600 text-white rounded-md hover:bg-pink-700"
              onClick={() => {
                processOrder();
              }}
            >
              Order now
            </button>
          </div>
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Success!</DialogTitle>
        <CheckCircleIcon
          sx={{ margin: "auto" }}
          fontSize="large"
          color="success"
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your order has been placed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
