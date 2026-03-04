// api/send-otp.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Check if the request is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Logic to send actual SMS would go here
  console.log(`Sending OTP to: ${phone}`);

  // Return success to the frontend
  return res.status(200).json({ 
    success: true, 
    message: 'OTP sent successfully!' 
  });
}