"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Upload,
  Camera,
  Plus,
  Minus,
  ArrowLeft,
  Building,
  MapPin,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AddCardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("manual");

  const [formData, setFormData] = useState({
    businessName: "",
    category: [""],
    subCategory: [""],
    frontImage: null,
    backImage: null,
    owner: [{ name: "", dialCode: "+1", mobile: "" }],
    lanLine: "",
    fax: "",
    emails: [""],
    address: "",
    city: "",
    state: "",
    country: "USA",
    zipcode: "",
    tags: [""],
  });

  const [previews, setPreviews] = useState({
    frontImage: null,
    backImage: null,
  });

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
    "Entertainment",
  ];

  const countries = ["USA", "Canada", "UK", "India", "Australia"];
  const dialCodes = ["+1", "+44", "+91", "+61", "+33", "+49"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleOwnerChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      owner: prev.owner.map((owner, i) =>
        i === index ? { ...owner, [field]: value } : owner,
      ),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        field === "owner" ? { name: "", dialCode: "+1", mobile: "" } : "",
      ],
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          [field]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOCRUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      console.log("Processing OCR for file:", file.name);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const ocrResults = {
        businessName: "TechCorp Solutions",
        owner: [{ name: "John Smith", dialCode: "+1", mobile: "5551234567" }],
        emails: ["john@techcorp.com"],
        address: "123 Tech Street",
        city: "San Francisco",
        state: "California",
        zipcode: "94105",
        category: ["Technology"],
        tags: ["software", "consulting"],
      };

      setFormData((prev) => ({
        ...prev,
        ...ocrResults,
      }));

      alert(
        "OCR processing completed! Please review and edit the extracted information.",
      );
    } catch (error) {
      console.error("OCR processing failed:", error);
      alert("OCR processing failed. Please try manual entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Saving card:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Card saved successfully!");
      router.push("/cards");
    } catch (error) {
      console.error("Failed to save card:", error);
      alert("Failed to save card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to add cards
          </h1>
          <Link href="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/cards"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cards
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Business Card
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Input Method
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setUploadMethod("ocr")}
            className={`p-4 border-2 rounded-lg transition-colors ${
              uploadMethod === "ocr"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Camera className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-medium">OCR Scan</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload card image and extract information automatically
            </p>
          </button>

          <button
            onClick={() => setUploadMethod("manual")}
            className={`p-4 border-2 rounded-lg transition-colors ${
              uploadMethod === "manual"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Building className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-medium">Manual Entry</h3>
            <p className="text-sm text-gray-600 mt-1">
              Enter business card information manually
            </p>
          </button>
        </div>
      </div>

      {uploadMethod === "ocr" && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Card Image for OCR
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Upload a clear image of your business card for automatic text
              extraction
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleOCRUpload(e.target.files[0])}
              className="hidden"
              id="ocr-upload"
              disabled={loading}
            />
            <label
              htmlFor="ocr-upload"
              className={`btn-primary cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Processing..." : "Choose Image"}
            </label>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-blue-600" />
            Card Images
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {previews.frontImage ? (
                  <div className="relative">
                    <img
                      src={previews.frontImage || "/placeholder.svg"}
                      alt="Front preview"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviews((prev) => ({ ...prev, frontImage: null }));
                        setFormData((prev) => ({ ...prev, frontImage: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload("frontImage", e.target.files[0])
                      }
                      className="hidden"
                      id="front-image"
                    />
                    <label
                      htmlFor="front-image"
                      className="btn-secondary cursor-pointer"
                    >
                      Upload Front
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {previews.backImage ? (
                  <div className="relative">
                    <img
                      src={previews.backImage || "/placeholder.svg"}
                      alt="Back preview"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviews((prev) => ({ ...prev, backImage: null }));
                        setFormData((prev) => ({ ...prev, backImage: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload("backImage", e.target.files[0])
                      }
                      className="hidden"
                      id="back-image"
                    />
                    <label
                      htmlFor="back-image"
                      className="btn-secondary cursor-pointer"
                    >
                      Upload Back
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.businessName}
                onChange={(e) =>
                  handleInputChange("businessName", e.target.value)
                }
                placeholder="Enter business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Category
              </label>
              <select
                className="input-field"
                value={formData.category[0]}
                onChange={(e) =>
                  handleArrayChange("category", 0, e.target.value)
                }
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Categories
            </label>
            {formData.category.slice(1).map((cat, index) => (
              <div key={index + 1} className="flex gap-2 mb-2">
                <select
                  className="input-field flex-1"
                  value={cat}
                  onChange={(e) =>
                    handleArrayChange("category", index + 1, e.target.value)
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeArrayItem("category", index + 1)}
                  className="btn-secondary px-3"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("category")}
              className="btn-secondary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specializations/Sub Categories
            </label>
            {formData.subCategory.map((subCat, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input-field flex-1"
                  value={subCat}
                  onChange={(e) =>
                    handleArrayChange("subCategory", index, e.target.value)
                  }
                  placeholder="Enter specialization"
                />
                {formData.subCategory.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("subCategory", index)}
                    className="btn-secondary px-3"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("subCategory")}
              className="btn-secondary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Specialization
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Contact Information
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Owners/Contacts
            </label>
            {formData.owner.map((owner, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={owner.name}
                      onChange={(e) =>
                        handleOwnerChange(index, "name", e.target.value)
                      }
                      placeholder="Owner name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Dial Code
                    </label>
                    <select
                      className="input-field"
                      value={owner.dialCode}
                      onChange={(e) =>
                        handleOwnerChange(index, "dialCode", e.target.value)
                      }
                    >
                      {dialCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        className="input-field"
                        value={owner.mobile}
                        onChange={(e) =>
                          handleOwnerChange(index, "mobile", e.target.value)
                        }
                        placeholder="Mobile number"
                      />
                    </div>
                    {formData.owner.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("owner", index)}
                        className="btn-secondary px-3 mt-6"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("owner")}
              className="btn-secondary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Owner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landline
              </label>
              <input
                type="tel"
                className="input-field"
                value={formData.lanLine}
                onChange={(e) => handleInputChange("lanLine", e.target.value)}
                placeholder="Landline number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fax
              </label>
              <input
                type="tel"
                className="input-field"
                value={formData.fax}
                onChange={(e) => handleInputChange("fax", e.target.value)}
                placeholder="Fax number"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses
            </label>
            {formData.emails.map((email, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="email"
                  className="input-field flex-1"
                  value={email}
                  onChange={(e) =>
                    handleArrayChange("emails", index, e.target.value)
                  }
                  placeholder="Enter email address"
                />
                {formData.emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("emails", index)}
                    className="btn-secondary px-3"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("emails")}
              className="btn-secondary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Email
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Address Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.zipcode}
                  onChange={(e) => handleInputChange("zipcode", e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                className="input-field"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2 text-blue-600" />
            Tags
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Add tags to help categorize and search for this card
          </p>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="input-field flex-1"
                value={tag}
                onChange={(e) =>
                  handleArrayChange("tags", index, e.target.value)
                }
                placeholder="Enter tag"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("tags", index)}
                  className="btn-secondary px-3"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("tags")}
            className="btn-secondary flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Tag
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/cards" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Card"}
          </button>
        </div>
      </form>
    </div>
  );
}
