"use client"
import { useState } from "react"
import { Search, Filter, X } from "lucide-react"

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    tags: "",
  })

  const categories = [
    "Technology",
    "Food",
    "Healthcare",
    "Education",
    "Finance",
    "Real Estate",
    "Retail",
    "Services",
    "Manufacturing",
  ]

  const cities = [
    "San Francisco",
    "New York",
    "Chicago",
    "London",
    "Boston",
    "Los Angeles",
    "Seattle",
    "Austin",
    "Miami",
    "Denver",
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onSearch(searchTerm, newFilters)
  }

  const clearFilters = () => {
    setFilters({ category: "", city: "", tags: "" })
    onSearch(searchTerm, { category: "", city: "", tags: "" })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by business name, tags, category, city, or owner..."
            className="input-field pl-10 text-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              onSearch(e.target.value, filters)
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center ${showFilters ? "bg-blue-100 text-blue-700" : ""}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="input-field"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                className="input-field"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                placeholder="Enter tags..."
                className="input-field"
                value={filters.tags}
                onChange={(e) => handleFilterChange("tags", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
