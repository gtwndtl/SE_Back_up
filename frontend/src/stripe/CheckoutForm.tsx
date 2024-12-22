import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useOrder } from "../food_service/context/OrderContext";
// import { Link } from "react-router-dom";
// import { IoChevronBackSharp } from "react-icons/io5";
import "./CheckoutForm.css"
import Spinner from "../components/spinner";
import { useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";


interface CheckoutFormProps {
  dpmCheckerLink: string;
  total: number;
}

export default function CheckoutForm({ dpmCheckerLink, total }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  // const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { filteredOrderDetails } = useOrder();
  // const location = useLocation();
  // const { dpmCheckerLink } = location.state || {};

  // console.log("CheckoutForm")


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:5173/login/food-service/order/order-summary/checkout/complete",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    
    setIsLoading(false);
    // navigate("/login/food-service/order/order-summary/checkout/complete", {state: { foodServicePaymentID: foodServicePaymentID }});
  };

  const paymentElementOptions = {
    layout: "accordion"
  }

  return (
    <>
      <form className="payment-form" id="payment-form" onSubmit={handleSubmit}>
        <div className="payment-form-order">
          <div className="total-price">
            <p>Total Price (VAT & Promo Code)</p>
            <h1>{total.toFixed(2)}</h1>
            <hr />
          </div>
          <div className="payment-form-order-detail-container">
            <table className="table-payment-form-order-detail">
              <thead>
                <tr>
                  <th style={{textAlign:"left"}}>Menu Name</th>
                  <th >Quantity</th>
                  <th >Unit Price</th>
                  <th >Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrderDetails.map((item) => {
                  return (
                    <tr key={item.ID}>
                      <td className="menu-name">{item.Menu?.MenuName}</td>
                      <td className="quantity">{item.Quantity}</td>
                      <td className="unit-price">{(item.Amount / item.Quantity).toFixed(2)}</td>
                      <td className="amount">{item.Amount.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="payment-form-input">
          <PaymentElement id="payment-element" options={paymentElementOptions} />
          <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? <Spinner/> : "Checkout"}
            </span>
          </button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </div>
      </form>
      [DEV]: Display dynamic payment methods annotation and integration checker
      <div id="dpm-annotation">
        <p>
          Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp;
          <a href={dpmCheckerLink} target="_blank" rel="noopener noreferrer" id="dpm-integration-checker">Preview payment methods by transaction</a>
        </p>
      </div>
    </>
  );
}