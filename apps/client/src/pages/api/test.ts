import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const headers = req.headers;
  console.log('headers', headers);
  res.status(200).json({ name: 'Example' });
}
