const handleSendOtp = async () => {
  // ... validation ...
  
  try {
    // Call your backend API here
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      setOtpSent(true);
      setSuccess('OTP sent to your phone!');
    } else {
      setError('Failed to send OTP');
    }
  } catch (err) {
    setError('Network error');
  }
};