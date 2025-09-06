'use client'
import Image from "next/image";
import FeedCard from "@/component/FeedCard";
import {CredentialResponse,GoogleLogin} from '@react-oauth/google'
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import React, { useCallback } from "react";
import type { RequestDocument } from "graphql-request";
import { BiHash, BiHomeCircle, BiUser } from "react-icons/bi";
import toast from "react-hot-toast";
import { graphqlClient } from "@/client/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";

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
  const {user}=useCurrentUser();
  const queryClient=useQueryClient();
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
  

    if(!verifyGoogleToken) return toast.error("Invalid Google token");
    if(verifyGoogleToken){
      localStorage.setItem("__twitter_auth_token", verifyGoogleToken);
    }
    await queryClient.invalidateQueries({queryKey:['current-user']});
    
  },[queryClient]);



  return (
    <div className="font-sans min-h-screen w-full bg-black text-white">
      <div className="mx-auto grid grid-cols-12 gap-6 max-w-7xl px-6">
        {/* Left sidebar */}
        <aside className="col-span-3 border-r border-gray-800 pt-6 relative">
          <div className="flex items-center gap-2 text-sky-500 text-2xl">
            <BsTwitter className="text-3xl" />
            <span className="font-bold tracking-wide">Social</span>
          </div>
          <nav className="mt-6 text-lg">
            <ul className="space-y-1">
              {socialSidebarButton.map((item) => (
                <li key={item.title} className="group">
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-800 transition">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="group-hover:text-sky-400">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6">
            <button className="w-10/12 bg-sky-500 hover:bg-sky-600 transition text-white rounded-full px-6 py-3 font-semibold">Tweet</button>
          </div>
          {user && (
            <div className="absolute bottom-4 left-3 right-3 rounded-xl bg-gray-900/70 backdrop-blur px-3 py-3">
              <div className="flex items-center gap-3">
                <Image src={user?.profileImageUrl || ""} alt="profile" width={40} height={40} className="rounded-full object-cover object-center" />
                <div className="leading-5">
                  <p className="text-sm text-gray-300">Signed in as</p>
                  <p className="text-base font-semibold">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Center feed */}
        <main className="col-span-6 border-x border-gray-800 min-h-screen">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 backdrop-blur bg-black/50 border-b border-gray-800 px-4 py-3">
            <h2 className="text-xl font-bold">Home</h2>
          </div>
          {/* Composer */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex gap-3">
              <div>
                <div className="w-10 h-10 rounded-full bg-gray-700" />
              </div>
              <div className="flex-1">
                <input placeholder="What’s happening?" className="w-full bg-transparent outline-none placeholder:text-gray-500" />
                <div className="flex justify-end mt-2">
                  <button className="bg-sky-500 hover:bg-sky-600 transition rounded-full px-4 py-1 text-sm font-medium">Post</button>
                </div>
              </div>
            </div>
          </div>
          {/* Feed */}
          <div className="divide-y divide-gray-800">
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
          </div>
        </main>

        {/* Right panel */}
        <aside className="col-span-3 pt-6">
          {user ? (
            <div className="rounded-xl border border-gray-800 p-5 bg-gradient-to-br from-gray-900 to-black">
              <p className="text-gray-400 text-sm">Welcome back,</p>
              <p className="text-xl font-semibold">{user?.firstName}</p>
              <p className="text-gray-500 text-sm mt-1">Here’s what’s trending today.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-800 p-5 bg-gradient-to-br from-gray-900 to-black">
              <h3 className="text-lg font-semibold mb-3">New to Social?</h3>
              <p className="text-gray-400 text-sm mb-3">Sign in with Google to get started.</p>
              <GoogleLogin onSuccess={(cred:CredentialResponse)=>handleLoginWithGoogle(cred)} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
