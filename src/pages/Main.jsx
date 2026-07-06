import React from 'react'
import { useNavigate } from 'react-router-dom'

const Main = () => {
  const navigate = useNavigate()
  return (
    <div className="py-20 bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">BuildTrack</h1>
        <p className="text-gray-500 mb-8">Construction site daily tracking</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default Main
