import FeedCard from "@/component/FeedCard";
import { } from 'react-icons'
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import React from "react";
import { BiHash, BiHomeCircle, BiUser } from "react-icons/bi";

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
      <div className="col-span-6 overflow-y-scroll scrollbar-hide border-r-[0.5px] border-l-[0.5px]  border-gray-600">
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />

      </div>
      <div className="col-span-3"></div>


     </div>
    </div>
  );
}
