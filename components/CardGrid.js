import Link from "next/link";
import { MapPin, Phone, Mail, Users } from "lucide-react";

export default function CardGrid({ cards }) {
  if (!cards || cards.length === 0) {
    return (
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
        <p className="text-gray-500">
          Try adjusting your search criteria or add some cards.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Link key={card._id} href={`/cards/${card._id}`}>
          <div className="card p-6 cursor-pointer">
            <div className="mb-4">
              <img
                src={
                  card.frontImage
                    ? `https://dbcapi.khush.pro/images/${card.frontImage}`
                    : "/placeholder.svg"
                }
                alt={`${card.businessName} business card`}
                className="w-full h-32 object-cover rounded-lg bg-gray-100"
              />
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {card.businessName}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {card.category.slice(0, 2).map((cat, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {card.city}, {card.state}
                </span>
              </div>

              <div className="space-y-1">
                {card.owner.length > 0 && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {card.owner[0].name}
                      {card.owner.length > 1 &&
                        ` +${card.owner.length - 1} more`}
                    </span>
                  </div>
                )}

                {card.owner[0]?.mobile && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>
                      {card.owner[0].dialCode} {card.owner[0].mobile}
                    </span>
                  </div>
                )}

                {card.emails.length > 0 && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{card.emails[0]}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {card.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {card.tags.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    +{card.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
