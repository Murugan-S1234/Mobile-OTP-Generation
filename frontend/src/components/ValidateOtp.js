import React, { useState } from "react";
import axios from "axios";

function ValidateOtp({ mobile }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleValidateOtp = async () => {
    try {
      const response = await axios.post("${process.env.REACT_APP_BACKEND_URL}/validate-otp", { mobile, otp });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error validating OTP");
    }
  };

  return (
    <div>
      <label>
        OTP:
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter the OTP"
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </label>
      <button onClick={handleValidateOtp} style={{ marginLeft: "10px", padding: "5px 10px" }}>
        Validate OTP
      </button>
      {message && <p style={{ marginTop: "20px", color: "blue" }}>{message}</p>}
    </div>
  );
}

export default ValidateOtp;
