import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { cards } from "../../data/mockData";
import axios from "axios";
import { BASE_URL } from "../../config";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51Q5NafFvGDJipH8OiP2bp3RkyX9B5IXtEhQ6g68Rq7NgTTYtCXbKz9j4ufuudQbhtL1SvF4On3s7HEMiCafFSVbB00j2RI45Ee"
);

function PricingCard({
  title,
  desc,
  price,
  options,
  isSubscribed,
  onUnsubscribe,
  onSubscribe,
}) {
  return (
    <Box
      className={`text-center flex flex-col items-center border border-neutral-300 rounded-lg p-8 ${
        isSubscribed ? "border-4 border-red-500" : ""
      }`}
    >
      <Box>
        <Typography variant="" className="font-semibold text-2xl">
          {title}
        </Typography>
        <Typography variant="" component={"p"} className="text-neutral-500">
          {desc}
        </Typography>
      </Box>
      <Box className="">
        <Typography
          variant=""
          className="text-5xl flex items-baseline justify-center pt-3 font-semibold"
        >
          {price[0]}
          <span>{price[1]}</span>
          <Typography
            variant=""
            className="text-neutral-500 text-sm font-normal "
          >
            /{price[2]}
          </Typography>
        </Typography>
        <ul className="self-center w-full mt-5 font-Poppins">
          {options.map((option, key) => (
            <li key={key} className="flex items-center mb-3">
              {option.icon}
              <Typography variant="" className="text-neutral-500 text-sm pl-2">
                {option.info}
              </Typography>
            </li>
          ))}
        </ul>
        {isSubscribed ? (
          <button
            onClick={onUnsubscribe}
            className="bg-red-500 mt-5 w-full py-2 rounded-md text-white"
          >
            Unsubscribe
          </button>
        ) : (
          <button
            onClick={onSubscribe}
            className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] mt-5 w-full py-2 rounded-md text-white"
          >
            Get Started
          </button>
        )}
      </Box>
    </Box>
  );
}

export function Pricing({ menuCollapse }) {
  const [subscribedPlan, setSubscribedPlan] = useState(null);

  const token = localStorage.getItem("authToken");
  const softwareToken = localStorage.getItem("softwareToken");

  const handleSubscribe = async (plan) => {
    try {
      const stripe = await stripePromise;
      const response = await axios.post(
        `${BASE_URL}/payment/create-subscription`,
        {
          plan: plan,
        },
        {
          headers: {
            Authorization: token,
            softwareAuthorization: softwareToken,
          },
        }
      );

      const data = response.data;

      if (data.sessionId) {
        return stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/user/unsubscribe`);
      if (response.status === 200) {
        setSubscribedPlan(null);
        alert("Unsubscribed successfully!");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      alert("Failed to unsubscribe. Please try again.");
    }
  };

  return (
    <Box
      mb={2}
      pr={3}
      sx={{ pl: { xs: 2, lg: menuCollapse ? 14 : 36 } }}
      className="font-Poppins"
    >
      <Box mt={3} textAlign={"center    "}>
        <Box className="flex flex-col gap-2">
          <Typography
            variant=""
            className="text-4xl font-Poppins font-semibold "
          >
            Invest in a plan that&apos;s as ambitious as your corporate goals.
          </Typography>
          <Typography variant="" component={"p"} className="text-neutral-600">
            Compare the benefits and features of each plan below to find the
            ideal match for your business&apos;s budget and ambitions.
          </Typography>
        </Box>
        <Box
          my={3}
          className="border-1 border-neutral-600 sm:w-8/12 mx-auto"
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {cards.map(({ title, desc, options, price }, key) => (
            <PricingCard
              key={key}
              title={title}
              desc={desc}
              price={price}
              options={options}
              isSubscribed={subscribedPlan === title}
              onUnsubscribe={handleUnsubscribe}
              onSubscribe={() => handleSubscribe(title)} // Replace with actual subscription logic when implemented on the server-side
            />
          ))}
        </Box>
        <Typography variant="" className="text-center text-neutral-600">
          You have Free Unlimited Updates and Premium Support on each package.
          You also have 30 days to request a refund.
        </Typography>
      </Box>
    </Box>
  );
}

export default Pricing;
