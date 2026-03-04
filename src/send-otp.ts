import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

// Initialize Twilio with your Environment Variables
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests from your frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Send the actual SMS
    await client.messages.create({
      body: `Your Shrivan Science Academy OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return res.status(200).json({ success: true, message: 'OTP sent!' });
  } catch (error: any) {
    console.error('Twilio Error:', error.message);
    return res.status(500).json({ error: 'Failed to send SMS' });
  }
}
