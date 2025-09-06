'use client'

import FeedCard from "@/component/FeedCard";
import {CredentialResponse,GoogleLogin} from '@react-oauth/google'
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import React, { useCallback } from "react";
import type { RequestDocument } from "graphql-request";
import { BiHash, BiHomeCircle, BiUser } from "react-icons/bi";
import toast from "react-hot-toast";
import { graphqlClient } from "@/client/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

interface SocialSidebarButton{
  title:string
  icon:React.ReactNode
}
const socialSidebarButton:SocialSidebarButton[]=[
  {
    title:"Home",
    icon:<BiHomeCircle/>
  },
  {
    title:"Explore",
    icon:<BiHash/>
  },{
    title:"Notification",
    icon:<BsBell/>
  },{
    title:"Messages",
    icon:<BsEnvelope/>
  },{
    title:"Book Mark",
    icon:<BsBookmark/>
  },{
    title:"Profile",
    icon:<BiUser/>
  },
]
export default function Home() {
  const handleLoginWithGoogle=useCallback(async(cred:CredentialResponse)=>{
    const googletoken =cred.credential;
    if(!googletoken) return toast.error("Google token is required");
    const {verifyGoogleToken}=await graphqlClient.request<
      { verifyGoogleToken: string },
      { token: string }
    >(
      verifyUserGoogleTokenQuery as unknown as RequestDocument,
      { token: googletoken }
    );
    console.log("verifyGoogleToken",verifyGoogleToken);

    if(!verifyGoogleToken) return toast.error("Invalid Google token");
    if(verifyGoogleToken){
      localStorage.setItem("__twitter_auth_token", verifyGoogleToken);
    }
    // toast.success("Verified your Google token");
    // localStorage.setItem("token",verifyGoogleToken);

    // window.location.reload();
    // console.log("navigated to the home page",verifyGoogleToken);
  
    
  },[]);



  return (
    <div  className=" font-sans">
     <div className="grid grid-cols-12 h-screen w-screen px-56 ">
      <div className="col-span-3 border-r-2 border-gray-900 justify-start pt-4">
          <BsTwitter className="text-3xl text-white h-fit hover:text-sky-500 cursor-pointer " />
          <div className="mt-4 text-xl">
            <ul>
              {socialSidebarButton.map(item=> <li key={item.title} className="flex justify-start items-center gap-3 text-xl  hover:bg-gray-600 hover:scale-105 rounded-full px-2 py-2 cursor-pointer"><span>{item.icon}</span><span>{item.title}</span></li>)}
            </ul>
          </div>
          <div>
            <button className="bg-blue-500 text-white rounded-full px-20 py-3 mt-4 hover:bg-blue-600">Tweet</button>
          </div>
      </div>
      <div className="col-span-6 flex flex-col justify-center mask-origin-content overflow-y-scroll  overscroll-none border-r-[0.5px] border-l-[0.5px]  border-gray-600">
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />

      </div>
      <div className="col-span-3 pt-4">
        <div className="flex justify-center items-center border p-5">
          <h1 className="m-2 text-xl">New to Twitter? Sign up</h1>
        <GoogleLogin onSuccess={(cred:CredentialResponse)=>handleLoginWithGoogle(cred)}/>
        </div>
        </div>


     </div>
    </div>
  );
}
