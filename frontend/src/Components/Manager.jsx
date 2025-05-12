import React, { useEffect, useState, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_BASE_URL = 'http://localhost:3000/api'

const Manager = () => {
  const [form, setForm] = useState({ site: '', username: '', password: '' })
  const [passwordArray, setPasswordArray] = useState([])
  const [showPasswords, setShowPasswords] = useState(false)
  const passwordRef = useRef()
  const eyeIconRef = useRef()

  // Fetch passwords
  const fetchPasswords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/passwords`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setPasswordArray(data)
    } catch (error) {
      toast.error('Error loading passwords')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchPasswords()
  }, [])

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    if (eyeIconRef.current.src.includes('eyecross.png')) {
      eyeIconRef.current.src = 'icons/eye.png'
      passwordRef.current.type = 'password'
    } else {
      eyeIconRef.current.src = 'icons/eyecross.png'
      passwordRef.current.type = 'text'
    }
  }

  // Handle form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // Save or update password
  const savePassword = async () => {
    if (form.site.length < 4 || form.username.length < 4 || form.password.length < 4) {
      toast.error('All fields must be at least 4 characters')
      return
    }

    try {
      const method = form._id ? 'PUT' : 'POST'
      const url = form._id 
        ? `${API_BASE_URL}/passwords/${form._id}`
        : `${API_BASE_URL}/passwords`

      // Remove _id from form data when creating new entry
      const { _id, ...formData } = form

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success(`Password ${form._id ? 'updated' : 'saved'} successfully`)
      setForm({ site: '', username: '', password: '' })
      fetchPasswords()
    } catch (error) {
      toast.error('Error saving password')
      console.error(error)
    }
  }

  // Delete password
  const deletePassword = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/passwords/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Password deleted successfully')
      fetchPasswords()
    } catch (error) {
      toast.error('Error deleting password')
      console.error(error)
    }
  }

  // Edit password
  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(item => item._id === id)
    if (passwordToEdit) {
      setForm(passwordToEdit)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.info('Copied to clipboard', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true
    })
  }

   return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-700 opacity-20 blur-[100px]"></div>
      </div>
      <div className="px-3 min-h-[84vh] max-w-md mx-auto">
        <h1 className='text-2xl font-bold text-center pt-4'>
          <span className='text-green-500'>&lt;</span>
          Pass
          <span className='text-green-500'>OP/&gt;</span>
        </h1>
        <p className='text-green-900 text-sm text-center mb-4'>Your password manager</p>
        
        <div className='flex flex-col gap-4 text-black'>
          <div>
            <label htmlFor="site" className='text-xs text-gray-600 pl-3'>Website URL</label>
            <input 
              value={form.site} 
              onChange={handleChange} 
              placeholder='example.com' 
              className='rounded-full border border-green-500 w-full px-4 py-2 text-sm' 
              type="text" 
              name="site" 
              id="site" 
            />
          </div>
          
          <div className='flex flex-col gap-4'>
            <div>
              <label htmlFor="username" className='text-xs text-gray-600 pl-3'>Username</label>
              <input 
                value={form.username} 
                onChange={handleChange} 
                placeholder='Your username' 
                className='px-4 py-2 rounded-full w-full border border-green-500 text-sm' 
                type="text" 
                name="username" 
                id="username" 
              />
            </div>
            
            <div className='relative'>
              <label htmlFor="password" className='text-xs text-gray-600 pl-3'>Password</label>
              <input 
                ref={passwordRef} 
                value={form.password} 
                onChange={handleChange} 
                placeholder='Your password' 
                className='px-4 py-2 rounded-full w-full border border-green-500 text-sm pr-10' 
                type="password" 
                name="password" 
                id="password" 
              />
              <span onClick={togglePasswordVisibility} className='absolute right-3 bottom-2 cursor-pointer'>
                <img ref={eyeIconRef} width={20} src="icons/eye.png" alt="toggle visibility" />
              </span>
            </div>
          </div>
          
          <button 
            onClick={savePassword} 
            className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full w-full px-4 border border-green-900 py-2 text-sm mt-2'
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
              style={{width: '20px', height: '20px'}}>
            </lord-icon>
            Save Password
          </button>
          
          <div className='mt-6'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3'>
              <h2 className='font-bold text-lg'>Your Passwords</h2>
              <button 
                onClick={() => setShowPasswords(!showPasswords)} 
                className='flex items-center justify-center gap-1 bg-green-400 hover:bg-green-300 rounded-full px-3 py-1 text-xs'
              >
                <img 
                  src={showPasswords ? "icons/eyecross.png" : "icons/eye.png"} 
                  width={16} 
                  alt="toggle visibility" 
                />
                {showPasswords ? "Hide" : "Show"}
              </button>
            </div>
            
            {passwordArray.length === 0 && (
              <div className='text-center text-sm py-4 text-gray-500'>No passwords saved yet</div>
            )}
            
            {passwordArray.length !== 0 && (
              <div className='overflow-x-auto'>
                <table className="w-full min-w-[320px]">
                  <thead className='bg-green-700 text-white text-xs'>
                    <tr>
                      <th className='p-2 text-left'>Site</th>
                      <th className='p-2 text-left'>Username</th>
                      <th className='p-2 text-left'>Password</th>
                      <th className='p-2'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='bg-green-100 text-xs'>
                    {passwordArray.map((item) => (
                      <tr key={item.id} className='border-b border-green-200'>
                        <td className='p-2'>
                          <div className='flex items-center'>
                            <a 
                              href={item.site.startsWith('http') ? item.site : `https://${item.site}`} 
                              target='_blank' 
                              rel="noopener noreferrer"
                              className='truncate max-w-[80px] hover:text-green-700'
                            >
                              {item.site.replace(/^https?:\/\//, '')}
                            </a>
                            <img 
                              onClick={() => copyToClipboard(item.site)} 
                              className='cursor-pointer ml-1' 
                              src="/icons/copy.png" 
                              alt="copy" 
                              width={14} 
                            />
                          </div>
                        </td>
                        <td className='p-2'>
                          <div className='flex items-center'>
                            <span className='truncate max-w-[70px]'>{item.username}</span>
                            <img 
                              onClick={() => copyToClipboard(item.username)} 
                              className='cursor-pointer ml-1' 
                              src="/icons/copy.png" 
                              alt="copy" 
                              width={14} 
                            />
                          </div>
                        </td>
                        <td className='p-2'>
                          <div className='flex items-center'>
                            <span className='truncate max-w-[60px]'>
                              {showPasswords ? item.password : "*".repeat(Math.min(8, item.password.length))}
                            </span>
                            <img 
                              onClick={() => copyToClipboard(item.password)} 
                              className='cursor-pointer ml-1' 
                              src="/icons/copy.png" 
                              alt="copy" 
                              width={14} 
                            />
                          </div>
                        </td>
                        <td className='p-2 text-center'>
                          <div className='flex justify-center gap-2'>
                            <img 
                              onClick={() => editPassword(item._id)} 
                              className='cursor-pointer' 
                              src="icons/edit.png" 
                              alt="edit" 
                              width={14} 
                            />
                            <img 
                              onClick={() => deletePassword(item._id)} 
                              className='cursor-pointer' 
                              src="icons/delete.png" 
                              alt="delete" 
                              width={14} 
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Manager