"use client";

import { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Card, CardFooter, Image, Button } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const fruitStores = [
  { id: 1, name: "هایپر میوه ترش و شیرین", lat: 36.55954029702855, lng: 53.07897197982621, src:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK1jDVM28VZP_80WHZw2hxPaiNUzVEdYLLKA&s' },
  { id: 2, name: "بهشت میوه", lat: 36.56693009730929, lng: 53.08007696633475, src:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFKrkD-omxOZ927lUUpcepC5HuKiiut_dTkw&s' },
  { id: 3, name: "میوه فروشی شاهپسند", lat: 36.56019228716179, lng: 53.07945178538427 },
  { id: 4, name: "میوه فروشی آبی", lat: 36.561, lng: 53.059 },
];

const containerStyle = {
  width: "100%",
  height: "500px",
};

export default function FruitStoresMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: fruitStores[0].lat, lng: fruitStores[0].lng });

  if (!isLoaded) return <p>در حال بارگذاری نقشه...</p>;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* نقشه */}
      <div className="w-full rounded-xl overflow-hidden shadow-lg">
        <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={14}>
          {fruitStores.map((store) => (
            <Marker
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
              onClick={() => setSelectedStore(store.id)}
            >
              {selectedStore === store.id && (
                <InfoWindow onCloseClick={() => setSelectedStore(null)}>
                  <div className="font-semibold text-black">{store.name}</div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </div>

      {/* اسلایدر فروشگاه‌ها */}
      <div className="p-4 bg-black rounded-xl shadow text-white">
        <h2 className="text-2xl font-bold mb-4 text-right">لیست میوه‌فروشی‌های نزدیک شما</h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={20}
          loop
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {fruitStores.map((store) => (
            <SwiperSlide key={store.id}>
              <Card
                isFooterBlurred
                className="border-none cursor-pointer hover:scale-[1.05] transition-all duration-300"
                radius="lg"
              >
                <p className="text-sm absolute top-1 right-1 z-10 text-black font-bold">{store.name}</p>
                <Image
                  alt={store.name}
                  className="object-cover w-full"
                  height={200}
                  width={300}
                  src={store?.src ? store.src : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPEYJOYeIHwpB4FTukdlXfMWKaD3aTo3wfrg&s'}
                />
                <CardFooter className="justify-end before:bg-white/10 border-white/20 border-1 py-1 absolute bottom-1 w-[calc(100%-8px)] rounded-large ml-1 shadow-small flex justify-between items-center">
                  <span className="text-xs text-white">{store.name}</span>
                  <Button
                    className="text-xs text-white bg-black/20"
                    radius="lg"
                    size="sm"
                    onPress={() => {
                      // وقتی کلیک شد، نقشه به آن فروشگاه حرکت کند و InfoWindow باز شود
                      setMapCenter({ lat: store.lat, lng: store.lng });
                      setSelectedStore(store.id);
                    }}
                  >
                    مشاهده روی نقشه
                  </Button>
                </CardFooter>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
