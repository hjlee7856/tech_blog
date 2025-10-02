import type { NextApiRequest, NextApiResponse } from 'next';
import sha256 from 'crypto-js/sha256';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password';

  if (email === adminEmail && password === sha256(adminPassword).toString()) {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token, user: { email } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
}
