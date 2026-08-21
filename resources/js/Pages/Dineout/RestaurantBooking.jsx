import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { ArrowLeft, CalendarDays, Clock3, LoaderCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";

const today = new Date().toISOString().slice(0, 10);

function parseSlots(value) {
  if (typeof value === "string") {
    try { value = JSON.parse(value); } catch { return parseSlotText(value); }
  }
  if (Array.isArray(value)) return value;
  if (value?.text) return parseSlotText(value.text);
  for (const key of ["slots", "data", "items", "results"]) {
    const result = parseSlots(value?.[key]);
    if (result.length) return result;
  }
  return [];
}

function parseSlotText(text) {
  const defaultItemId = text.match(/itemId[=:]\s*["']?([\w-]+)/)?.[1] || "";
  return text.split("\n").flatMap((line, index) => {
    const time = line.match(/(\d{1,2}:\d{2}\s*[AP]M)\s*(?:→|->)\s*(\d+)/i);
    if (!time) return [];
    const slotId = line.match(/slotId[=:]\s*(\d+)/)?.[1] || "1";
    const itemId = line.match(/itemId[=:]\s*["']?([\w-]+)/)?.[1] || defaultItemId;
    return [{ id: `${slotId}-${time[2]}-${index}`, slotId: Number(slotId), itemId, reservationTime: Number(time[2]), displayTime: time[1].trim() }];
  });
}

export default function RestaurantBooking({ restaurant, coordinates }) {
  const [date, setDate] = useState(today);
  const [guestCount, setGuestCount] = useState(2);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadSlots() {
    setBusy(true); setError(""); setMessage(""); setSelectedSlot(null);
    try {
      const params = new URLSearchParams({ date, guest_count: guestCount, latitude: coordinates.latitude, longitude: coordinates.longitude });
      const response = await fetch(`/dineout/restaurants/${restaurant.id}/slots?${params}`, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || "Unable to load tables.");
      const found = parseSlots(data.slots);
      setSlots(found);
      if (!found.length) setMessage("No tables are available for this date and guest count.");
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }

  useEffect(() => { loadSlots(); }, []);

  async function bookTable() {
    if (!selectedSlot) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/dineout/restaurants/${restaurant.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "" },
        body: JSON.stringify({ slot_id: selectedSlot.slotId, item_id: selectedSlot.itemId, reservation_time: selectedSlot.reservationTime, reservation_date: date, restaurant_name: restaurant.name, guest_count: guestCount, ...coordinates }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || "Unable to book this table.");
      setMessage(`Table booked successfully. Reference: ${data.record?.booking_reference || "confirmed by Swiggy"}`);
    } catch (requestError) { setError(requestError.message); } finally { setBusy(false); }
  }

  return <AppLayout>
    <Head title={`${restaurant.name} - Dineout`} />
    <div className="mx-auto max-w-2xl px-3 pb-28 pt-4 sm:p-6">
      <button type="button" onClick={() => router.visit('/dineout')} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600"><ArrowLeft className="h-4 w-4" />Back to restaurants</button>
      <div className="rounded-xl border border-orange-200 bg-white p-4 sm:p-5">
        <h1 className="text-lg font-semibold">{restaurant.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{restaurant.description}</p>
        <div className="mt-5 border-t border-gray-100 pt-4">
          <h2 className="font-semibold">Choose a table time</h2>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2"><input type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} className="min-w-0 rounded-lg border-gray-300 text-sm" /><label className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2 text-sm"><Users className="h-4 w-4" /><input type="number" min="1" max="20" value={guestCount} onChange={(event) => setGuestCount(event.target.value)} className="w-8 border-0 p-0 text-sm focus:ring-0" /></label></div>
          <button onClick={loadSlots} disabled={busy} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"><CalendarDays className="h-4 w-4" />Refresh tables</button>
          {busy && <div className="mt-4 flex items-center gap-2 text-sm text-gray-500"><LoaderCircle className="h-4 w-4 animate-spin" />Loading tables...</div>}
          {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {message && <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}
          <div className="mt-4 grid grid-cols-2 gap-2">{slots.map((slot, index) => <button key={slot.id || index} onClick={() => setSelectedSlot(slot)} className={`min-h-12 rounded-lg border px-2 py-3 text-left text-xs sm:text-sm ${selectedSlot === slot ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}><Clock3 className="mr-1 inline h-4 w-4" />{slot.displayTime || slot.time || `Slot ${index + 1}`}</button>)}</div>
          {selectedSlot && <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3"><p className="text-xs text-orange-800">Selected time: <strong>{selectedSlot.displayTime}</strong></p><button onClick={bookTable} disabled={busy || !selectedSlot.itemId} className="mt-2 w-full rounded-lg bg-orange-500 px-4 py-3 text-sm font-medium text-white disabled:opacity-50">Book this table</button></div>}
        </div>
      </div>
    </div>
  </AppLayout>;
}
