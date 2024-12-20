// import type { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from '../../../lib/mongodb';
// import Account from '../../../app/(models)/Account';

// export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     await dbConnect();
//     const account = await Account.create(req.body);
//     res.status(201).json(account);
//   } else {
//     res.status(405).end();
//   }
// };

// export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'GET') {
//     await dbConnect();
//     const accounts = await Account.find({ userId: req.query.userId });
//     res.status(200).json(accounts);
//   } else {
//     res.status(405).end();
//   }
// };