"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "../components/SearchBar";
import CardGrid from "../components/CardGrid";
import MapView from "../components/MapView";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { MapPin, Clock } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCards, setNearestCards] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserCards();
      getUserLocation();
    }
  }, [user]);

  const fetchUserCards = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://dbcapi.khush.pro/api/v1/cards/user-cards",
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setCards(result.data);
        setFilteredCards(result.data);

        // Calculate nearest cards if user location is available
        if (userLocation) {
          calculateNearestCards(result.data);
        } else {
          // Show most recent cards if no location
          setNearestCards(result.data.slice(0, 3));
        }
      } else {
        console.error("Failed to fetch cards:", result.message);
        setCards([]);
        setFilteredCards([]);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
      setFilteredCards([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);

          // Recalculate nearest cards with location
          if (cards.length > 0) {
            calculateNearestCards(cards);
          }
        },
        (error) => {
          console.log("Location access denied:", error);
          // Use most recent cards as fallback
          setNearestCards(cards.slice(0, 3));
        },
      );
    } else {
      setNearestCards(cards.slice(0, 3));
    }
  };

  const calculateNearestCards = (cardsList) => {
    if (!userLocation) {
      setNearestCards(cardsList.slice(0, 3));
      return;
    }

    const cardsWithDistance = cardsList
      .filter((card) => card.latitude && card.longitude)
      .map((card) => ({
        ...card,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          card.latitude,
          card.longitude,
        ),
      }));

    const nearest = cardsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    setNearestCards(nearest);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleSearch = (searchTerm, filters) => {
    let filtered = cards;

    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ||
          card.category.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase()),
          ) ||
          card.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.owner.some((owner) =>
            owner.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (filters.category) {
      filtered = filtered.filter((card) =>
        card.category.includes(filters.category),
      );
    }

    if (filters.city) {
      filtered = filtered.filter(
        (card) => card.city.toLowerCase() === filters.city.toLowerCase(),
      );
    }

    setFilteredCards(filtered);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Business Card Manager
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your business cards digitally with OCR and location-based
            search
          </p>
          <a href="/login" className="btn-primary text-lg px-8 py-3">
            Get Started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-8">
          {nearestCards.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                {userLocation ? (
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                )}
                <h2 className="text-2xl font-bold text-gray-900">
                  {userLocation ? "Nearest Cards" : "Recent Cards"}
                </h2>
              </div>
              <CardGrid cards={nearestCards} />
            </section>
          )}

          {filteredCards.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Card Locations
              </h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <MapView cards={filteredCards} userLocation={userLocation} />
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              My Cards ({filteredCards.length})
            </h2>
            {filteredCards.length > 0 ? (
              <CardGrid cards={filteredCards} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No cards found
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by adding your first business card.
                </p>
                <a href="/cards/add" className="btn-primary">
                  Add Your First Card
                </a>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
