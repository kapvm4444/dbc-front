"use client"
import { useEffect, useRef } from "react"

export default function MapView({ cards, userLocation }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== "undefined") {
        const L = (await import("leaflet")).default

        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        if (mapRef.current && !mapInstanceRef.current) {
          const map = L.map(mapRef.current).setView([40.7128, -74.006], 4)

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map)

          mapInstanceRef.current = map

          if (userLocation) {
            const userIcon = L.divIcon({
              html: '<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>',
              className: "custom-div-icon",
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })

            L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
              .addTo(map)
              .bindPopup("Your Location")
          }

          cards.forEach((card) => {
            if (card.latitude && card.longitude) {
              const cardIcon = L.divIcon({
                html: '<div class="bg-red-500 w-3 h-3 rounded-full border border-white shadow-md"></div>',
                className: "custom-div-icon",
                iconSize: [12, 12],
                iconAnchor: [6, 6],
              })

              L.marker([card.latitude, card.longitude], { icon: cardIcon })
                .addTo(map)
                .bindPopup(`
                  <div class="p-2">
                    <h3 class="font-semibold text-sm">${card.businessName}</h3>
                    <p class="text-xs text-gray-600">${card.address}</p>
                    <p class="text-xs text-gray-600">${card.city}, ${card.state}</p>
                  </div>
                `)
            }
          })

          if (cards.length > 0) {
            const group = new L.featureGroup(
              cards
                .filter((card) => card.latitude && card.longitude)
                .map((card) => L.marker([card.latitude, card.longitude])),
            )

            if (userLocation) {
              group.addLayer(L.marker([userLocation.latitude, userLocation.longitude]))
            }

            if (group.getLayers().length > 0) {
              map.fitBounds(group.getBounds().pad(0.1))
            }
          }
        }
      }
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [cards, userLocation])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 w-full rounded-lg" />
      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-md text-xs">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Business Cards</span>
        </div>
      </div>
    </div>
  )
}
