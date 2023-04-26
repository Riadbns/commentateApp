import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../prisma/client"
import { data } from "autoprefixer"
import {getServerSession} from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === "DELETE"){
       
        const session = await getServerSession(req,res,authOptions)
        if(!session) return res.status(401).json({message: "please sign in "})
      
        //delete post
        try{
          const postId = req.body
          const result = await prisma.post.delete({
            where: {
                id: postId,
            },
          })
          res.status(200).json(data)
        }catch(err){
          res.status(403).json({ err: "Error fetching post" })
        }
    }
}