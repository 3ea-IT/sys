import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, LoaderCircle, MapPin, RefreshCw, Search, Users, UtensilsCrossed, XCircle } from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

function listValue(value) {
  if (typeof value === "string") {
    try { value = JSON.parse(value); } catch { return parseTextValue(value); }
  }
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  if (typeof value.text === "string") return parseTextValue(value.text);
  for (const key of ["restaurants", "restaurantList", "results", "items", "data"]) {
    const found = listValue(value[key]);
    if (found.length) return found;
  }
  return [];
}

function parseTextValue(text) {
  if (text.includes("Slots for") || text.includes("slotId=")) return parseSlotText(text);
  return parseRestaurantText(text);
}

function parseRestaurantText(text) {
  return text.split("\n").flatMap((line) => {
    const match = line.match(/^\s*\d+\.\s+(.+?)\s+\(ID:\s*([\w-]+)\)/);
    if (!match) return [];
      const details = match[1].split(/\s+[\u2014-]\s+/);
    const name = details[0].trim();
    const metadata = details[1] || "";
    const locationMatch = metadata.match(/\|\s*([^|]+)$/);
    return [{ id: match[2], restaurantId: match[2], name, description: metadata, locality: locationMatch?.[1]?.trim() || "" }];
  });
}

function parseSlotText(text) {
  const itemId = text.match(/itemId[=:]\s*["']?([\w-]+)/)?.[1] || "";
  return text.split("\n").flatMap((line, index) => {
    const timeMatch = line.match(/(\d{1,2}:\d{2}\s*[AP]M)\s*(?:→|->)\s*(\d+)/i);
    if (!timeMatch) return [];
    const slotId = line.match(/slotId[=:]\s*(\d+)/)?.[1] || "1";
    const lineItemId = line.match(/itemId[=:]\s*["']?([\w-]+)/)?.[1] || itemId;
    return [{ id: `${slotId}-${index}`, slotId: Number(slotId), itemId: lineItemId, reservationTime: Number(timeMatch[2]), displayTime: timeMatch[1].trim() }];
  });
}

export default function Status({ connected, token }) {
  const { flash } = usePage().props;
  const [locations, setLocations] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [manualLocationOpen, setManualLocationOpen] = useState(false);
  const [manualLatitude, setManualLatitude] = useState("");
  const [manualLongitude, setManualLongitude] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: 26.996309, longitude: 80.8973584 });
  const [query, setQuery] = useState("Italian");
  const [entityType, setEntityType] = useState("CUISINE");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [date, setDate] = useState(today);
  const [guestCount, setGuestCount] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!connected) return;
    fetch("/dineout/locations", { headers: { Accept: "application/json" } })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || data.message); return data; })
      .then((data) => {
        const saved = data.locations || [];
        setLocations(saved);
        const first = saved[0];
        setAddressId(first?.addressId || first?.address_id || first?.id || "");
        if (first?.latitude && first?.longitude) setCoordinates({ latitude: Number(first.latitude), longitude: Number(first.longitude) });
      })
      .catch((requestError) => setError(requestError.message || "Unable to load Swiggy locations."));
    fetch("/dineout/bookings", { headers: { Accept: "application/json" } })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || data.message); return data; })
      .then((data) => setBookings(data.bookings || []))
      .catch(() => {});
    navigator.geolocation?.getCurrentPosition((position) => setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude }), () => {}, { enableHighAccuracy: true, timeout: 8000 });
  }, [connected]);

  async function searchRestaurants(event) {
    event?.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const params = new URLSearchParams({ query, entity_type: entityType, latitude: coordinates.latitude, longitude: coordinates.longitude });
      if (addressId) params.set("address_id", addressId);
      const response = await fetch(`/dineout/search?${params}`, { headers: { Accept: "application/json" } });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || data.message);
      const found = listValue(data.results); setRestaurants(found); if (!found.length) setMessage("No restaurants found for this search.");
    } catch (requestError) { setError(requestError.message || "Unable to search restaurants."); } finally { setBusy(false); }
  }

  async function showSlots(item) {
    const id = item.restaurantId || item.restaurant_id || item.id;
    if (!id) { setError("This restaurant has no valid Swiggy ID."); return; }
    setRestaurant(item); setSelectedSlot(null); setBusy(true); setError(""); setMessage("");
    try {
      const params = new URLSearchParams({ date, guest_count: guestCount, latitude: coordinates.latitude, longitude: coordinates.longitude });
      const response = await fetch(`/dineout/restaurants/${id}/slots?${params}`, { headers: { Accept: "application/json" } });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || data.message);
      const found = listValue(data.slots); setSlots(found); if (!found.length) setMessage("No tables are available for this date and guest count.");
    } catch (requestError) { setError(requestError.message || "Unable to load available tables."); } finally { setBusy(false); }
  }

  async function bookTable() {
    if (!restaurant || !selectedSlot) return;
    const id = restaurant.restaurantId || restaurant.restaurant_id || restaurant.id;
    const payload = { slot_id: selectedSlot.slotId || selectedSlot.slot_id || selectedSlot.id, item_id: selectedSlot.itemId || selectedSlot.item_id, reservation_time: selectedSlot.reservationTime || selectedSlot.reservation_time || selectedSlot.time, reservation_date: date, restaurant_name: restaurant.name || restaurant.restaurantName || restaurant.title || "Restaurant", guest_count: guestCount, ...coordinates };
    setBusy(true); setError("");
    try {
      const response = await fetch(`/dineout/restaurants/${id}/book`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "" }, body: JSON.stringify(payload) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || data.message);
      if (data.record) setBookings((current) => [data.record, ...current]);
      setMessage("Table booking request completed successfully.");
    } catch (requestError) { setError(requestError.message || "Unable to book this table."); } finally { setBusy(false); }
  }

  return (
    <AppLayout>
      <Head title="Swiggy Dineout" />

      <div className="mx-auto max-w-2xl px-3 pb-28 pt-4 sm:p-6">
        <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
          <UtensilsCrossed className="h-5 w-5 shrink-0 text-orange-500 sm:h-6 sm:w-6" />
          <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">Connect Your Swiggy Account</h1>
        </div>

        <p className="mb-5 text-xs leading-5 text-gray-600 sm:mb-6 sm:text-sm">
          Connect your Swiggy account to search restaurants, check available
          slots, and book Dineout tables directly from Secure My Seat.
        </p>

        {flash?.success && (
          <div className="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
            {flash.error}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            {connected ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-gray-400" />
            )}
            <span className="font-medium text-gray-900">
              {connected ? "Connected" : "Not connected"}
            </span>
          </div>

          {connected && token && (
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>Scope: {token.scope}</p>
              <p>Obtained: {token.obtained_at}</p>
              <p>Expires: {token.expires_at}</p>
              {token.remaining_hours !== null && (
                <p>Remaining: {token.remaining_hours} hours</p>
              )}
            </div>
          )}

          {/*
            IMPORTANT: this must be a plain <a> tag, NOT Inertia's <Link>.
            Inertia's <Link> does an XHR/fetch-based visit, and since this
            route redirects to an external domain (Swiggy), the browser
            blocks that cross-origin XHR redirect with a CORS error. A
            normal <a href> does a real full-page navigation instead,
            which redirects to Swiggy exactly like typing the URL would.
          */}
          <a
            href={route("dineout.connect")}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            {connected ? "Reconnect Swiggy Account" : "Connect Swiggy Account"}
          </a>
        </div>
        {connected && <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
          {bookings.length > 0 && <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-gray-900">My booked tables</h2><span className="text-xs text-gray-500">{bookings.length} booking{bookings.length === 1 ? "" : "s"}</span></div><div className="space-y-2">{bookings.map((booking) => <div key={booking.id || booking.booking_reference} className="rounded-lg border border-green-200 bg-green-50 p-3"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-semibold text-gray-900">{booking.restaurant_name || `Restaurant ${booking.restaurant_id}`}</p><p className="mt-1 text-xs text-gray-600">{booking.reservation_date} at {booking.reservation_time} · {booking.guest_count} guests</p></div><span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium uppercase text-green-700">{booking.status}</span></div><p className="mt-2 text-[11px] text-gray-500">Reference: {booking.booking_reference}</p></div>)}</div></section>}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-orange-500" /><h2 className="font-semibold text-gray-900">Find restaurants near you</h2></div>
            <form onSubmit={searchRestaurants} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="text-xs font-medium text-gray-600">Search cuisine or locality<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Italian, Biryani, Koramangala" className="mt-1 block w-full rounded-lg border-gray-300 text-sm" /></label>
              <div className="text-xs font-medium text-gray-600">
                <span>Search location</span>
                <button type="button" onClick={() => setLocationOpen((open) => !open)} className="mt-1 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm font-normal text-gray-700">
                  {locations.find((item) => (item.addressId || item.address_id || item.id || "") === addressId)?.name || (addressId ? "Selected saved location" : "Current location / default")}
                  <span className="ml-2 text-gray-400">{locationOpen ? "\u25B2" : "\u25BC"}</span>
                </button>
                {locationOpen && <div className="mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <button type="button" onClick={() => { setAddressId(""); setLocationOpen(false); }} className={`block w-full px-3 py-2 text-left text-sm hover:bg-orange-50 ${!addressId ? "bg-orange-50 text-orange-700" : "text-gray-700"}`}>Current location / default</button>
                  {locations.map((item, index) => { const id = item.addressId || item.address_id || item.id || ""; return <button type="button" key={id || index} onClick={() => { setAddressId(String(id)); setLocationOpen(false); }} className={`block w-full border-t border-gray-100 px-3 py-2 text-left text-sm hover:bg-orange-50 ${String(id) === String(addressId) ? "bg-orange-50 text-orange-700" : "text-gray-700"}`}>{item.name || item.address || `Saved location ${index + 1}`}</button>; })}
                </div>}
              </div>
              <button disabled={busy || !query.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"><Search className="h-4 w-4" />Search</button>
            </form>
            <div className="mt-3">
              <button type="button" onClick={() => setManualLocationOpen((open) => !open)} className="text-xs font-medium text-orange-600 hover:text-orange-700">
                {manualLocationOpen ? "Hide manual location" : "Booking for someone else? Use another location"}
              </button>
              {manualLocationOpen && <div className="mt-2 rounded-lg border border-orange-100 bg-orange-50 p-3">
                <p className="text-xs text-orange-800">Enter the location coordinates. Example: Lucknow 26.8467, 80.9462.</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input type="number" step="any" value={manualLatitude} onChange={(event) => setManualLatitude(event.target.value)} placeholder="Latitude" className="min-w-0 rounded-lg border-gray-300 text-sm" />
                  <input type="number" step="any" value={manualLongitude} onChange={(event) => setManualLongitude(event.target.value)} placeholder="Longitude" className="min-w-0 rounded-lg border-gray-300 text-sm" />
                </div>
                <button type="button" onClick={() => {
                  const latitude = Number(manualLatitude);
                  const longitude = Number(manualLongitude);
                  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
                    setError("Please enter valid latitude and longitude.");
                    return;
                  }
                  setCoordinates({ latitude, longitude });
                  setAddressId("");
                  setManualLocationOpen(false);
                  setMessage("Manual location applied. Search restaurants now.");
                }} disabled={!manualLatitude || !manualLongitude} className="mt-2 w-full rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-50">Use this location</button>
              </div>}
            </div>
            <div className="mt-3 flex gap-2">{[["CUISINE", "Cuisine"], ["locality", "Locality"]].map(([value, label]) => <button type="button" key={value} onClick={() => setEntityType(value)} className={`rounded-full px-3 py-1 text-xs ${entityType === value ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>{label}</button>)}</div>
            <p className="mt-3 text-xs text-gray-500">GPS: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}</p>
          </div>
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
          {busy && <div className="flex items-center gap-2 text-sm text-gray-500"><LoaderCircle className="h-4 w-4 animate-spin" />Contacting Swiggy...</div>}
          {restaurants.length > 0 && !restaurant && <div className="grid gap-3 sm:grid-cols-2">{restaurants.map((item, index) => {
            const itemId = item.restaurantId || item.restaurant_id || item.id || index;
            const isSelected = String(restaurant?.restaurantId || restaurant?.restaurant_id || restaurant?.id || "") === String(itemId);

            return <div key={itemId} className={`rounded-xl border bg-white p-3 sm:p-4 ${isSelected ? "border-orange-300" : "border-gray-200"}`}>
              <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{item.name || item.restaurantName || item.title || "Restaurant"}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500 sm:text-sm">{item.cuisines || item.description || item.address || item.locality || "Swiggy Dineout restaurant"}</p>
              <button onClick={() => router.visit(`/dineout/restaurants/${itemId}/booking?name=${encodeURIComponent(item.name || item.restaurantName || item.title || "Restaurant")}&description=${encodeURIComponent(item.cuisines || item.description || item.address || item.locality || "Swiggy Dineout restaurant")}&latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`)} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white sm:text-sm"><CalendarDays className="h-4 w-4" />View tables</button>
            </div>;
          })}</div>}
          {restaurant && <div className="rounded-xl border border-orange-200 bg-white p-4 sm:p-5">
            <button type="button" onClick={() => { setRestaurant(null); setSlots([]); setSelectedSlot(null); }} className="mb-4 text-sm font-medium text-gray-600">← Back to restaurants</button>
            <h2 className="text-lg font-semibold text-gray-900">{restaurant.name || restaurant.restaurantName || restaurant.title || "Restaurant"}</h2>
            <p className="mt-1 text-sm text-gray-500">{restaurant.cuisines || restaurant.description || restaurant.address || restaurant.locality || "Swiggy Dineout restaurant"}</p>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-900">Choose a table time</h3>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2"><input type="date" min={today} value={date} onChange={(event) => { setDate(event.target.value); showSlots(restaurant); }} className="min-w-0 rounded-lg border-gray-300 text-sm" /><label className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2 text-sm"><Users className="h-4 w-4" /><input type="number" min="1" max="20" value={guestCount} onChange={(event) => setGuestCount(event.target.value)} className="w-8 border-0 p-0 text-sm focus:ring-0" /></label></div>
              <div className="mt-4 grid grid-cols-2 gap-2">{slots.map((slot, slotIndex) => <button key={`${slot.slotId || slot.slot_id || "slot"}-${slot.reservationTime || slot.reservation_time || slotIndex}-${slotIndex}`} onClick={() => setSelectedSlot(slot)} className={`min-h-12 rounded-lg border px-2 py-3 text-left text-xs sm:text-sm ${selectedSlot === slot ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}><Clock3 className="mr-1 inline h-4 w-4" />{slot.displayTime || slot.time || slot.label || `Slot ${slotIndex + 1}`}</button>)}</div>
              {selectedSlot && <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3"><p className="text-xs text-orange-800">Selected time: <strong>{selectedSlot.displayTime || selectedSlot.time || selectedSlot.label}</strong></p><button onClick={bookTable} disabled={busy || !selectedSlot.itemId} className="mt-2 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">Book this table</button>{!selectedSlot.itemId && <p className="mt-1 text-xs text-red-600">Booking details are unavailable for this slot.</p>}</div>}
            </div>
          </div>}
        </div>}
      </div>
    </AppLayout>
  );
}