import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import { Box } from "@mui/material";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Get session_id from query params

  useEffect(() => {
    if (sessionId) {
      fetch(`${BASE_URL}/payment/verify-session?session_id=${sessionId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.paymentStatus === "succeeded") {
            console.log("Payment was successful");
          } else {
            // Handle payment failure or incomplete payment
            console.error("Payment not successful");
          }
        });
    }
  }, [sessionId]);

  return (
    <Box className="flex items-center justify-center h-full">
      <Box className="p-10 bg-white flex flex-col items-center">
        <h1>Payment Success</h1>
        <p>Your subscription payment was processed successfully!</p>
      </Box>
    </Box>
  );
};

export default Success;
