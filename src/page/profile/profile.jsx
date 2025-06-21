import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.data;
      setUserData(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profilePictureUrl: user.profilePictureUrl || "",
        phoneNumber: user.phoneNumber || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/front");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/front");
      return;
    }

    try {
      setIsSaving(true);
      const response = await axios.post("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile", formData, {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "OK") {
        alert("Profile updated successfully!");
        fetchUserProfile();
        setIsEditing(false);

        // Update localStorage with new user data
        const currentUserData = JSON.parse(localStorage.getItem("userData") || "{}");
        const updatedUserData = {
          ...currentUserData,
          ...response.data.data,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      profilePictureUrl: userData.profilePictureUrl || "",
      phoneNumber: userData.phoneNumber || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28cdba] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <IoArrowBack size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaUser className="text-[#28cdba]" />
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#28cdba] to-[#20a89a] px-8 py-12 text-white relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {(isEditing ? formData.profilePictureUrl : userData?.profilePictureUrl) ? (
                    <img
                      src={isEditing ? formData.profilePictureUrl : userData.profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://static.vecteezy.com/system/resources/previews/030/504/837/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FaUser size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{userData?.name || "User"}</h2>
                <p className="text-lg opacity-90 mb-1">{userData?.email}</p>
                <p className="text-sm opacity-75 capitalize bg-white/20 px-3 py-1 rounded-full inline-block">{userData?.role || "User"}</p>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                <FaEdit size={20} />
              </button>
            )}
          </div>

          {/* Profile Details */}
          <div className="p-8">
            {isEditing ? (
              /* Edit Form */
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h3>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Profile Picture URL Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCamera className="inline mr-2" />
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    name="profilePictureUrl"
                    value={formData.profilePictureUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#28cdba] focus:border-transparent transition-colors"
                    placeholder="Enter profile picture URL"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                    className="flex-1 bg-[#28cdba] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#20a89a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h3>

                {/* Profile Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUser className="text-[#28cdba]" />
                      <span className="text-sm font-medium text-gray-600">Full Name</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{userData?.name || "Not provided"}</p>
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaEnvelope className="text-[#28cdba]" />
                      <span className="text-sm font-medium text-gray-600">Email Address</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{userData?.email || "Not provided"}</p>
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaPhone className="text-[#28cdba]" />
                      <span className="text-sm font-medium text-gray-600">Phone Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{userData?.phoneNumber || "Not provided"}</p>
                  </div>

                  {/* User ID */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUser className="text-[#28cdba]" />
                      <span className="text-sm font-medium text-gray-600">User ID</span>
                    </div>
                    <p className="text-sm font-mono text-gray-600 break-all">{userData?.id || "Not available"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
