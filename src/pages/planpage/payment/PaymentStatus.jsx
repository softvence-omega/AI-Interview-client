import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [paymentSaved, setPaymentSaved] = useState(false); // ✅ prevent duplicate save
  const navigate = useNavigate();

  useEffect(() => {
    const paymentStatus = searchParams.get("status");
    const sessionId = searchParams.get("session_id");

    const savePaymentManually = async () => {
      try {
        if (
          paymentStatus === "success" &&
          sessionId &&
          !paymentSaved // ✅ check if already saved
        ) {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/payment/save-payment`,
            {
              sessionId,
            }
          );
          console.log("✅ Payment manually saved.");
          setPaymentSaved(true); // ✅ prevent future saves
        }
      } catch (err) {
        console.error("❌ Failed to save payment:", err);
      }
    };

    if (paymentStatus === "success") {
      setStatus("success");
      savePaymentManually();
      setTimeout(() => {
        navigate("/userDashboard/mockInterview");
      }, 3000);
    } else {
      setStatus("cancel");
      setTimeout(() => {
        navigate("/pricing");
      }, 3000);
    }
  }, [searchParams, navigate, paymentSaved]);

  return (
    <>
      {showModal && (
        <Modal
          title={
            status === "success"
              ? "🎉 Payment Successful!"
              : "❌ Payment Cancelled"
          }
          description={
            status === "success"
              ? "Redirecting you to the dashboard..."
              : "Redirecting you back to the pricing page..."
          }
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default PaymentStatus;
