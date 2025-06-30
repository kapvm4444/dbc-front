"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import {
  MapPin,
  Phone,
  Mail,
  Users,
  Edit,
  Trash2,
  Heart,
  Share2,
  ArrowLeft,
  Building,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function CardDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (user && params.id) {
      fetchCardDetails();
    }
  }, [user, params.id]);

  const fetchCardDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://dbcapi.khush.pro/api/v1/cards/${params.id}`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setCard(result.data);
        // Check if card is in user's favorites
        setIsFavorite(user.favorites?.includes(result.data._id) || false);
      } else {
        console.error("Failed to fetch card:", result.message);
        setCard(null);
      }
    } catch (error) {
      console.error("Error fetching card:", error);
      setCard(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        const response = await fetch(
          `https://dbcapi.khush.pro/api/v1/cards/${card._id}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (response.ok) {
          alert("Card deleted successfully!");
          router.push("/cards");
        } else {
          const result = await response.json();
          alert(`Failed to delete card: ${result.message}`);
        }
      } catch (error) {
        console.error("Error deleting card:", error);
        alert("Failed to delete card. Please try again.");
      }
    }
  };

  const handleFavorite = async () => {
    if (favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      const response = await fetch(
        `https://dbcapi.khush.pro/api/v1/cards/add-favorite/${card._id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setIsFavorite(!isFavorite);
        // Update user favorites in context if needed
      } else {
        console.error("Failed to toggle favorite:", result.message);
        alert(`Failed to ${isFavorite ? "remove from" : "add to"} favorites`);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorites. Please try again.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.businessName,
          text: `Check out ${card.businessName} business card`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view card details
          </h1>
          <Link href="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Card not found
          </h1>
          <Link href="/cards" className="btn-primary">
            Back to Cards
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

        <div className="flex items-center space-x-2">
          <button
            onClick={handleFavorite}
            disabled={favoriteLoading}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? "text-red-600 bg-red-50 hover:bg-red-100"
                : "text-gray-400 hover:text-red-600 hover:bg-red-50"
            } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Front</h3>
            <img
              src={
                card.frontImage
                  ? `https://dbcapi.khush.pro/images/${card.frontImage}`
                  : "/placeholder.svg"
              }
              alt={`${card.businessName} front`}
              className="w-full h-48 object-cover rounded-lg bg-white shadow-sm"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Back</h3>
            <img
              src={
                card.backImage
                  ? `https://dbcapi.khush.pro/images/${card.backImage}`
                  : "/placeholder.svg"
              }
              alt={`${card.businessName} back`}
              className="w-full h-48 object-cover rounded-lg bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {card.businessName}
              </h1>
              <div className="flex flex-wrap gap-2">
                {card.category.map((cat, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Address
                </h3>
                <div className="text-gray-700 space-y-1">
                  <p>{card.address}</p>
                  <p>
                    {card.city}, {card.state} {card.zipcode}
                  </p>
                  <p>{card.country}</p>
                  {card.latitude && card.longitude && (
                    <p className="text-sm text-gray-500">
                      Coordinates: {card.latitude}, {card.longitude}
                    </p>
                  )}
                </div>
              </div>

              {card.owner.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Contacts
                  </h3>
                  <div className="space-y-3">
                    {card.owner.map((owner, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-900">
                          {owner.name}
                        </p>
                        {owner.mobile && (
                          <p className="text-gray-600 text-sm">
                            Mobile: {owner.dialCode} {owner.mobile}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Phone Numbers
                </h3>
                <div className="space-y-2">
                  {card.lanLine && (
                    <div className="flex items-center text-gray-700">
                      <span className="text-sm font-medium w-20">
                        Landline:
                      </span>
                      <span>{card.lanLine}</span>
                    </div>
                  )}
                  {card.fax && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium w-16">Fax:</span>
                      <span>{card.fax}</span>
                    </div>
                  )}
                </div>
              </div>

              {card.emails.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Email Addresses
                  </h3>
                  <div className="space-y-2">
                    {card.emails.map((email, index) => (
                      <div key={index} className="text-gray-700">
                        <a
                          href={`mailto:${email}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {card.subCategory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-600" />
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {card.subCategory.map((subCat, index) => (
                      <span
                        key={index}
                        className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                      >
                        {subCat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {card.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-600" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Link
              href={`/cards/${card._id}/edit`}
              className="btn-primary flex items-center justify-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Card
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
