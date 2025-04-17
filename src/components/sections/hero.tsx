"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, type Service } from "@/lib/api";
import { useRouter } from "next/navigation";

export function Hero() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await api.services.list();
        setServices(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(
          "No se pudieron cargar los servicios. Por favor, intente nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      router.push(`/solicitar?query=${encodeURIComponent(searchQuery)}`);
    } else if (selectedService) {
      router.push(`/solicitar?service=${selectedService}`);
    } else {
      router.push("/solicitar");
    }
  };

  const handleServiceClick = (serviceId: string) => {
    router.push(`/solicitar?service=${serviceId}`);
  };

  return (
    <section className="py-16 md:py-24 bg-[#0058A2] text-white">
      <Container className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Encuentra expertos de confianza
        </h1>
        <p className="text-lg mb-10 max-w-3xl mx-auto opacity-90">
          Obtén una estimación del servicio que necesitas. Contacta gratis con
          profesionales verificados.
        </p>

        <div className="max-w-2xl mx-auto mb-8 flex">
          <Select value={selectedService} onValueChange={setSelectedService} >
            <SelectTrigger className="flex-grow rounded-l-full rounded-r-none border-0 h-14 text-gray-800 bg-white">
              <SelectValue placeholder="¿Qué tipo de servicio buscas?" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  Cargando servicios...
                </SelectItem>
              ) : error ? (
                <SelectItem value="error" disabled>
                  {error}
                </SelectItem>
              ) : (
                services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.nombre}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <button
            onClick={handleSearch}
            className="bg-[#FF6B0B] hover:bg-[#e55f00] text-white font-medium py-4 px-8 rounded-r-full transition-colors h-14"
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-white opacity-80">Cargando servicios...</div>
          ) : error ? (
            <div className="text-white opacity-80">{error}</div>
          ) : (
            services.slice(0, 6).map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id.toString())}
                className="bg-white text-[#0058A2] py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                {service.nombre}
              </button>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
