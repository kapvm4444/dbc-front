"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { dummyUser, dummyCards } from "../../data/dummyData"
import { User, Mail, Phone, Calendar, Heart, CreditCard, Edit, Save, X, Camera } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [favoriteCards, setFavoriteCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setProfile(dummyUser)
        setFormData(dummyUser)

        const favorites = dummyCards.filter((card) => dummyUser.favorites.includes(card.id))
        setFavoriteCards(favorites)
        setLoading(false)
      }, 500)
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log("Updating profile:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProfile(formData)
      setEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
          <Link href="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading && !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="flex space-x-2 mt-4 md:mt-0">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex items-center disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button onClick={handleCancel} className="btn-secondary flex items-center">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-primary flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={editing ? formData.image : profile.image}
                  alt={profile.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                />
                {editing && (
                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {profile.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {profile.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  {editing ? (
                    <div className="flex gap-2">
                      <select
                        className="input-field w-24"
                        value={formData.dialCode}
                        onChange={(e) => handleInputChange("dialCode", e.target.value)}
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                      </select>
                      <input
                        type="tel"
                        className="input-field flex-1"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {profile.dialCode} {profile.mobile}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dummyCards.length}</div>
                  <div className="text-sm text-gray-600">Total Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{favoriteCards.length}</div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-600" />
            Favorite Cards ({favoriteCards.length})
          </h2>

          {favoriteCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteCards.map((card) => (
                <Link key={card.id} href={`/cards/${card.id}`}>
                  <div className="card p-4 cursor-pointer">
                    <img
                      src={card.frontImage || "/placeholder.svg"}
                      alt={card.businessName}
                      className="w-full h-24 object-cover rounded mb-3"
                    />
                    <h3 className="font-medium text-gray-900 truncate">{card.businessName}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      {card.city}, {card.state}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No favorite cards yet</p>
              <Link href="/cards" className="text-blue-600 hover:text-blue-700 text-sm">
                Browse your cards to add favorites
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="space-y-3">
            <Link
              href="/cards"
              className="flex items-center text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors"
            >
              <CreditCard className="h-4 w-4 mr-3" />
              Manage Business Cards
            </Link>
            <button
              onClick={logout}
              className="flex items-center text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors w-full text-left"
            >
              <User className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
