'use client'
import Image from 'next/image'
import { useState } from 'react'
import Toggle from './Toggle'
import {useMutation,useQueryClient} from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

type EditProps = {
    id: string
    avatar: string
    name: string
    title: string
    comment?: {
      id: string
      postId: string
      userId: string
    }[]
  }

export default function EditPost({avatar,name,title,comment,id}:EditProps){
    //toggle
    const [toggle, setToggle]=useState(false)
    const queryClient=useQueryClient()
    //delete post
    const {mutate}=useMutation(
        async(id:string) => await axios.delete("/api/posts/deletePosts",{data:id}),
        {
            onError:(error)=>{
                console.log("Error deleting that post")
                toast.error("Error deleting that post" +'\u{1F4A5}')
            },
            onSuccess:(data)=>{
                console.log(data)
                queryClient.invalidateQueries(["auth-posts"])
                toast.success("Post has been deleted. \u{1F525}")
            }
        }
    )

    const deletePost=()=>{
        mutate(id)
    }
    return(
        <>
        <div className='bg-white my-8 p-8 rounded-lg'>
            <div className='flex items-center gap-2'>
                <Image width={32} height={32} src={avatar} alt="avatar" />
                <h3 className="font-bold text-gray-700">{name}</h3>
            </div>
            <div className='my-8'>
                <p className='break-all'>{title}</p>
            </div>
            <div className='flex items-center gap-4'>
                <p className='text-sm font-bold text-gray-700'>
                    {comment?.length} Comments
                </p>
                <button 
                    onClick={(e)=>{
                        setToggle(true)
                    }}
                    className='text-sm font-bold text-red-500'>Delete</button>
            </div>
        </div>
        {toggle && <Toggle deletePost={deletePost} setToggle={setToggle}/>}
        </>
    )
}