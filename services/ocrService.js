// OCR Service with multiple providers
class OCRService {
  constructor() {
    this.providers = {
      tesseract: this.processTesseract.bind(this),
      ocrSpace: this.processOCRSpace.bind(this),
      googleVision: this.processGoogleVision.bind(this),
    }
  }

  async processImage(file, provider = "tesseract") {
    if (!this.providers[provider]) {
      throw new Error(`OCR provider '${provider}' not supported`)
    }

    return await this.providers[provider](file)
  }

  // Client-side OCR using Tesseract.js
  async processTesseract(file) {
    const Tesseract = await import("tesseract.js")

    const {
      data: { text, confidence },
    } = await Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
        }
      },
    })

    return {
      text,
      confidence,
      provider: "tesseract",
    }
  }

  // OCR.space API
  async processOCRSpace(file) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("language", "eng")
    formData.append("isOverlayRequired", "false")
    formData.append("detectOrientation", "true")
    formData.append("isTable", "true")

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY || "YOUR_API_KEY_HERE",
      },
      body: formData,
    })

    const result = await response.json()

    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage || "OCR processing failed")
    }

    return {
      text: result.ParsedResults[0]?.ParsedText || "",
      confidence: result.ParsedResults[0]?.TextOverlay?.HasOverlay ? 0.8 : 0.6,
      provider: "ocrSpace",
    }
  }

  // Google Vision API (requires server-side implementation)
  async processGoogleVision(file) {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("/api/ocr/google-vision", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Google Vision OCR failed")
    }

    const result = await response.json()
    return {
      text: result.text,
      confidence: result.confidence,
      provider: "googleVision",
    }
  }

  // Enhanced text parsing for business cards with better accuracy
  parseBusinessCardText(text) {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const parsedData = {
      businessName: "",
      owner: [{ name: "", dialCode: "+91", mobile: "" }],
      emails: [],
      address: "",
      city: "",
      state: "",
      country: "India",
      zipcode: "",
      category: [],
      subCategory: [],
      tags: [],
      lanLine: "",
      fax: "",
      longitude: "",
      latitude: "",
    }

    // Enhanced regex patterns with better accuracy
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
      phone: /(?:\+?91[-.\s]?)?(?:$$?\d{3,5}$$?[-.\s]?)?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,
      website: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi,
      zipcode: /\b\d{6}\b|\b\d{5}(?:-\d{4})?\b/g,
      fax: /(?:fax|f)[\s:]*(?:\+?91[-.\s]?)?(?:$$?\d{3,5}$$?[-.\s]?)?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/gi,
      mobile:
        /(?:mobile|cell|m|mob)[\s:]*(?:\+?91[-.\s]?)?(?:$$?\d{3,5}$$?[-.\s]?)?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/gi,
      landline:
        /(?:tel|phone|ph|landline|land)[\s:]*(?:\+?91[-.\s]?)?(?:$$?\d{3,5}$$?[-.\s]?)?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/gi,
    }

    // Indian states for better location detection
    const indianStates = [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Delhi",
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Kolkata",
      "Hyderabad",
      "Pune",
      "Ahmedabad",
      "Surat",
      "Jaipur",
      "Lucknow",
      "Kanpur",
      "Nagpur",
      "Indore",
      "Thane",
      "Bhopal",
      "Visakhapatnam",
      "Pimpri",
      "Patna",
      "Vadodara",
      "Ghaziabad",
      "AP",
      "AR",
      "AS",
      "BR",
      "CG",
      "GA",
      "GJ",
      "HR",
      "HP",
      "JH",
      "KA",
      "KL",
      "MP",
      "MH",
      "MN",
      "ML",
      "MZ",
      "NL",
      "OR",
      "PB",
      "RJ",
      "SK",
      "TN",
      "TS",
      "TR",
      "UP",
      "UK",
      "WB",
    ]

    const fullText = text.toLowerCase()
    const businessNameCandidates = []
    const personNameCandidates = []
    const addressCandidates = []

    // Extract structured data with better logic
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lowerLine = line.toLowerCase()

      // Extract emails
      const emails = line.match(patterns.email)
      if (emails) {
        parsedData.emails.push(...emails.map((email) => email.toLowerCase()))
      }

      // Extract websites
      const websites = line.match(patterns.website)
      if (websites && !parsedData.website) {
        parsedData.website = websites[0]
      }

      // Extract fax numbers (check for fax keyword first)
      if (patterns.fax.test(line)) {
        const faxMatch = line.match(/\d{10,}/g)
        if (faxMatch && !parsedData.fax) {
          parsedData.fax = faxMatch[0]
        }
      }

      // Extract mobile numbers (check for mobile keyword first)
      if (patterns.mobile.test(line)) {
        const mobileMatch = line.match(/\d{10}/g)
        if (mobileMatch && !parsedData.owner[0].mobile) {
          parsedData.owner[0].mobile = mobileMatch[0]
        }
      }

      // Extract landline numbers
      if (patterns.landline.test(line) && !parsedData.lanLine) {
        const landlineMatch = line.match(/\d{10,}/g)
        if (landlineMatch) {
          parsedData.lanLine = landlineMatch[0]
        }
      }

      // Extract general phone numbers if no specific type found
      if (!patterns.fax.test(line) && !patterns.mobile.test(line) && !patterns.landline.test(line)) {
        const phones = line.match(patterns.phone)
        if (phones) {
          const cleanPhone = phones[0].replace(/\D/g, "")
          if (cleanPhone.length === 10) {
            if (!parsedData.owner[0].mobile && !lowerLine.includes("fax")) {
              parsedData.owner[0].mobile = cleanPhone
            } else if (!parsedData.lanLine && !lowerLine.includes("fax") && !lowerLine.includes("mobile")) {
              parsedData.lanLine = cleanPhone
            }
          }
        }
      }

      // Extract ZIP code
      const zipcodeMatch = line.match(patterns.zipcode)
      if (zipcodeMatch && !parsedData.zipcode) {
        parsedData.zipcode = zipcodeMatch[0]
      }

      // Identify business name candidates (first few non-contact lines)
      if (!patterns.email.test(line) && !patterns.phone.test(line) && !patterns.website.test(line)) {
        if (line.length > 2 && line.length < 60 && !patterns.zipcode.test(line) && i < 5) {
          // Exclude lines that look like addresses or person names
          if (
            !/\d+.*(?:street|road|avenue|lane|drive|st|rd|ave|ln|dr)/i.test(line) &&
            !/^(?:mr|mrs|ms|dr|prof)\.?\s/i.test(line)
          ) {
            businessNameCandidates.push({ line, index: i, score: this.calculateBusinessNameScore(line) })
          }
        }
      }

      // Identify person name candidates with better logic
      const titlePatterns =
        /\b(Mr|Mrs|Ms|Dr|CEO|President|Manager|Director|Owner|VP|Vice President|Managing Director|MD|Proprietor)\b/i
      if (titlePatterns.test(line)) {
        const cleanName = line
          .replace(titlePatterns, "")
          .replace(/[^\w\s]/g, "")
          .trim()
        if (cleanName.length > 0 && cleanName.length < 40) {
          personNameCandidates.push({ name: cleanName, score: 10 })
        }
      } else if (this.isLikelyPersonName(line) && i > 0) {
        personNameCandidates.push({ name: line, score: this.calculateNameScore(line) })
      }

      // Extract location information
      for (const state of indianStates) {
        if (line.toLowerCase().includes(state.toLowerCase())) {
          if (state.length > 2) {
            // Full state name
            parsedData.state = state
            // Try to extract city from the same line
            const parts = line.split(",").map((p) => p.trim())
            if (parts.length >= 2) {
              const cityCandidate = parts.find(
                (part) =>
                  !part.toLowerCase().includes(state.toLowerCase()) && !patterns.zipcode.test(part) && part.length > 2,
              )
              if (cityCandidate && !parsedData.city) {
                parsedData.city = cityCandidate
              }
            }
          }
          break
        }
      }

      // Address detection with better logic
      if (
        !parsedData.address &&
        this.isLikelyAddress(line) &&
        !patterns.email.test(line) &&
        !patterns.phone.test(line)
      ) {
        addressCandidates.push({ address: line, score: this.calculateAddressScore(line) })
      }
    }

    // Select best business name
    if (businessNameCandidates.length > 0) {
      businessNameCandidates.sort((a, b) => b.score - a.score)
      parsedData.businessName = businessNameCandidates[0].line
    }

    // Select best person name
    if (personNameCandidates.length > 0) {
      personNameCandidates.sort((a, b) => b.score - a.score)
      parsedData.owner[0].name = personNameCandidates[0].name
    }

    // Select best address
    if (addressCandidates.length > 0) {
      addressCandidates.sort((a, b) => b.score - a.score)
      parsedData.address = addressCandidates[0].address
    }

    // Enhanced business categorization
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
        "programming",
        "systems",
        "solutions",
        "data",
        "cloud",
        "AI",
        "artificial intelligence",
      ],
      Healthcare: [
        "medical",
        "health",
        "doctor",
        "clinic",
        "hospital",
        "dental",
        "pharmacy",
        "wellness",
        "care",
        "medicine",
        "diagnostic",
        "therapy",
        "surgeon",
      ],
      Food: [
        "restaurant",
        "cafe",
        "food",
        "catering",
        "bakery",
        "bar",
        "grill",
        "kitchen",
        "dining",
        "hotel",
        "resort",
        "hospitality",
      ],
      Finance: [
        "bank",
        "financial",
        "insurance",
        "accounting",
        "investment",
        "loan",
        "credit",
        "finance",
        "wealth",
        "advisory",
        "tax",
        "audit",
      ],
      "Real Estate": [
        "real estate",
        "property",
        "realtor",
        "homes",
        "realty",
        "mortgage",
        "construction",
        "builder",
        "developer",
        "housing",
      ],
      Education: [
        "school",
        "education",
        "training",
        "academy",
        "university",
        "college",
        "learning",
        "institute",
        "coaching",
        "tutorial",
      ],
      Retail: ["store", "shop", "retail", "boutique", "market", "sales", "shopping", "mall", "showroom", "outlet"],
      Services: [
        "service",
        "consulting",
        "repair",
        "maintenance",
        "cleaning",
        "professional",
        "agency",
        "firm",
        "company",
      ],
      Manufacturing: [
        "manufacturing",
        "factory",
        "production",
        "industrial",
        "machinery",
        "equipment",
        "tools",
        "engineering",
      ],
      Automobile: [
        "auto",
        "car",
        "vehicle",
        "automotive",
        "garage",
        "service center",
        "dealership",
        "spare parts",
        "mechanic",
      ],
    }

    // Categorize business with scoring
    let bestCategory = ""
    let bestScore = 0

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const matchedKeywords = keywords.filter((keyword) => fullText.includes(keyword.toLowerCase()))
      const score = matchedKeywords.length

      if (score > bestScore) {
        bestScore = score
        bestCategory = category
        parsedData.tags = [...new Set([...parsedData.tags, ...matchedKeywords])]
      }
    }

    if (bestCategory) {
      parsedData.category = [bestCategory]
    }

    // Clean up and validate data
    parsedData.emails = [...new Set(parsedData.emails.filter((email) => email && email.includes("@")))]
    parsedData.tags = [...new Set(parsedData.tags.filter((tag) => tag && tag.length > 2))]

    // Ensure arrays have at least one item for form compatibility
    if (parsedData.emails.length === 0) parsedData.emails = [""]
    if (parsedData.category.length === 0) parsedData.category = [""]
    if (parsedData.subCategory.length === 0) parsedData.subCategory = [""]
    if (parsedData.tags.length === 0) parsedData.tags = [""]

    // Clean up owner mobile number
    if (parsedData.owner[0].mobile) {
      parsedData.owner[0].mobile = parsedData.owner[0].mobile.replace(/\D/g, "")
      if (parsedData.owner[0].mobile.length !== 10) {
        parsedData.owner[0].mobile = ""
      }
    }

    return parsedData
  }

  // Helper methods for better text analysis
  calculateBusinessNameScore(line) {
    let score = 0

    // Prefer lines with certain business indicators
    if (
      /\b(ltd|limited|inc|incorporated|corp|corporation|llc|pvt|private|company|co|enterprises|group|solutions|services|systems)\b/i.test(
        line,
      )
    ) {
      score += 5
    }

    // Prefer shorter lines (likely to be business names)
    if (line.length < 30) score += 3
    if (line.length < 20) score += 2

    // Avoid lines with numbers (likely addresses or phones)
    if (!/\d/.test(line)) score += 2

    return score
  }

  calculateNameScore(line) {
    let score = 0

    // Prefer 2-3 words (typical name structure)
    const words = line.split(/\s+/)
    if (words.length >= 2 && words.length <= 3) score += 3

    // Prefer proper case
    if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(line)) score += 2

    // Avoid lines with numbers or special characters
    if (!/[\d@#$%^&*()_+=[\]{}|\\:";'<>?,./]/.test(line)) score += 2

    return score
  }

  isLikelyPersonName(line) {
    const words = line.split(/\s+/)
    return words.length >= 2 && words.length <= 4 && /^[A-Za-z\s.]+$/.test(line) && line.length < 40 && line.length > 3
  }

  calculateAddressScore(line) {
    let score = 0

    // Look for address indicators
    if (/\b(street|road|avenue|lane|drive|st|rd|ave|ln|dr|plot|house|building|floor|sector|block)\b/i.test(line)) {
      score += 5
    }

    // Prefer lines with numbers (house numbers, etc.)
    if (/\d/.test(line)) score += 2

    // Prefer longer lines (addresses tend to be longer)
    if (line.length > 20) score += 1

    return score
  }

  isLikelyAddress(line) {
    return (
      /\d/.test(line) &&
      line.length > 10 &&
      !/^[\d\s-]+$/.test(line) && // Not just numbers
      !/@/.test(line)
    ) // Not an email
  }
}

export default new OCRService()
