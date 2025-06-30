"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dummyCards } from "@/data/dummyData";
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
      setTimeout(() => {
        setCards(dummyCards);
        setFilteredCards(dummyCards);
        setLoading(false);
      }, 1000);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);

            const cardsWithDistance = dummyCards.map((card) => ({
              ...card,
              distance: Math.sqrt(
                Math.pow(card.latitude - location.latitude, 2) +
                  Math.pow(card.longitude - location.longitude, 2),
              ),
            }));

            const nearest = cardsWithDistance
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 3);
            setNearestCards(nearest);
          },
          (error) => {
            console.log("Location access denied:", error);
            setNearestCards(dummyCards.slice(0, 3));
          },
        );
      } else {
        setNearestCards(dummyCards.slice(0, 3));
      }
    }
  }, [user]);

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
          <section>
            <div className="flex items-center mb-4">
              {userLocation ? (
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {userLocation ? "Nearest Cards" : "Recently Added Cards"}
              </h2>
            </div>
            <CardGrid cards={nearestCards} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Card Locations
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <MapView cards={filteredCards} userLocation={userLocation} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              All Cards ({filteredCards.length})
            </h2>
            <CardGrid cards={filteredCards} />
          </section>
        </div>
      )}
    </div>
  );
}
