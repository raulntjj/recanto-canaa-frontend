'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface ContactMapProps {
  lat: number
  lng: number
  name: string
}

export default function ContactMap({ lat, lng, name }: ContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    // Fix for React 18 Strict Mode and Hot Reloading: 
    // Always clean up existing instances and stale DOM states
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }
    const node = mapRef.current
    if (node && (node as any)._leaflet_id) {
      ;(node as any)._leaflet_id = null
    }

    const map = L.map(node).setView([lat, lng], 14)
    mapInstanceRef.current = map

    map.scrollWheelZoom.disable()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    const customIcon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)

    marker.bindPopup(`
      <div class="text-center font-sans">
        <strong>${name}</strong>
        <br />
        <span class="text-sm text-gray-600">Córrego Ferrugem, Caratinga - MG</span>
        <br />
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-blue-600 hover:underline inline-block mt-1"
        >
          Traçar rota
        </a>
      </div>
    `)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lng, name])

  return (
    <div 
      ref={mapRef} 
      className="rounded-xl"
      style={{ height: '400px', width: '100%', zIndex: 10 }}
    />
  )
}
