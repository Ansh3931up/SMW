'use client'
import Image from "next/image";
import FeedCard from "@/component/FeedCard";
import {CredentialResponse,GoogleLogin} from '@react-oauth/google'
import { BsBell, BsBookmark, BsEnvelope, BsImage, BsX } from "react-icons/bs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { RequestDocument } from "graphql-request";
import { BiHash, BiHomeCircle, BiUser, BiPlus } from "react-icons/bi";
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
  const [text,setText]=useState("");
  const [imageFile,setImageFile]=useState<File|null>(null);
  const [imagePreview,setImagePreview]=useState<string|null>(null);
  const textareaRef=useRef<HTMLTextAreaElement|null>(null);
  const fileInputRef=useRef<HTMLInputElement|null>(null);
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
  useEffect(()=>{
    if(textareaRef.current){
      const el=textareaRef.current;
      el.style.height='0px';
      el.style.height=el.scrollHeight+'px';
    }
  },[text]);

  const handlePickImage=useCallback(()=>{
    fileInputRef.current?.click();
  },[]);

  const handleImageChange=useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0] || null;
    if(!file){
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    const url=URL.createObjectURL(file);
    setImagePreview(url);
  },[]);

  useEffect(()=>{
    return ()=>{ if(imagePreview) URL.revokeObjectURL(imagePreview); };
  },[imagePreview]);



  return (
    <div className="font-sans min-h-screen md:h-screen w-full text-white bg-neutral-950">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 max-w-7xl px-3 sm:px-4 md:px-6 md:h-full md:overflow-hidden">
        {/* Left sidebar */}
        <aside className="hidden md:block md:col-span-3 border-r border-gray-800 pt-6 md:h-screen md:sticky md:top-0 md:overflow-hidden">
          <div className="flex items-center gap-2 text-2xl">
            <span className="font-extrabold tracking-wide bg-gradient-to-r from-rose-300 to-orange-300 bg-clip-text text-transparent">ANSH</span>
          </div>
          <nav className="mt-6 text-lg">
            <ul className="space-y-1">
              {socialSidebarButton.map((item) => (
                <li key={item.title} className="group">
                  <button className="w-full flex items-center gap-3 px-5 py-3 rounded-full hover:bg-gray-800 active:scale-[0.99] transition cursor-pointer">
                    <span className="text-2xl transition group-hover:scale-110">{item.icon}</span>
                    <span className="group-hover:text-rose-300 transition">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6">
            <button className="w-10/12 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 active:scale-[0.99] transition text-white rounded-full px-6 py-3 font-semibold cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.25)]">Create</button>
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
        <main className="col-span-1 md:col-span-6 border-gray-800 md:border-x md:h-screen md:overflow-y-auto">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 backdrop-blur bg-neutral-950/70 border-b border-gray-800 px-4 py-3">
            <h2 className="text-xl font-bold text-neutral-200">Home</h2>
          </div>
          {/* Composer */}
          {user &&<div className="px-4 py-3 border-b border-gray-800">
            <div className="flex gap-3">
              <div>
                {user?.profileImageUrl ? (
                  <Image src={user.profileImageUrl} alt="profile" width={40} height={40} className="rounded-full object-cover object-center" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700" />
                )}
              </div>
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e)=>setText(e.target.value)}
                  rows={1}
                  placeholder="Share your thoughts..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-500 px-3 py-3 rounded-md focus:bg-gray-900/40 transition border border-gray-800 resize-none"
                />
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img src={imagePreview} alt="selected image preview" className="max-h-64 rounded-xl border border-gray-800 object-cover" />
                    <button onClick={()=>{ setImageFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 p-1 rounded-full bg-gray-900 border border-gray-700 hover:bg-gray-800" aria-label="Remove image">
                      <BsX />
                    </button>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} aria-label="Choose image" />
                    <button onClick={handlePickImage} className="text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-gray-800 transition cursor-pointer" aria-label="Add image">
                      <BsImage className="text-xl" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-gray-800 transition cursor-pointer">Draft</button>
                    <button disabled={!text.trim() && !imageFile} onClick={()=>{ setText(""); setImageFile(null); setImagePreview(null); }} className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-300 hover:to-orange-300 active:scale-[0.99] transition rounded-full px-5 py-1.5 text-sm font-medium cursor-pointer">Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>}
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
        <aside className="hidden lg:block lg:col-span-3 pt-6 lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden">
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
              <div className="hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer inline-block">
                <GoogleLogin onSuccess={(cred:CredentialResponse)=>handleLoginWithGoogle(cred)} />
              </div>
            </div>
          )}
        </aside>
        {/* Floating action button */}
        <button className="fixed bottom-20 md:bottom-6 right-6 bg-gradient-to-br from-rose-400 to-orange-400 hover:from-rose-300 hover:to-orange-300 rounded-full p-4 cursor-pointer active:scale-95 md:block" aria-label="Compose">
          <BiPlus className="text-2xl" />
        </button>
        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-gray-800 bg-neutral-950/95 backdrop-blur px-6 py-2 flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-gray-800 active:scale-[0.98]" aria-label="Home"><BiHomeCircle className="text-2xl" /></button>
          <button className="p-2 rounded-full hover:bg-gray-800 active:scale-[0.98]" aria-label="Explore"><BiHash className="text-2xl" /></button>
          <button className="p-2 rounded-full hover:bg-gray-800 active:scale-[0.98]" aria-label="Notifications"><BsBell className="text-2xl" /></button>
          <button className="p-2 rounded-full hover:bg-gray-800 active:scale-[0.98]" aria-label="Profile"><BiUser className="text-2xl" /></button>
        </nav>
      </div>
    </div>
  );
}
