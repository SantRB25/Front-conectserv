"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
}

declare global {
  interface Window {
    google: any
  }
}

// Definir las bibliotecas como una constante fuera del componente
// para evitar recreaciones del array en cada renderizado
const libraries = ["places"]

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: -25.2637399,
    lng: -57.575926,
  }) // Asunción, Paraguay

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as any,
  })

  const updateAddress = useCallback((latLng: google.maps.LatLng) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      { location: latLng },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === "OK" && results?.[0]) {
          setAddress(results[0].formatted_address)
        }
      },
    )
  }, [])

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
      setLocation(newLocation)
      updateAddress(event.latLng)
    }
  }

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      }
      setLocation(newLocation)
      updateAddress(event.latLng)
    }
  }

  const handleConfirm = () => {
    onLocationSelect({
      lat: location.lat,
      lng: location.lng,
      address: address,
    })
    setOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault() // Prevenir el comportamiento predeterminado del formulario

    if (searchQuery.trim() === "" || !isLoaded) return

    setIsSearching(true)

    // Usar el servicio de geocodificación para buscar la dirección
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      { address: searchQuery },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === "OK" && results && results[0]) {
          const { location } = results[0].geometry
          const newLocation = {
            lat: location.lat(),
            lng: location.lng(),
          }
          setLocation(newLocation)
          setAddress(results[0].formatted_address)
        } else {
          alert("No se encontró la ubicación. Intenta con otra búsqueda.")
        }
        setIsSearching(false)
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="location-picker-trigger" variant="outline">
          Seleccionar ubicación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Selecciona tu ubicación</DialogTitle>
        </DialogHeader>

        {isLoaded ? (
          <>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ubicación (ej: Asunción, Paraguay)"
                className="flex-1"
                disabled={isSearching}
              />
              <Button type="submit" size="icon" disabled={isSearching}>
                {isSearching ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>

            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={location}
              zoom={15}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker position={location} draggable={true} onDragEnd={handleMarkerDragEnd} />
            </GoogleMap>
          </>
        ) : (
          <div className="flex items-center justify-center h-[400px] bg-muted">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Cargando mapa...</p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium mb-1 block">Dirección exacta:</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Dirección seleccionada"
            className="mb-4"
          />
          <Button onClick={handleConfirm} className="w-full">
            Confirmar ubicación
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

