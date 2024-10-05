import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../config";
import { Box, Typography } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const Success = ({ menuCollapse }) => {
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
            console.error("Payment not successful");
          }
        });
    }
  }, [sessionId]);

  return (
    <Box
      className="flex items-center justify-center h-[600px]"
      sx={{ pl: { xs: 2, lg: menuCollapse ? 14 : 36 } }}
    >
      <Box className="p-10 shadow-xl flex rounded relative flex-col h-1/2 items-center justify-center gap-2">
        <Link to={"/pricing"} className="self-start absolute top-6">
          <IoMdArrowRoundBack size={32} />
        </Link>
        <FaCheckCircle size={60} color="green" />
        <Typography variant="" className="text-3xl font-semibold font-Poppins">
          Payment Success
        </Typography>
        <Typography variant="" className="text-xl font-Poppins">
          Your subscription payment was processed successfully!
        </Typography>
      </Box>
    </Box>
  );
};

export default Success;
