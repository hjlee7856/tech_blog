import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url) return res.status(400).send('No url');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000); // 30초 제한

  try {
    const response = await fetch(url as string, { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1일 캐시
    res.status(200).send(Buffer.from(buffer));
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('Image proxy request timed out');
      res.status(504).send('Image fetch timed out');
    } else {
      console.error('Image proxy error', err);
      res.status(500).send('Image fetch failed');
    }
  }
}
