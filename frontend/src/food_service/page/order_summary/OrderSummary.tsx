import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";
import { GetPromotions } from "../../../promotion/service/htpps/PromotionAPI"; // Assuming you have this service
import "./OrderSummary.css";

const OrderSummary: React.FC<{ subtotal: number }> = ({ subtotal }) => {
  const { filteredOrderDetails } = useOrder(); // Access Context
  const [promoCode, setPromoCode] = useState(""); // State to handle promo code input
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null); // State to handle discounted total
  const [promotions, setPromotions] = useState<any[]>([]); // State to store fetched promotions
  const [promoError, setPromoError] = useState<string>(""); // State to handle error messages
  const [promotionId, setPromotionId] = useState<number | null>(null); // State to store selected promotion ID

  const vatRate = 0.07; // 7% VAT
  const numericSubtotal = Number(subtotal) || 0;
  const vat = numericSubtotal * vatRate;

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
    setPromoError(""); // Clear error when user types
  };

  const recalculateTotal = (promotion: any) => {
    let newDiscountedTotal = numericSubtotal + vat;

    // Apply discount
    if (promotion.discount_id === 1) {
      // Percentage discount
      newDiscountedTotal -= (promotion.discount / 100) * newDiscountedTotal;
    } else if (promotion.discount_id === 2) {
      // Fixed amount discount
      newDiscountedTotal -= promotion.discount;
    }

    // Check limit_discount for percentage discount (DiscountID = 1)
    if (promotion.discount_id === 1 && promotion.limit_discount) {
      newDiscountedTotal = Math.max(
        newDiscountedTotal,
        numericSubtotal + vat - promotion.limit_discount
      );
    }

    // Check if discount exceeds the total
    if (newDiscountedTotal < 0) {
      setPromoError("The discount cannot exceed the total amount.");
      return;
    }

    setDiscountedTotal(newDiscountedTotal);

    // Save both discountAmount and promotionId to localStorage
    const discountAmount = numericSubtotal + vat - newDiscountedTotal;
    localStorage.setItem(
      'promoData',
      JSON.stringify({ discountAmount: discountAmount.toFixed(2), promotionId: promotion.ID })
    );
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode) {
      setPromoError("Please enter a promo code.");
      return;
    }

    const promotion = promotions.find((p) => p.code === promoCode);
    if (!promotion) {
      setPromoError("Invalid promo code.");
      return;
    }

    // Check if TypeID = 2
    if (promotion.type_id !== 2) {
      setPromoError("This promotion is not applicable.");
      return;
    }

    // Check if StatusID = 1 (Active)
    if (promotion.status_id !== 1) {
      setPromoError("This promotion is no longer active.");
      return;
    }

    // Check if minimum_price > subtotal
    if (numericSubtotal + vat < promotion.minimum_price) {
      setPromoError(`Minimum order amount is ฿ ${promotion.minimum_price}`);
      return;
    }

    // Save promotion ID
    setPromotionId(promotion.ID);

    recalculateTotal(promotion); // Recalculate the total based on the promotion
    setPromoError(""); // Reset any errors
  };

  const total = discountedTotal !== null ? discountedTotal : numericSubtotal + vat;

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(Number(price));

  useEffect(() => {
    // Fetch promotions when component mounts
    const fetchPromotions = async () => {
      const res = await GetPromotions();
      if (res.status === 200) {
        setPromotions(res.data);
      } else {
        setPromoError("Failed to load promotions.");
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    // Reset promo code if order details change
    if (filteredOrderDetails.length > 0) {
      setPromoCode(""); // Reset promo code input
      setPromoError(""); // Reset any promo errors
      setDiscountedTotal(null); // Reset discounted total
    }
  }, [filteredOrderDetails]);

  return (
    <>
      <aside className="order-summary-container">
        <section className="order-summary-promotion-container">
          <header>
            <h1>Discount</h1>
          </header>
          <div className="promotion">
            <p>Promotion code</p>
            <div className="promotion-content">
              <input
                type="text"
                value={promoCode}
                onChange={handlePromoCodeChange}
                placeholder="Enter promo code"
              />
              <button onClick={handleApplyPromoCode}>Apply</button>
            </div>
            {promoError && <p className="error-message">{promoError}</p>}
          </div>
        </section>
        <section className="order-summary">
          <header>
            <h1>Order Summary</h1>
          </header>
          <div className="order-summary-content">
            <div className="order-summary-detail">
              <div className="order-summary-subtotal">
                <p>Subtotal</p>
                <p>฿ {formatPrice(numericSubtotal.toFixed(2))}</p>
              </div>
              <div className="order-summary-vat">
                <p>VAT (7%)</p>
                <p>฿ {formatPrice(vat.toFixed(2))}</p>
              </div>
              <div className="order-summary-promotion">
                <p>Promotion</p>
                <p>
                  ฿ -{" "}
                  {discountedTotal !== null
                    ? formatPrice((numericSubtotal + vat - discountedTotal).toFixed(2))
                    : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </section>
        <hr />
        <section className="order-summary-footer">
          <div className="order-summary-total">
            <h2>Total</h2>
            <h2>฿ {formatPrice(total.toFixed(2))}</h2>
          </div>
          <Link
            to={"/login/food-service/order-summary/checkout"}
            state={{
              total: total,
              promotionId: promotionId, // Pass the promotionId here
              discountAmount: discountedTotal !== null ? numericSubtotal + vat - discountedTotal : 0, // ส่งส่วนลด
            }}
          >
            <button
              className={`checkout-button${filteredOrderDetails.length > 0 ? "" : " disabled"}`}
              disabled={filteredOrderDetails.length === 0}
            >
              Confirm Payment
            </button>
          </Link>
        </section>
      </aside>
    </>
  );
};

export default OrderSummary;
