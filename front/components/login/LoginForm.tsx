"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, User, Github, Chrome } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// // --- Dynamic imports for React-Leaflet ---
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );
// const Popup = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Popup),
//   { ssr: false }
// );
// import { useMapEvents } from "react-leaflet";

// --- SVG Icon for Marker ---
// const svgIcon = L.divIcon({
//   className: "custom-svg-icon",
//   html: `
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
//       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
//     </svg>
//   `,
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// --- LocationMarker Component ---
// function LocationMarker({ position, setPosition }:any) {
//   useMapEvents({
//     click(e) {
//       setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
//     },
//   });

//   if (!position) return null;

//   return (
//     <Marker position={[position.lat, position.lng]} icon={svgIcon}>
//       <Popup>اینجا مکان شماست!</Popup>
//     </Marker>
//   );
// }

// --- Main Component ---
export default function ModernLoginMap() {
  const router = useRouter();
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      latitude?: number;
      longitude?: number;
    }) =>
      axios.post("http://localhost:3001/api/users", data),
    onSuccess: () => router.push("/"),
  });

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", latitude: undefined, longitude: undefined },
    onSubmit: ({ value }) =>
      mutate({ ...value, latitude: position?.lat, longitude: position?.lng }),
  });

  const defaultCenter = { lat: 35.7, lng: 51.4 };

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );
  }
}, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-white/20 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/30"
      >
        <h1 className="text-white text-3xl font-extrabold text-center mb-6">
          ثبت نام / ورود
        </h1>

        {/* Social Login */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-white/90 hover:bg-white text-gray-800 py-2.5 rounded-xl font-semibold shadow transition"
          >
            <Chrome size={18} /> ورود با Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-semibold shadow transition"
          >
            <Github size={18} /> ورود با GitHub
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-white/40" />
          <span className="px-3 text-white/80 text-sm">یا</span>
          <div className="flex-grow h-px bg-white/40" />
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* Name */}
          <form.Field
            name="name"
            validators={{ onChange: ({ value }) => (!value ? "نام الزامی است" : undefined) }}
            children={(field) => (
              <div>
                <label className="text-white text-sm">نام</label>
                <div className="flex items-center gap-2 bg-white/30 text-white px-3 py-2 rounded-xl border border-white/40 focus-within:border-white transition">
                  <User size={18} />
                  <input
                    type="text"
                    className="bg-transparent focus:outline-none flex-1 text-white placeholder-white/60"
                    placeholder="نام خود را وارد کنید"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-200 text-xs mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          {/* Email */}
          <form.Field
            name="email"
            validators={{ onChange: ({ value }) => (!value ? "ایمیل الزامی است" : undefined) }}
            children={(field) => (
              <div>
                <label className="text-white text-sm">ایمیل</label>
                <div className="flex items-center gap-2 bg-white/30 text-white px-3 py-2 rounded-xl border border-white/40 focus-within:border-white transition">
                  <Mail size={18} />
                  <input
                    type="email"
                    className="bg-transparent focus:outline-none flex-1 text-white placeholder-white/60"
                    placeholder="example@gmail.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-200 text-xs mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          {/* Password */}
          <form.Field
            name="password"
            validators={{ onChange: ({ value }) => (!value ? "رمز عبور الزامی است" : undefined) }}
            children={(field) => (
              <div>
                <label className="text-white text-sm">رمز عبور</label>
                <div className="flex items-center gap-2 bg-white/30 text-white px-3 py-2 rounded-xl border border-white/40 focus-within:border-white transition">
                  <Lock size={18} />
                  <input
                    type="password"
                    className="bg-transparent focus:outline-none flex-1 text-white placeholder-white/60"
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-200 text-xs mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          {/* Map */}
          {/* <div>
            <label className="text-white text-sm">مکان خود را روی نقشه انتخاب کنید</label>
            <div className="w-full h-64 mt-2 rounded-xl overflow-hidden border border-white/40">
             <MapContainer
  center={position ? [position.lat, position.lng] : [defaultCenter.lat, defaultCenter.lng]}
  zoom={13}
  scrollWheelZoom
  style={{ height: "100%", width: "100%" }}
>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-white/30 hover:bg-white/40 text-white py-3 rounded-xl font-bold transition border border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={18} /> {isPending ? "در حال ارسال..." : "ثبت نام / ورود"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
