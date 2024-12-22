import { useEffect, useRef, useState } from "react";
import { CustomerInterface } from "../../../interfaces/ICustomer";
import { FoodServicePaymentInterface } from "../../interface/IFoodServicePayment";
import { OrderDetailInterface } from "../../../food_service/interface/IOrderDetail";
import { GetOrderDetail } from "../../../food_service/service/https/OrderDetailAPI";
import { GetUsersById } from "../../../services/https";
import { GetFoodServicePaymentById } from "../../service/https/FoodServicePaymentAPI";
import { message } from "antd";
import dayjs from "dayjs";
import LogoCruiseShip from "../../../assets/cruise_ship_logo.jpg";
import "./FoodReceipt.css";
// import Spinner from "../../../components/spinner";
import { MdFileDownload, MdLocalPrintshop } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import Spinner from "../../../components/spinner";
import { useLocation } from "react-router-dom";

function FoodReceipt() {
  const [foodServicePaymentID, setFoodServicePaymentID] = useState<number | null>(null);
  const [foodServicePayment, setFoodServicePayment] = useState<FoodServicePaymentInterface>();
  const [messageApi, contextHolder] = message.useMessage();
  const [customer, setCustomer] = useState<CustomerInterface>();
  const [orderDetail, setOrderDetail] = useState<OrderDetailInterface[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Track if data is loaded

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const promoData = JSON.parse(localStorage.getItem('promoData') || '{}');
  const discountAmount = promoData.discountAmount;

  const total = foodServicePayment?.Price ? foodServicePayment.Price : 0;
  const vat = total ? (total - total / 1.07) : 0;
  const subtotal = total && vat ? total - vat : 0;

  const formattedDate = foodServicePayment?.PaymentDate
    ? dayjs(foodServicePayment.PaymentDate).format("DD/MM/YYYY") // Adjust format as needed
    : "N/A";

  const getOrderDetail = async () => {
    const res = await GetOrderDetail();
    if (res.status === 200) {
      setOrderDetail(res.data);
    } else {
      setOrderDetail([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getFoodServicePaymentById = async () => {
    if (!foodServicePaymentID) return;
    const res = await GetFoodServicePaymentById(foodServicePaymentID);
    if (res.status === 200) {
      setFoodServicePayment(res.data);
      console.log("res.data.Order.CustomerID", res.data.Order.CustomerID);
      getCustomerByID(res.data.Order.CustomerID);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getCustomerByID = async (customerID: number) => {
    const res = await GetUsersById(customerID);
    if (res.status === 200) {
      setCustomer(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: res?.data?.error || "Unknown error",
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const savedData = localStorage.getItem("foodServicePaymentID");
      console.log("savedData", savedData);  // ตรวจสอบค่าที่เก็บใน localStorage
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (!isNaN(parsedData)) {
          setFoodServicePaymentID(parsedData);
          clearInterval(intervalId);
        } else {
          console.error("foodServicePaymentID is not valid in localStorage");
        }
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    if (foodServicePaymentID !== null) {
      getOrderDetail();
      getFoodServicePaymentById();
    }
  }, [foodServicePaymentID]);

  useEffect(() => {
    // Set isLoaded when all data is ready (foodServicePayment, customer, orderDetails)
    if (foodServicePayment && customer && orderDetail.length > 0) {
      setIsLoaded(true);
    }
  }, [foodServicePayment, customer, orderDetail]);

  if (!isLoaded) {
    return <Spinner/>; // Or a loading spinner
  }

  // Filter order details where OrderID matches the OrderID in foodServicePayment
  const filteredOrderDetails = orderDetail.filter((detail) => foodServicePayment?.OrderID === detail.OrderID);
  
  const handleDownload = async () => {
    if (contentRef.current) {
      // Hide the icons before capturing
      const icons = document.querySelectorAll(".icon-container");
      icons.forEach((icon) => {
        (icon as HTMLElement).style.display = "none";
      });

      // Step 1: Capture the content as a canvas using html2canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 3, // Increase the resolution of the canvas (higher scale = better quality)
        useCORS: true, // Ensures that images from cross-origin sources are captured
      });

      // Step 2: Convert the canvas to an image (base64 format)
      const imgData = canvas.toDataURL("image/png");

      // Step 3: Create a new PDF document using jsPDF
      const pdf = new jsPDF("p", "mm", "a4"); // A4 paper size, portrait orientation

      // Step 4: Calculate image dimensions to fit it within the A4 paper size
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm padding on each side
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

      // Step 5: Add the image to the PDF
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

      // Step 6: Save the generated PDF
      pdf.save("payment-receipt.pdf");

      // Restore the icons after generating the PDF
      icons.forEach((icon) => {
        (icon as HTMLElement).style.display = "";
      });
    } else {
      console.error("Content reference is not available.");
    }
  };

  return (
    <section className="food-receipt-container" ref={contentRef}>
      {contextHolder}
      <div className="receipt-header">
        <div className="logo">
          <img src={LogoCruiseShip} alt="LogoCruiseShip" />
          <h1>TITANIC</h1>
        </div>
        <h1>TAX INVOICE / RECEIPT</h1>
      </div>

      <div className="cruise-ship-address">
        <p>Cruise Ship Limited</p>
        <p>Suranaree University of Technology (SUT) is 111 University Avenue, Muang District, Nakhon Ratchasima 30000, Thailand123</p>
      </div>

      <div className="customer-detail-container">
        <div className="customer-detail">
          <h1>Bill To</h1>
          <div className="customer-info">
            <span className="name">{customer?.FirstName} {customer?.LastName}</span>
            <span className="address">4312 Wood Road New York, NY 100031</span>
          </div>
        </div>
        <div className="receipt-detail">
          <div className="receipt-info">
            <h1>RECEIPT</h1>
            <p>#{foodServicePayment?.ID}</p>
          </div>
          <div className="receipt-info">
            <h1>RECEIPT DATE</h1>
            <p>{formattedDate}</p>
          </div>
          <div className="receipt-info">
            <h1>PAYMENT METHOD</h1>
            <p>{foodServicePayment?.PaymentMethod}</p>
          </div>
        </div>
      </div>

      <table className="table-order-details">
        <thead>
          <tr>
            <th className="description">Description</th>
            <th className="quantity">Quantity</th>
            <th className="unit-price">Unit Price</th>
            <th className="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrderDetails.map((detail, index) => (
            <tr key={detail.ID}>
              <td className="menu-name">{index + 1}. {detail.Menu?.MenuName}</td>
              <td className="quantity">{detail.Quantity}</td>
              <td className="unit-price">{(detail.Amount / detail.Quantity).toFixed(2)}</td>
              <td className="amount">{detail.Amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table-summary-container">
        <tbody>
          <tr>
            <th>Promotion code</th>
            <td>-{discountAmount}</td>
          </tr>
          <tr>
            <th>VAT 7%</th>
            <td>{vat.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Subtotal</th>
            <td>{subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Total</th>
            <td>{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <div className="description-receipt">
        <p>This e-tax invoice/e-receipt is prepared by Cruise Ship and submitted electronically to the Revenue Department.</p>
        <p>Please carefully check the document and any amendment can be requested within 15 days. Otherwise, the e-tax invoice/e-receipt shall be deemed complete and accurate for submission.</p>
      </div>
      <div className="icon-container">
        <div className="print-icon-container"  onClick={reactToPrintFn}>
          <MdLocalPrintshop className="print-icon"></MdLocalPrintshop>
          <h1>PRINT</h1>
        </div>
        <div className="download-icon-container"  onClick={handleDownload}>
          <MdFileDownload className="download-icon"></MdFileDownload>
          <h1>DOWNLOAD</h1>
        </div>
      </div>
    </section>
  );
}

export default FoodReceipt;
