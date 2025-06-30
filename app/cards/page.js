"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dummyCards } from "@/data/dummyData";
import CardGrid from "../../components/CardGrid";
import CardList from "../../components/CardList";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { Grid, List, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function CardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://dbcapi.khush.pro/api/v1/cards/user-cards/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This ensures cookies are sent/received
        },
      );

      const data = await res.json();
      console.log(data);
      setCards(data.data);
      setFilteredCards(data.data);
      setLoading(false);
    }
    fetchData();

    /*if (user) {
      setTimeout(() => {
        setCards(dummyCards);
        setFilteredCards(dummyCards);
        setLoading(false);
      }, 1000);
    }*/
  }, [user]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(
        (card) =>
          card.businessName.toLowerCase().includes(term.toLowerCase()) ||
          card.tags.some((tag) =>
            tag.toLowerCase().includes(term.toLowerCase()),
          ) ||
          card.category.some((cat) =>
            cat.toLowerCase().includes(term.toLowerCase()),
          ) ||
          card.city.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredCards(filtered);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your cards
          </h1>
          <Link href="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Business Cards
          </h1>
          <p className="text-gray-600 mt-1">
            {loading ? "Loading..." : `${filteredCards.length} cards found`}
          </p>
        </div>
        <Link
          href="/cards/add"
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Card
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your cards..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : viewMode === "grid" ? (
        <CardGrid cards={filteredCards} />
      ) : (
        <CardList cards={filteredCards} />
      )}
    </div>
  );
}
