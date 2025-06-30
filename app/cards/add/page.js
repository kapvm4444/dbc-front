"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
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
import ocrService from "../../../services/ocrService";

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
    longitude: "",
    latitude: "",
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

  // Replace the handleOCRUpload function with this:
  const handleOCRUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      console.log("Processing OCR for file:", file.name);

      // Use the enhanced OCR service
      const ocrResult = await ocrService.processImage(file, "tesseract");

      console.log("OCR Result:", ocrResult);
      console.log("Extracted text:", ocrResult.text);
      console.log("Confidence:", ocrResult.confidence);

      // Parse the extracted text with enhanced parsing
      const parsedData = ocrService.parseBusinessCardText(ocrResult.text);

      console.log("Parsed data:", parsedData);

      // Update form data with parsed information, ensuring API compatibility
      setFormData((prev) => ({
        ...prev,
        businessName: parsedData.businessName || prev.businessName,
        category:
          parsedData.category.length > 0 ? parsedData.category : prev.category,
        subCategory:
          parsedData.subCategory.length > 0
            ? parsedData.subCategory
            : prev.subCategory,
        owner:
          parsedData.owner.length > 0 && parsedData.owner[0].name
            ? parsedData.owner
            : prev.owner,
        lanLine: parsedData.lanLine || prev.lanLine,
        fax: parsedData.fax || prev.fax,
        emails:
          parsedData.emails.length > 0 && parsedData.emails[0]
            ? parsedData.emails
            : prev.emails,
        address: parsedData.address || prev.address,
        city: parsedData.city || prev.city,
        state: parsedData.state || prev.state,
        country: parsedData.country || prev.country,
        zipcode: parsedData.zipcode || prev.zipcode,
        longitude: parsedData.longitude || prev.longitude,
        latitude: parsedData.latitude || prev.latitude,
        tags:
          parsedData.tags.length > 0 && parsedData.tags[0]
            ? parsedData.tags
            : prev.tags,
        frontImage: file,
      }));

      // Set the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          frontImage: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      const confidencePercent = Math.round(ocrResult.confidence * 100);
      alert(
        `OCR processing completed with ${confidencePercent}% confidence!\n\nExtracted:\n- Business: ${parsedData.businessName || "Not found"}\n- Contact: ${parsedData.owner[0]?.name || "Not found"}\n- Email: ${parsedData.emails[0] || "Not found"}\n- Phone: ${parsedData.owner[0]?.mobile || parsedData.lanLine || "Not found"}\n\nPlease review and edit the information below.`,
      );
    } catch (error) {
      console.error("OCR processing failed:", error);

      // Still set the image even if OCR fails
      setFormData((prev) => ({
        ...prev,
        frontImage: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          frontImage: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      alert(
        `OCR processing failed: ${error.message}\n\nThe image has been uploaded. Please enter the information manually.`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse extracted text and extract business card information
  const parseBusinessCardText = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const parsedData = {
      businessName: "",
      owner: [{ name: "", dialCode: "+1", mobile: "" }],
      emails: [""],
      address: "",
      city: "",
      state: "",
      zipcode: "",
      category: [""],
      tags: [""],
      lanLine: "",
      fax: "",
    };

    // Replace the invalid regex patterns with these corrected ones:
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex =
      /(\+?1?[-.\s]?)?$$?([0-9]{3})$$?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const websiteRegex =
      /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
    const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;

    // Also update the patterns object in the `parseBusinessCardText` function:
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
      phone:
        /(?:\+?91[-.\s]?)?$$?(\d{3,5})$$?[-.\s]?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,
      website:
        /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi,
      zipcode: /\b\d{6}\b|\b\d{5}(?:-\d{4})?\b/g,
      fax: /(?:fax|f)[\s:]*(?:\+?91[-.\s]?)?$$?(\d{3,5})$$?[-.\s]?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/gi,
      mobile:
        /(?:mobile|cell|m|mob)[\s:]*(?:\+?91[-.\s]?)?$$?(\d{3,5})$$?[-.\s]?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/gi,
      landline:
        /(?:tel|phone|ph|landline|land)[\s:]*(?:\+?91[-.\s]?)?$$?(\d{3,5})$$?[-.\s]?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/gi,
    };

    let businessNameFound = false;
    let personNameFound = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Extract emails
      const emails = line.match(emailRegex);
      if (emails) {
        parsedData.emails = emails;
      }

      // Extract phone numbers
      const phones = line.match(phoneRegex);
      if (phones) {
        const cleanPhone = phones[0].replace(/\D/g, "");
        if (cleanPhone.length === 10) {
          // Check if it's likely a mobile (no specific way to distinguish, so we'll use the first one as mobile)
          if (!parsedData.owner[0].mobile) {
            parsedData.owner[0].mobile = cleanPhone;
          } else if (!parsedData.lanLine) {
            parsedData.lanLine = cleanPhone;
          }
        }
      }

      // Extract ZIP code
      const zipMatch = line.match(zipRegex);
      if (zipMatch) {
        parsedData.zipcode = zipMatch[0];
      }

      // Try to identify business name (usually first non-contact line)
      if (
        !businessNameFound &&
        !emailRegex.test(line) &&
        !phoneRegex.test(line) &&
        !websiteRegex.test(line)
      ) {
        if (line.length > 3 && !line.match(/\d{5}/)) {
          // Not a zip code
          parsedData.businessName = line;
          businessNameFound = true;
          continue;
        }
      }

      // Try to identify person name (look for title patterns or name-like strings)
      if (!personNameFound && businessNameFound) {
        const titlePatterns =
          /\b(Mr|Mrs|Ms|Dr|CEO|President|Manager|Director|Owner)\b/i;
        if (
          titlePatterns.test(line) ||
          (line.split(" ").length >= 2 && line.split(" ").length <= 4)
        ) {
          const cleanName = line
            .replace(
              /\b(Mr|Mrs|Ms|Dr|CEO|President|Manager|Director|Owner)\b\.?\s*/gi,
              "",
            )
            .trim();
          if (cleanName.length > 0) {
            parsedData.owner[0].name = cleanName;
            personNameFound = true;
          }
        }
      }

      // Try to identify address components
      const stateAbbreviations = [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ];

      // Look for state and city pattern
      for (const state of stateAbbreviations) {
        if (line.includes(state)) {
          const parts = line.split(",").map((p) => p.trim());
          if (parts.length >= 2) {
            parsedData.city = parts[0];
            const stateZipPart = parts[1];
            parsedData.state = state;

            // Extract zip from state part if not already found
            const zipInStatePart = stateZipPart.match(zipRegex);
            if (zipInStatePart && !parsedData.zipcode) {
              parsedData.zipcode = zipInStatePart[0];
            }
          }
          break;
        }
      }

      // If line contains numbers and letters, might be an address
      if (
        !parsedData.address &&
        /\d/.test(line) &&
        /[a-zA-Z]/.test(line) &&
        !emailRegex.test(line) &&
        !phoneRegex.test(line)
      ) {
        // Skip if it's likely a phone or zip
        if (
          !line.match(/^\d{5}/) &&
          !line.match(/^\d{10}/) &&
          !line.match(/^\+?\d/)
        ) {
          parsedData.address = line;
        }
      }
    }

    // Try to guess category based on business name or extracted text
    const categoryKeywords = {
      Technology: [
        "tech",
        "software",
        "IT",
        "computer",
        "digital",
        "web",
        "app",
        "development",
      ],
      Healthcare: [
        "medical",
        "health",
        "doctor",
        "clinic",
        "hospital",
        "dental",
        "pharmacy",
      ],
      Food: [
        "restaurant",
        "cafe",
        "food",
        "catering",
        "bakery",
        "bar",
        "grill",
      ],
      Finance: [
        "bank",
        "financial",
        "insurance",
        "accounting",
        "investment",
        "loan",
      ],
      "Real Estate": ["real estate", "property", "realtor", "homes", "realty"],
      Education: [
        "school",
        "education",
        "training",
        "academy",
        "university",
        "college",
      ],
      Retail: ["store", "shop", "retail", "boutique", "market", "sales"],
      Services: ["service", "consulting", "repair", "maintenance", "cleaning"],
    };

    const fullText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (
        keywords.some((keyword) => fullText.includes(keyword.toLowerCase()))
      ) {
        parsedData.category = [category];
        parsedData.tags = keywords.filter((keyword) =>
          fullText.includes(keyword.toLowerCase()),
        );
        break;
      }
    }

    // Clean up empty values
    Object.keys(parsedData).forEach((key) => {
      if (Array.isArray(parsedData[key])) {
        parsedData[key] = parsedData[key].filter(
          (item) => item && item.trim && item.trim() !== "",
        );
        if (parsedData[key].length === 0) {
          parsedData[key] = [""]; // Keep at least one empty item for form functionality
        }
      }
    });

    return parsedData;
  };

  // Alternative: Client-side OCR using Tesseract.js
  const handleOCRUploadTesseract = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      console.log("Processing OCR for file:", file.name);

      // Import Tesseract.js dynamically
      const Tesseract = await import("tesseract.js");

      // Process the image with Tesseract
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Log progress
      });

      console.log("Extracted text:", text);

      // Parse the extracted text
      const parsedData = parseBusinessCardText(text);

      // Update form data with parsed information
      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        frontImage: file,
      }));

      // Set the image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({
          ...prev,
          frontImage: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      alert(
        "OCR processing completed! Please review and edit the extracted information.",
      );
    } catch (error) {
      console.error("OCR processing failed:", error);
      alert(
        `OCR processing failed: ${error.message}. Please try manual entry.`,
      );
    } finally {
      setLoading(false);
    }
  };
  const uploadImageToAPI = async (imageFile) => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // You might need to implement an image upload endpoint
      // For now, we'll convert to base64 as a fallback
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(imageFile);
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.businessName.trim()) {
        throw new Error("Business name is required");
      }

      // Upload images if they exist
      const frontImageUrl = formData.frontImage
        ? await uploadImageToAPI(formData.frontImage)
        : null;
      const backImageUrl = formData.backImage
        ? await uploadImageToAPI(formData.backImage)
        : null;

      // Prepare data for API
      const cardData = {
        businessName: formData.businessName.trim(),
        category: formData.category.filter((cat) => cat.trim() !== ""),
        subCategory: formData.subCategory.filter(
          (subCat) => subCat.trim() !== "",
        ),
        frontImage: frontImageUrl,
        backImage: backImageUrl,
        owner: formData.owner
          .filter((owner) => owner.name.trim() !== "")
          .map((owner) => ({
            name: owner.name.trim(),
            dialCode: owner.dialCode,
            mobile: owner.mobile ? Number.parseInt(owner.mobile) : null,
          })),
        lanLine: formData.lanLine ? Number.parseInt(formData.lanLine) : null,
        fax: formData.fax ? Number.parseInt(formData.fax) : null,
        emails: formData.emails.filter((email) => email.trim() !== ""),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country,
        zipcode: formData.zipcode ? Number.parseInt(formData.zipcode) : null,
        longitude: formData.longitude
          ? Number.parseFloat(formData.longitude)
          : null,
        latitude: formData.latitude
          ? Number.parseFloat(formData.latitude)
          : null,
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
      };

      // Remove empty arrays and null values
      Object.keys(cardData).forEach((key) => {
        if (Array.isArray(cardData[key]) && cardData[key].length === 0) {
          delete cardData[key];
        }
        if (cardData[key] === null || cardData[key] === "") {
          delete cardData[key];
        }
      });

      console.log("Sending card data:", cardData);

      const response = await fetch("https://dbcapi.khush.pro/api/v1/cards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(cardData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create card");
      }

      alert("Card created successfully!");
      router.push("/cards");
    } catch (error) {
      console.error("Failed to save card:", error);
      alert(`Failed to save card: ${error.message}`);
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="input-field"
                  value={formData.longitude}
                  onChange={(e) =>
                    handleInputChange("longitude", e.target.value)
                  }
                  placeholder="e.g., -122.4194"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="input-field"
                  value={formData.latitude}
                  onChange={(e) =>
                    handleInputChange("latitude", e.target.value)
                  }
                  placeholder="e.g., 37.7749"
                />
              </div>
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
