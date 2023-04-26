import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../prisma/client"
import {getServerSession} from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === "GET"){
        const session = await getServerSession(req,res,authOptions)
        if(!session) return res.status(401).json({message: "please sign in "})
      
        //Fetch all posts
        try{
          const data = await prisma.user.findUnique({
            where: {
                email: session.user?.email,
              },
              include: {
                post: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    comment: true,
                  },
                },
              },
            })
          res.status(200).json(data)
        }catch(err){
          res.status(403).json({ err: "Error fetching post" })
        }
    }
}