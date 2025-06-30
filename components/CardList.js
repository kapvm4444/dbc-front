import Link from "next/link"
import { MapPin, Phone, Mail, Users } from "lucide-react"

export default function CardList({ cards }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or add some cards.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Link key={card.id} href={`/cards/${card.id}`}>
          <div className="card p-6 cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={card.frontImage || "/placeholder.svg"}
                  alt={`${card.businessName} business card`}
                  className="w-full md:w-48 h-32 object-cover rounded-lg bg-gray-100"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{card.businessName}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{card.address}</p>
                        <p className="text-sm">
                          {card.city}, {card.state} {card.zipcode}
                        </p>
                        <p className="text-sm">{card.country}</p>
                      </div>
                    </div>

                    {card.owner.length > 0 && (
                      <div className="flex items-start text-gray-600">
                        <Users className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          {card.owner.map((owner, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium">{owner.name}</p>
                              {owner.mobile && (
                                <p>
                                  {owner.dialCode} {owner.mobile}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {card.lanLine && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">Landline: {card.lanLine}</span>
                      </div>
                    )}

                    {card.emails.length > 0 && (
                      <div className="flex items-start text-gray-600">
                        <Mail className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          {card.emails.map((email, index) => (
                            <p key={index} className="text-sm">
                              {email}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {card.fax && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">Fax: {card.fax}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    {card.tags.map((tag, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
