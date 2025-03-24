import React from 'react'



const Navbar = () => {
  return (
    <nav className="bg-P text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">SweetDiv</div>
      <ul className="flex space-x-6">
        <li><a href="/" className="hover:text-orange-400">Home</a></li>
        <li><a href="order" className="hover:text-orange-400">Order</a></li>
        <li><a href="pay" className="hover:text-orange-400">Pay</a></li>
        <li><a href="res" className="hover:text-orange-400">Resources</a></li>
        <li><a href="pricing" className="hover:text-orange-400">Pricing</a></li>
        <li><a href="db" className="hover:text-orange-400">DashBoard</a></li>
        <li><a href="aboutUs" className="hover:text-orange-400">About Us</a></li>
      </ul>
      <div>
        <a href='login' className="bg-transparent border border-orange-400 px-4 py-2 rounded-lg text-white-400 hover:bg-orange-400 hover:text-gray-900 mr-2">Login</a>
        <a href='register' className="bg-orange-500 px-4 py-2 rounded-lg text-gray-900 hover:bg-orange-600">Register Now</a>
      </div>

      
      
    </nav>
  )
}

export default Navbar;