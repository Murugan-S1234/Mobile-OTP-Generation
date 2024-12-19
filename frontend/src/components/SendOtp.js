import React, { useState } from "react";
import axios from "axios";

function SendOtp({ setStep, setMobile }) {
  const [mobileInput, setMobileInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send-otp`, { mobile: mobileInput });
      setMessage(response.data.message);
      setMobile(mobileInput);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div>
      <label>
        Mobile Number:
        <input
          type="text"
          value={mobileInput}
          onChange={(e) => setMobileInput(e.target.value)}
          placeholder="Enter your mobile number"
          style={{ marginLeft: "10px", padding: "5px" }}
          required
        />
      </label>
      <button onClick={handleSendOtp} style={{ marginLeft: "10px", padding: "5px 10px" }}>
        Send OTP
      </button>
      {message && <p style={{ marginTop: "20px", color: "blue" }}>{message}</p>}
    </div>
  );
}

export default SendOtp;
