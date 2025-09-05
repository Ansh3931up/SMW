import React from 'react';
import Image from 'next/image';
import { BiMessageRounded } from 'react-icons/bi';
import { FaRetweet } from 'react-icons/fa';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsCloudUploadFill } from 'react-icons/bs';

const FeedCard:React.FC =() => {
    return <div className='border border-r-0 border-l-0 border-b-0 border-gray-600   p-4 mb-4 hover:bg-slate-900 transition-all duration-300 ease-in-out cursor-pointer w-full max-w-2xl'>
        <div className="grid grid-cols-12 gap-3">
            <div className='col-span-1 '>
                <Image src="https://avatars.githubusercontent.com/u/129533154?v=4" width={70} height={70} alt="user-image" className='rounded-full '/>
            </div>
            <div className='col-span-11 text-white'>
                <h5>Ansh</h5>
                <p className='text-gray-400 text-sm hover:text-white'>This is a sample feed card. This is a sample feed card. Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda dolore facere, adipisci esse neque alias fuga incidunt porro veritatis fugit, dolorem , ratione doloribus tenetur facilis dolores praesentium incidunt in recusandae debitis optio iusto quos, ducimus blanditiis! Aspernatur incidunt minima reiciendis libero nisiecati poris porro quaerat laudantium, praesentium ratione quis quas sint placeat?</p>
            
            <div className='flex justify-between mt-5 items-center text-lg text-gray-500 '>
                <div className='hover:text-white'><BiMessageRounded /></div>
                <div className='hover:text-white'>
                    <FaRetweet/>
                </div>
                <div className='hover:text-white'>
                    <AiOutlineHeart/>
                </div>
                <div className='hover:text-white'>
                    <BsCloudUploadFill/>
                </div>
            </div>
            </div>
        </div>

    </div>
}


export default FeedCard;
