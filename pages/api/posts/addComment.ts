import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../prisma/client"
import {getServerSession} from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === "POST"){
        const session = await getServerSession(req,res,authOptions)
        if(!session) return res.status(401).json({message: "please sign in "})
       //Get User
        const prismaUser = await prisma.user.findUnique({
            where: { email: session.user?.email },
        })
        //Add comment
        try{
            const {title,postId}=req.body.data
            if (!title.length) {
                return res.status(401).json({ message: "Please enter some text" })
              }
            const result = await prisma.comment.create({
                data: {
                  message:title,
                  userId: prismaUser.id,
                  postId,
                },
              })
              res.status(200).json(result)
        }catch(err){
          res.status(403).json({ err: "Error fetching post" })
        }
    }
}