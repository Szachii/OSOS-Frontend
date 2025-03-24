import React, { useState, useEffect } from "react";
import Navbar1 from "../components/Navbar1";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
  });
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [editedUser, setEditedUser] = useState({ ...user });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        const { fullName, email, mobile, address } = response.data.data;
        setUser({ fullName, email, mobile, address });
        setEditedUser({ fullName, email, mobile, address });
        setLoading(false);
        // For now, keeping purchaseHistory static as no backend endpoint provided
        setPurchaseHistory([
          { id: "12345", date: "2025-03-15", amount: "$120.00", status: "Completed" },
          { id: "12344", date: "2025-02-28", amount: "$75.50", status: "Completed" },
          { id: "12343", date: "2025-01-10", amount: "$210.25", status: "Completed" },
        ]);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
        if (err.response?.status === 404) navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    const userId = localStorage.getItem('userId');
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, {
        password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    } catch (err) {
      alert("Failed to change password: " + (err.response?.data.error || "Server error"));
    }
  };

  const handleDownloadReport = () => {
    // Logic for downloading purchase history report (static for now)
    alert("Downloading purchase history report...");
  };

  const handleEditProfile = () => {
    setEditedUser({ ...user });
    setShowEditModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, editedUser);
      setUser({ ...editedUser });
      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data.error || "Server error"));
    }
  };

  const handleConfirmDelete = async () => {
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      setShowDeleteModal(false);
      alert("Account deleted successfully!");
      navigate('/register');
    } catch (err) {
      alert("Failed to delete account: " + (err.response?.data.error || "Server error"));
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar1 />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

        <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start">
            <div className="mb-6 md:mb-0 md:mr-8 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-orange-400">
                <i className="fas fa-user text-6xl text-gray-500"></i>
              </div>
              <p className="mt-2 text-sm text-gray-500">Profile Photo</p>
            </div>

            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="text-lg font-medium text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-lg font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="text-lg font-medium text-gray-900">{user.mobile}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-lg font-medium text-gray-900">{user.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="w-[30%] bg-gray-50 flex flex-col rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-orange-500 px-4 py-2 rounded-lg text-gray-900 hover:bg-orange-600"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <div className="w-[70%] bg-gray-50 rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Purchase History</h2>
              <button
                onClick={handleDownloadReport}
                className="bg-transparent border border-orange-400 px-4 py-2 rounded-lg text-gray-800 hover:bg-orange-400 hover:text-gray-900 flex items-center"
              >
                <i className="fas fa-download mr-2"></i>
                Download Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseHistory.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{purchase.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {purchase.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <button
            onClick={handleEditProfile}
            className="bg-orange-500 px-6 py-3 rounded-lg text-gray-900 hover:bg-orange-600 flex items-center justify-center"
          >
            <i className="fas fa-edit mr-2"></i>
            Edit Profile
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-transparent border border-red-500 px-6 py-3 rounded-lg text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center"
          >
            <i className="fas fa-trash-alt mr-2"></i>
            Delete Account
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName" // Match backend field name
                  value={editedUser.fullName}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile" // Match backend field name
                  value={editedUser.mobile}
                  onChange={handleEditFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={editedUser.address}
                  onChange={handleEditFormChange}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 px-4 py-2 rounded-lg text-gray-900 hover:bg-orange-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-500">Delete Account</h2>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-red-500"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      You will lose all your purchase history, saved preferences, and personal information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default UserProfile;