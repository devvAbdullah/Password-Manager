import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex justify-center items-center flex-col w-full'>
        
          <div className="logo font-bold text-2xl">
            <span className='text-green-500'>&lt;</span>
            Pass
            <span className='text-green-500'>OP/&gt;</span>
        </div>
     <div>
        Created With <img className='inline' src="/icons/love.png" alt="love" width={30} /> by AbduLLaH
        </div> 
    </div>
  )
}

export default Footer
