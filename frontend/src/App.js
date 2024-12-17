import React, { useState } from "react";
import SendOtp from "./components/SendOtp";
import ValidateOtp from "./components/ValidateOtp";

function App() {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Validate OTP
  const [mobile, setMobile] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>OTP Verification</h1>
      {step === 1 && <SendOtp setStep={setStep} setMobile={setMobile} />}
      {step === 2 && <ValidateOtp mobile={mobile} />}
    </div>
  );
}

export default App;
