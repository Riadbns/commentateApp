'use client'
import { useState } from "react"
import {
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query'
import toast from "react-hot-toast"
import axios,{AxiosError} from "axios"

export default function CreatePost(){
    const [title, setTitle]= useState("")
    const [isDisabled, setIsDisabled] = useState(false)
    const queryClient = useQueryClient()

    //create a post
    const { mutate } = useMutation(
        async (title:string) => await axios.post('/api/posts/addPosts', { title }),
        {
            onError:(error)=>{
                if(error instanceof AxiosError){
                    toast.error(error?.response?.data.message +'\u{1F4A5}')
                }
                setIsDisabled(false)
            },
            onSuccess:(data)=>{
                toast.success("Post has been made \u{1F525}")
                //to automaticly refetch the data to see it in the browser 
                //["posts"] this we get it from the page it's the  queryKey
                queryClient.invalidateQueries(["posts"])
                setTitle("")
                setIsDisabled(false)
            }
        }
      );
      
      const submitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDisabled(true);
        mutate(title)
      };
    return(
        <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md">
            <div className="flex flex-col my-4">
                <textarea 
                    onChange={(e)=>setTitle(e.target.value)}
                    name="title" 
                    value={title}
                    placeholder="What's on your mind?"
                    className="p-4 text-lg rounded-md my2 bg-gray-200">
                    </textarea>
            </div>

            <div className=" flex items-center justify-between gap-2">
                <p className={`font-bold text-sm ${title.length>300 ? "text-red-700" : "text-gray-700"}`}>
                    {`${title.length}/300`}   
                </p>
                <button
                    disabled={isDisabled}
                    className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
                    type="submit">
                    Ceate a post
                </button>
            </div>
        </form>
    )
}