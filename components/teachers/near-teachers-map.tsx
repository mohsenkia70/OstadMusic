"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Star, ShieldCheck, MapPin, Clock, Award } from "lucide-react";
import type { TeacherListItem } from "@/lib/api/types";


// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});



const createUserIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #d4a84b, #e0b85c);
        border: 3px solid #1a160f;
        border-radius: 50%;
        box-shadow: 0 0 0 6px rgba(212,168,75,0.3), 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #1a160f;
        font-weight: bold;
      ">
        من
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });



const createTeacherIcon = (isVerified: boolean, imageUrl?: string | null) => {
  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />`
    : `<div style="
        width: 100%; 
        height: 100%; 
        background: ${isVerified ? 'linear-gradient(135deg, #d4a84b, #c9952e)' : '#3d3830'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1a160f;
        font-size: 16px;
        font-weight: bold;
      ">${isVerified ? '✓' : '?'}</div>`;

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 44px;
        height: 44px;
        background: ${isVerified ? 'linear-gradient(135deg, #d4a84b, #c9952e)' : '#2a2520'};
        border: 3px solid #1a160f;
        border-radius: 50%;
        padding: 3px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 0 4px rgba(212,168,75,${isVerified ? '0.3' : '0.1'});
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      ">
        ${imageHtml}
        ${isVerified ? `
          <div style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            background: #d4a84b;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            border: 2px solid #1a160f;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            color: #1a160f;
          ">✓</div>
        ` : ''}
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
};



function FlyToLocation({ 
  lat, 
  lng, 
  zoom = 14 
}: { 
  lat: number; 
  lng: number; 
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [lat, lng, zoom, map]);

  return null;
}



function TeacherPopupContent({ teacher }: { teacher: TeacherListItem }) {
  const [imageError, setImageError] = useState(false);

  const getInitials = () => {
    const names = teacher.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return teacher.fullName.slice(0, 2);
  };

  const bioText = teacher.bioShort || teacher.resume || 'بدون توضیحات';
  const truncatedBio = bioText.length > 120 
    ? bioText.slice(0, 120) + '...' 
    : bioText;

  return (
    <div className="w-[280px] max-w-[90vw] bg-[#1a160f] text-[#f5f0e6] p-3 rounded-xl">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative shrink-0">
          {teacher.profileImage && !imageError ? (
            <img
              src={teacher.profileImage}
              alt={teacher.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold/40"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold font-bold text-xl">
              {getInitials()}
            </div>
          )}
          {teacher.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-0.5 border-2 border-[#1a160f]">
              <ShieldCheck className="w-4 h-4 text-[#1a160f]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base leading-tight text-[#f5f0e6] truncate">
            {teacher.fullName}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
            <MapPin className="w-3 h-3" />
            <span className="truncate">
              {teacher.city}
              {teacher.district ? `، ${teacher.district}` : ''}
            </span>
          </div>
          {teacher.distanceKm != null && (
            <div className="flex items-center gap-1.5 text-xs text-gold/70 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{teacher.distanceKm.toFixed(1)} کیلومتر فاصله</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs">
        {teacher.yearsOfExperience > 0 && (
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-gold" />
            <span>{teacher.yearsOfExperience} سال تجربه</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
          <span>
            {teacher.ratingCount > 0 
              ? `${teacher.ratingAverage.toFixed(1)} (${teacher.ratingCount})`
              : 'بدون امتیاز'
            }
          </span>
        </div>
      </div>

      {teacher.categories && teacher.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {teacher.categories.slice(0, 3).map((cat, index) => (
            <span 
              key={index}
              className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold/80"
            >
              {cat}
            </span>
          ))}
          {teacher.categories.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface/50 text-muted">
              +{teacher.categories.length - 3}
            </span>
          )}
        </div>
      )}

      {truncatedBio && (
        <div className="mb-3 p-2 rounded-lg bg-surface/30 border border-line/20">
          <p className="text-xs text-muted leading-relaxed">
            {truncatedBio}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-line/30">
        <div>
          <p className="text-sm font-bold text-gold">
            {teacher.hourlyRate.toLocaleString("fa-IR")} تومان
          </p>
          <p className="text-[10px] text-muted">هر جلسه</p>
        </div>
        <Link
          href={`/teachers/${teacher.teacherProfileId}`}
          target="_blank"
          className="text-xs font-semibold bg-gold text-[#1a160f] px-4 py-1.5 rounded-lg hover:brightness-110 transition"
        >
          مشاهده پروفایل
        </Link>
      </div>
    </div>
  );
}



type Props = {
  userLat: number;
  userLng: number;
  teachers: TeacherListItem[];
  focusedTeacherId?: string | null;
  onMarkerClick?: (id: string) => void;
};

export function NearTeachersMap({
  userLat,
  userLng,
  teachers,
  focusedTeacherId,
  onMarkerClick,
}: Props) {
  const teachersWithCoords = useMemo(
    () =>
      teachers.filter(
        (t) =>
          t.latitude != null &&
          t.longitude != null &&
          !isNaN(t.latitude) &&
          !isNaN(t.longitude)
      ),
    [teachers]
  );

  const focusedTeacher = useMemo(
    () => teachersWithCoords.find((t) => t.teacherProfileId === focusedTeacherId),
    [teachersWithCoords, focusedTeacherId]
  );


  const center: [number, number] = [userLat || 35.6892, userLng || 51.389];
  

  const zoom = focusedTeacher ? 16 : 13;

  console.log(`📍 نقشه: ${teachersWithCoords.length} استاد با مختصات`);

  return (
    <div className="h-full w-full min-h-[420px] rounded-2xl overflow-hidden border border-line/60 shadow-inner bg-bg-2">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

   
        {userLat && userLng && (
          <>
            <Marker position={[userLat, userLng]} icon={createUserIcon()}>
              <Popup>
                <div className="text-center py-1">
                  <p className="font-semibold text-gold text-sm">📍 موقعیت شما</p>
                  <p className="text-xs text-muted mt-0.5">شما اینجا هستید</p>
                </div>
              </Popup>
            </Marker>
            <FlyToLocation lat={userLat} lng={userLng} zoom={zoom} />
          </>
        )}

        {teachersWithCoords.map((teacher) => (
          <Marker
            key={teacher.teacherProfileId}
            position={[teacher.latitude!, teacher.longitude!]}
            icon={createTeacherIcon(!!teacher.isVerified, teacher.profileImage)}
            eventHandlers={{
              click: () => onMarkerClick?.(teacher.teacherProfileId),
            }}
          >
            <Popup className="custom-teacher-popup">
              <TeacherPopupContent teacher={teacher} />
            </Popup>
          </Marker>
        ))}


        {focusedTeacher && focusedTeacher.latitude && focusedTeacher.longitude && (
          <FlyToLocation 
            lat={focusedTeacher.latitude} 
            lng={focusedTeacher.longitude} 
            zoom={16}
          />
        )}
      </MapContainer>
    </div>
  );
}