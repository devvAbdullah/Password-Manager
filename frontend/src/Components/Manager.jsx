import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const ref = useRef();
    const passref = useRef();
    const [PasswordArray, setPasswordArray] = useState([])
    const [showPasswords, setShowPasswords] = useState(false); // New state for showing passwords in table

    const getpasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
        console.log(passwords)
    }

    useEffect(() => {
        getpasswords()
    }, [])

    const showPassword = () => {
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passref.current.type = "password"
        } else {
            ref.current.src = "icons/eyecross.png"
            passref.current.type = "text"
        }
    }

    const toggleShowPasswords = () => {
        setShowPasswords(!showPasswords);
    }

    const savePassword = async() => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            await fetch("http://localhost:3000/", {method:"DELETE", body: JSON.stringify({id : form.id}), headers: { "Content-Type": "application/json" } })
            setPasswordArray([...PasswordArray, { ...form, id: uuidv4() }])
            fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body : JSON.stringify({ ...form, id: uuidv4() }) })
            setform({ site: "", username: "", password: "" })
        }
        else {
            toast.error("Please fill all the fields")
        }
    }

    const deletepassword = async(id) => {
        let c = confirm("Are you sure you want to delete this password?")
        if (c) {
            setPasswordArray(PasswordArray.filter(item => item.id !== id))
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body : JSON.stringify({ id })})
        }
        console.log([...PasswordArray, form])
    }

    const editpassword = (id) => {
        console.log('editing password' + id);
        setform({...PasswordArray.filter(item => item.id === id)[0], id: id })
        setPasswordArray(PasswordArray.filter(item => item.id !== id))
    }

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const copytext = (text) => {
        toast(' Copy to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
        });
        navigator.clipboard.writeText(text);
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition=" Bounce"
            />
            <ToastContainer />
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-700 opacity-20 blur-[100px]"></div>
            </div>
            <div className="px-2 md:px-0  md:mycontainer min-h-[84vh]">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    Pass
                    <span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your password manager </p>
                <div className='  flex flex-col p-4 gap-8 items-center text-black'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full px-3  py-1' type="text" name="site" id="site" />
                    <div className='flex flex-col md:flex-row w-full  gap-8 justify-between '>
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='px-2 py-1 rounded-full w-full border border-green-500' type="text" name="username" id="username" />
                        <div className='relative w-full'>
                            <input ref={passref} value={form.password} onChange={handleChange} placeholder='Enter Password' className='px-2 py-1 rounded-full w-full border border-green-500' type="password" name="password" id="password" />
                            <span onClick={showPassword} className='absolute right-0 top-1 cursor-pointer'>
                                <img ref={ref} className='pr-2 ' width={30} src="icons/eye.png" alt="" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300  rounded-full w-fit px-8  border border-green-900 py-2'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save Password
                    </button>
                    
                    <div className='table w-full'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-center font-bold text-xl py-4'>Your Passwords</h2>
                            <button onClick={toggleShowPasswords} className='flex items-center gap-1 bg-green-400 hover:bg-green-300 rounded-full px-3 py-1'>
                                <img 
                                    src={showPasswords ? "icons/eyecross.png" : "icons/eye.png"} 
                                    width={20} 
                                    alt="toggle visibility" 
                                />
                                {showPasswords ? "Hide Passwords" : "Show Passwords"}
                            </button>
                        </div>
                        
                        {PasswordArray.length === 0 && <div> No Passwords to show </div>}
                        {PasswordArray.length !== 0 &&
                            <table className="table-auto w-full overflow-hidden rounded-md " >
                                <thead className='bg-green-700 text-white'>
                                    <tr>
                                        <th className='text-sm  md:text-lg p-2'>Site</th>
                                        <th className='text-sm  md:text-lg p-2'>Username</th>
                                        <th className='text-sm  md:text-lg p-2'>Password</th>
                                        <th className='text-sm  md:text-lg p-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-green-100'>
                                    {PasswordArray.map((item, index) => {
                                        return <tr key={item.id} >
                                            <td className='border border-white px-1 py-2 text-center w-24'><a href={item.site} target='_blank'>{item.site}</a><img onClick={() => { copytext(item.site) }} className=' cursor-pointer inline pl-2' src="/icons/copy.png" alt="copyicon" width={30} /> </td>
                                            <td className='border border-white px-1 py-2 text-center w-24'>{item.username}<img onClick={() => { copytext(item.username) }} className=' cursor-pointer inline pl-2' src="/icons/copy.png" alt="copyicon" width={30} /></td>
                                            <td className='border border-white px-1 py-2 text-center w-24'>
                                                {showPasswords ? item.password : "*".repeat(item.password.length)}
                                                <img onClick={() => { copytext(item.password) }} className=' cursor-pointer inline pl-2' src="/icons/copy.png" alt="copyicon" width={30} />
                                            </td>
                                            <td className=' border border-white px-1 py-2 text-center w-24'>
                                                <div className='flex gap-3 justify-center'>
                                                    <img onClick={() => { editpassword(item.id) }} className=' ' width={30} src="icons/edit.png" alt="" />
                                                    <img onClick={() => { deletepassword(item.id) }} className=' ' width={30} src="icons/delete.png" alt="" />
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Manager