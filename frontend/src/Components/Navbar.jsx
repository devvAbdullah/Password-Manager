import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white '>
      <div className="mycontainer flex justify-between px-6 h-14 py-5 items-center">

        <div className="logo font-bold text-2xl">
            <span className='text-green-500'>&lt;</span>
            Pass
            <span className='text-green-500'>OP/&gt;</span>
        </div>
    <ul className='flex gap-3'> 
        <li><a className='hover:font-bold' href="#">Home</a> </li>
        <li><a className='hover:font-bold' href="#">About</a> </li>
        <li><a className='hover:font-bold' href="#">Contact</a> </li>
      
        </ul>  
      </div>
    </nav>
  )
}

export default Navbar
