import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

// Stadium stands configuration for a cricket oval (Wankhede-style)
const STANDS = [
    // North (top)
    { id: 'PRESS_BOX', label: 'PRESS BOX', price: null, angle: 0, arcSpan: 18, radius: 0.56, isSpecial: true },
    { id: 'NORTH_F', label: 'F', price: 4500, angle: -28, arcSpan: 9, radius: 0.72 },
    { id: 'NORTH_G', label: 'G', price: 4500, angle: -10, arcSpan: 9, radius: 0.72 },
    { id: 'NORTH_H', label: 'H', price: 4500, angle: 10, arcSpan: 9, radius: 0.72 },
    { id: 'NORTH_I', label: 'I', price: 4500, angle: 28, arcSpan: 9, radius: 0.72 },
    { id: 'NORTH_E', label: 'E', price: 4500, angle: -45, arcSpan: 9, radius: 0.72 },
    { id: 'NORTH_J', label: 'J', price: 4500, angle: 45, arcSpan: 9, radius: 0.72 },

    // Upper north (Dilip Vengsarkar side)
    { id: 'BLOCK_M12', label: 'BLOCK M12', price: 11500, angle: 32, arcSpan: 12, radius: 0.87 },
    { id: 'BLOCK_L2', label: 'BLOCK L2', price: 25000, angle: 50, arcSpan: 10, radius: 0.87 },

    // NE stands
    { id: 'NE_K', label: 'K', price: 5500, angle: 62, arcSpan: 10, radius: 0.72 },
    { id: 'NE_Y', label: 'Y', price: 5500, angle: 74, arcSpan: 8, radius: 0.72 },

    // East (Sunil Gavaskar Pavilion side)
    { id: 'EAST_A', label: 'A', price: 5900, angle: 84, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_L', label: 'L', price: 5900, angle: 94, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_B', label: 'B', price: 5900, angle: 104, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_K2', label: 'K', price: 5900, angle: 114, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_C', label: 'C', price: 5900, angle: 123, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_J2', label: 'J', price: 5900, angle: 132, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_I', label: 'I', price: 5900, angle: 141, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_D', label: 'D', price: 5900, angle: 150, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_H', label: 'H', price: 5900, angle: 159, arcSpan: 8, radius: 0.72 },
    { id: 'EAST_E', label: 'E', price: 5900, angle: 168, arcSpan: 8, radius: 0.72 },

    // SE (Vithal Divecha / Rohit Sharma Stand)
    { id: 'SE_G', label: 'G', price: 5500, angle: 178, arcSpan: 8, radius: 0.72 },
    { id: 'SE_F', label: 'F', price: 5500, angle: 188, arcSpan: 8, radius: 0.72 },
    { id: 'SE_G2', label: 'G', price: 5500, angle: 198, arcSpan: 8, radius: 0.72 },
    { id: 'SE_H', label: 'H', price: 5500, angle: 207, arcSpan: 8, radius: 0.72 },
    { id: 'ROHIT_F', label: 'F', price: 6950, angle: 220, arcSpan: 10, radius: 0.85 },
    { id: 'ROHIT_D', label: 'D', price: 6950, angle: 232, arcSpan: 10, radius: 0.85 },
    { id: 'ROHIT_C_STAND', label: 'ROHIT\nSHARMA\nSTAND C', price: 6950, angle: 240, arcSpan: 12, radius: 0.88, isLabel: true },

    // South (MCA Pavilion / Grand Stand)
    { id: 'MCA_PAV', label: 'MCA PAVILION', price: 2800, angle: 200, arcSpan: 22, radius: 0.55, isSpecial: true },
    { id: 'GRAND_STAND', label: 'GRAND STAND', price: 499, angle: 180, arcSpan: 22, radius: 0.48, isSpecial: true },
    { id: 'PRESIDENT_BOX', label: 'PRESIDENT BOX\nLEVEL 2', price: null, angle: 180, arcSpan: 14, radius: 0.40, isSpecial: true },
    { id: 'SHARAD_PAWAR', label: 'SHARAD PAWAR STAND', price: 499, angle: 180, arcSpan: 18, radius: 0.34, isSpecial: true },
    { id: 'AJIT_WADEKAR', label: 'AJIT WADEKAR STAND', price: 499, angle: 180, arcSpan: 18, radius: 0.28, isSpecial: true },

    // South lower
    { id: 'SOUTH_M', label: 'M', price: 2800, angle: 196, arcSpan: 8, radius: 0.64 },
    { id: 'SOUTH_L', label: 'L', price: 2800, angle: 206, arcSpan: 8, radius: 0.64 },
    { id: 'SOUTH_K3', label: 'K', price: 2800, angle: 216, arcSpan: 8, radius: 0.64 },

    // SW (Garware Pavilion)
    { id: 'SW_J', label: 'J', price: 4500, angle: 225, arcSpan: 8, radius: 0.64 },
    { id: 'SW_K4', label: 'K', price: 4500, angle: 234, arcSpan: 8, radius: 0.64 },
    { id: 'SW_I2', label: 'I', price: 4500, angle: 242, arcSpan: 8, radius: 0.64 },
    { id: 'SW_L2', label: 'L', price: 4500, angle: 250, arcSpan: 8, radius: 0.64 },
    { id: 'SW_H2', label: 'H', price: 4500, angle: 258, arcSpan: 8, radius: 0.64 },
    { id: 'GARWARE_J2', label: 'J', price: 4500, angle: 264, arcSpan: 8, radius: 0.72 },

    // West (Vijay Merchant Pavilion)
    { id: 'WEST_L', label: 'L', price: 4500, angle: 272, arcSpan: 8, radius: 0.64 },
    { id: 'WEST_K', label: 'K', price: 4500, angle: 280, arcSpan: 8, radius: 0.64 },
    { id: 'WEST_J', label: 'J', price: 4500, angle: 288, arcSpan: 8, radius: 0.64 },
    { id: 'WEST_I', label: 'I', price: 4500, angle: 296, arcSpan: 8, radius: 0.64 },
    { id: 'WEST_H', label: 'H', price: 4500, angle: 304, arcSpan: 8, radius: 0.64 },
    { id: 'WEST_G', label: 'G', price: 4500, angle: 312, arcSpan: 8, radius: 0.64 },
    { id: 'WEST_F', label: 'F', price: 4500, angle: 320, arcSpan: 8, radius: 0.64 },

    // NW (Sachin Tendulkar Pavilion)
    { id: 'NW_E', label: 'E', price: 4500, angle: 327, arcSpan: 8, radius: 0.64 },
    { id: 'NW_D', label: 'D', price: 4500, angle: 333, arcSpan: 8, radius: 0.64 },
    { id: 'NW_C', label: 'C', price: 4500, angle: 339, arcSpan: 8, radius: 0.64 },
    { id: 'NW_O', label: 'O', price: 4500, angle: 315, arcSpan: 8, radius: 0.74 },
    { id: 'NW_U', label: 'U', price: 4500, angle: 320, arcSpan: 8, radius: 0.74 },
    { id: 'NW_V', label: 'V', price: 4500, angle: 326, arcSpan: 8, radius: 0.74 },
    { id: 'NW_N', label: 'N', price: 4500, angle: 307, arcSpan: 8, radius: 0.74 },
    { id: 'NW_60', label: '60', price: 4500, angle: 340, arcSpan: 6, radius: 0.74 },

    // NW upper
    { id: 'NW_A', label: 'A', price: 4500, angle: 269, arcSpan: 8, radius: 0.74 },
    { id: 'NW_B', label: 'B', price: 4500, angle: 278, arcSpan: 8, radius: 0.74 },
    { id: 'NW_P', label: 'P', price: 4500, angle: 288, arcSpan: 8, radius: 0.74 },
    { id: 'NW_Q', label: 'Q', price: 4500, angle: 296, arcSpan: 8, radius: 0.74 },
    { id: 'NW_R', label: 'R', price: 4500, angle: 304, arcSpan: 8, radius: 0.74 },
    { id: 'NW_S', label: 'S', price: 4500, angle: 312, arcSpan: 8, radius: 0.74 },
    { id: 'NW_T', label: 'T', price: 4500, angle: 320, arcSpan: 8, radius: 0.74 },
];

// Pavilion / Stand section rings for labels
const STAND_LABELS = [
    { label: 'SACHIN TENDULKAR PAVILION', angle: 305, radius: 0.83 },
    { label: 'VIJAY MERCHANT PAVILION', angle: 270, radius: 0.83 },
    { label: 'GARWARE PAVILION', angle: 243, radius: 0.80 },
    { label: 'DILIP VENGSARKAR STAND', angle: 55, radius: 0.78 },
    { label: 'SUNIL GAVASKAR PAVILION', angle: 128, radius: 0.83 },
    { label: 'VITHAL DIVECHA STAND', angle: 175, radius: 0.80 },
    { label: 'ROHIT SHARMA STAND', angle: 220, radius: 0.92 },
];

const PRICE_CATEGORIES = [
    { price: 11500, label: '₹11,500', tag: 'Fast Filling', color: '#1a73e8', selectedColor: '#1557b0' },
    { price: 25000, label: '₹25,000', tag: 'Fast Filling', color: '#8b5cf6', selectedColor: '#6d28d9' },
    { price: 499, label: '₹499', color: '#6b7280', selectedColor: '#4b5563' },
    { price: 2800, label: '₹2,800', color: '#6b7280', selectedColor: '#4b5563' },
    { price: 4500, label: '₹4,500', color: '#6b7280', selectedColor: '#4b5563' },
    { price: 5500, label: '₹5,500', color: '#6b7280', selectedColor: '#4b5563' },
    { price: 5900, label: '₹5,900', color: '#6b7280', selectedColor: '#4b5563' },
    { price: 6950, label: '₹6,950', color: '#6b7280', selectedColor: '#4b5563' },
];

const PRICE_TO_COLOR = {
    11500: '#3b82f6',
    25000: '#a855f7',
    499: '#9ca3af',
    2800: '#9ca3af',
    4500: '#9ca3af',
    5500: '#9ca3af',
    5900: '#9ca3af',
    6950: '#9ca3af',
};

const PRICE_TO_HIGHLIGHT = {
    11500: '#60a5fa',
    25000: '#c084fc',
    499: '#d1d5db',
    2800: '#d1d5db',
    4500: '#d1d5db',
    5500: '#d1d5db',
    5900: '#d1d5db',
    6950: '#d1d5db',
};

const getQuantityFromQuery = () => {
    try {
        const params = new URLSearchParams(window.location.search);
        return Number(params.get('quantity')) || 1;
    } catch {
        return 1;
    }
};

function deg2rad(deg) { return (deg * Math.PI) / 180; }

function StadiumMap({ selectedCategory, selectedStands, onStandClick }) {
    const cx = 200, cy = 200, R = 170;

    return (
        <svg viewBox="0 0 400 400" className="w-full h-full" style={{ maxHeight: 420 }}>
            {/* Outfield */}
            <ellipse cx={cx} cy={cy} rx={R * 0.52} ry={R * 0.44} fill="#2d7a27" />
            {/* Pitch */}
            <rect x={cx - 5} y={cy - 28} width={10} height={56} rx={2} fill="#c8b97a" />

            {/* Draw each stand as a colored arc/block */}
            {STANDS.filter(s => !s.isSpecial && !s.isLabel).map(stand => {
                const angleRad = deg2rad(stand.angle - 90);
                const r = R * stand.radius;
                const halfArc = deg2rad(stand.arcSpan / 2);
                const x1 = cx + (r - 14) * Math.cos(angleRad - halfArc);
                const y1 = cy + (r - 14) * Math.sin(angleRad - halfArc);
                const x2 = cx + r * Math.cos(angleRad - halfArc);
                const y2 = cy + r * Math.sin(angleRad - halfArc);
                const x3 = cx + r * Math.cos(angleRad + halfArc);
                const y3 = cy + r * Math.sin(angleRad + halfArc);
                const x4 = cx + (r - 14) * Math.cos(angleRad + halfArc);
                const y4 = cy + (r - 14) * Math.sin(angleRad + halfArc);

                const isHighlighted = selectedCategory === stand.price;
                const isSelected = selectedStands.includes(stand.id);
                const baseColor = stand.price ? PRICE_TO_COLOR[stand.price] || '#9ca3af' : '#9ca3af';
                const fill = isSelected ? '#f97316' : isHighlighted ? PRICE_TO_HIGHLIGHT[stand.price] : baseColor;
                const stroke = isSelected ? '#ea580c' : isHighlighted ? '#fff' : 'rgba(255,255,255,0.3)';

                return (
                    <g key={stand.id} onClick={() => onStandClick(stand)} style={{ cursor: stand.price ? 'pointer' : 'default' }}>
                        <path
                            d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={isHighlighted || isSelected ? 1.5 : 0.5}
                            opacity={selectedCategory && stand.price !== selectedCategory && !isSelected ? 0.45 : 1}
                        />
                        {stand.arcSpan >= 8 && (
                            <text
                                x={cx + (r - 7) * Math.cos(angleRad)}
                                y={cy + (r - 7) * Math.sin(angleRad)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="5"
                                fill="white"
                                fontWeight="600"
                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                                {stand.label}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Press Box */}
            <rect x={cx - 22} y={cy - R * 0.58} width={44} height={14} rx={3}
                fill="#4b5563" stroke="rgba(255,255,255,0.4)" strokeWidth={0.5} />
            <text x={cx} y={cy - R * 0.58 + 7} textAnchor="middle" dominantBaseline="middle"
                fontSize="5" fill="white" fontWeight="600" style={{ userSelect: 'none' }}>PRESS BOX</text>

            {/* South stands (linear / horizontal) */}
            {/* MCA Pavilion */}
            <rect x={cx - 60} y={cy + R * 0.50} width={120} height={14} rx={3}
                fill={selectedCategory === 2800 ? PRICE_TO_HIGHLIGHT[2800] : PRICE_TO_COLOR[2800]}
                stroke={selectedCategory === 2800 ? '#fff' : 'rgba(255,255,255,0.3)'}
                strokeWidth={0.5}
                opacity={selectedCategory && selectedCategory !== 2800 ? 0.4 : 1}
                onClick={() => onStandClick({ id: 'MCA_PAV_CLICK', price: 2800 })}
                style={{ cursor: 'pointer' }}
            />
            <text x={cx} y={cy + R * 0.50 + 7} textAnchor="middle" dominantBaseline="middle"
                fontSize="5" fill="white" fontWeight="600" style={{ userSelect: 'none', pointerEvents: 'none' }}>MCA PAVILION</text>

            {/* Grand Stand */}
            <rect x={cx - 50} y={cy + R * 0.50 + 17} width={100} height={11} rx={3}
                fill={selectedCategory === 499 ? PRICE_TO_HIGHLIGHT[499] : PRICE_TO_COLOR[499]}
                stroke={selectedCategory === 499 ? '#fff' : 'rgba(255,255,255,0.3)'}
                strokeWidth={0.5}
                opacity={selectedCategory && selectedCategory !== 499 ? 0.4 : 1}
                onClick={() => onStandClick({ id: 'GRAND_STAND_CLICK', price: 499 })}
                style={{ cursor: 'pointer' }}
            />
            <text x={cx} y={cy + R * 0.50 + 22} textAnchor="middle" dominantBaseline="middle"
                fontSize="5" fill="white" fontWeight="600" style={{ userSelect: 'none', pointerEvents: 'none' }}>GRAND STAND</text>

            {/* Sharad Pawar */}
            <rect x={cx - 42} y={cy + R * 0.50 + 31} width={84} height={10} rx={3}
                fill={selectedCategory === 499 ? PRICE_TO_HIGHLIGHT[499] : PRICE_TO_COLOR[499]}
                stroke="rgba(255,255,255,0.3)" strokeWidth={0.5}
                opacity={selectedCategory && selectedCategory !== 499 ? 0.4 : 1}
                onClick={() => onStandClick({ id: 'SHARAD_CLICK', price: 499 })}
                style={{ cursor: 'pointer' }}
            />
            <text x={cx} y={cy + R * 0.50 + 36} textAnchor="middle" dominantBaseline="middle"
                fontSize="4.5" fill="white" fontWeight="600" style={{ userSelect: 'none', pointerEvents: 'none' }}>SHARAD PAWAR STAND</text>

            {/* Ajit Wadekar */}
            <rect x={cx - 38} y={cy + R * 0.50 + 44} width={76} height={10} rx={3}
                fill={selectedCategory === 499 ? PRICE_TO_HIGHLIGHT[499] : PRICE_TO_COLOR[499]}
                stroke="rgba(255,255,255,0.3)" strokeWidth={0.5}
                opacity={selectedCategory && selectedCategory !== 499 ? 0.4 : 1}
                onClick={() => onStandClick({ id: 'AJIT_CLICK', price: 499 })}
                style={{ cursor: 'pointer' }}
            />
            <text x={cx} y={cy + R * 0.50 + 49} textAnchor="middle" dominantBaseline="middle"
                fontSize="4.5" fill="white" fontWeight="600" style={{ userSelect: 'none', pointerEvents: 'none' }}>AJIT WADEKAR STAND</text>

            {/* President Box (purple) */}
            <rect x={cx - 28} y={cy + R * 0.32} width={56} height={16} rx={3}
                fill={selectedCategory === 25000 ? PRICE_TO_HIGHLIGHT[25000] : PRICE_TO_COLOR[25000]}
                stroke={selectedCategory === 25000 ? '#fff' : 'rgba(255,255,255,0.3)'}
                strokeWidth={0.5}
                opacity={selectedCategory && selectedCategory !== 25000 ? 0.4 : 1}
                onClick={() => onStandClick({ id: 'PRES_BOX_CLICK', price: 25000 })}
                style={{ cursor: 'pointer' }}
            />
            <text x={cx} y={cy + R * 0.32 + 5} textAnchor="middle" dominantBaseline="middle"
                fontSize="4.5" fill="white" fontWeight="700" style={{ userSelect: 'none', pointerEvents: 'none' }}>PRESIDENT BOX</text>
            <text x={cx} y={cy + R * 0.32 + 11} textAnchor="middle" dominantBaseline="middle"
                fontSize="4" fill="white" style={{ userSelect: 'none', pointerEvents: 'none' }}>LEVEL 2</text>

            {/* Pavilion labels around ring */}
            {STAND_LABELS.map(({ label, angle, radius }) => {
                const rad = deg2rad(angle - 90);
                const r = R * radius;
                return (
                    <text
                        key={label}
                        x={cx + r * Math.cos(rad)}
                        y={cy + r * Math.sin(rad)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="4.2"
                        fill="rgba(255,255,255,0.7)"
                        fontStyle="italic"
                        transform={`rotate(${angle}, ${cx + r * Math.cos(rad)}, ${cy + r * Math.sin(rad)})`}
                        style={{ userSelect: 'none', pointerEvents: 'none' }}
                    >
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}

export default function MatchSeatingSelection() {
    const { matchId, razorpayKey } = usePage().props;
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [quantity] = useState(getQuantityFromQuery());
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStands, setSelectedStands] = useState([]);
    const [timer, setTimer] = useState(4 * 60); // 4 minutes in seconds

    useEffect(() => {
        fetch(`/api/ipl-matches/${matchId}`)
            .then(res => res.json())
            .then(data => { setMatch(data); setLoading(false); })
            .catch(() => { setError('Failed to load match details.'); setLoading(false); });
    }, [matchId]);

    useEffect(() => {
        if (window.Razorpay) return;
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const timerMins = Math.floor(timer / 60);
    const timerSecs = timer % 60;

    const handleStandClick = (stand) => {
        if (!stand.price) return;
        // Selecting category
        if (selectedCategory !== stand.price) {
            setSelectedCategory(stand.price);
            setSelectedStands([]);
            return;
        }
        // Within same category, toggle stand selection up to quantity
        if (selectedStands.includes(stand.id)) {
            setSelectedStands(selectedStands.filter(s => s !== stand.id));
        } else {
            if (selectedStands.length >= quantity) {
                setError(`You can only select ${quantity} stand section${quantity > 1 ? 's' : ''} for your ${quantity} ticket${quantity > 1 ? 's' : ''}.`);
                return;
            }
            setSelectedStands([...selectedStands, stand.id]);
            setError(null);
        }
    };

    const handleCategorySelect = (price) => {
        setSelectedCategory(price);
        setSelectedStands([]);
        setError(null);
    };

    const getCsrfToken = () => {
        return document.querySelector('meta[name="csrf-token"]')?.content || '';
    };

    const handleConfirm = async () => {
        if (!selectedCategory) {
            setError('Please select a price category first.');
            return;
        }
        if (selectedStands.length !== quantity) {
            setError(`Please select ${quantity} stand section${quantity > 1 ? 's' : ''} before proceeding.`);
            return;
        }

        setError(null);
        setIsProcessing(true);

        try {
            const response = await fetch('/api/ipl-matches/create-razorpay-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    ipl_match_id: matchId,
                    quantity,
                    amount_per_ticket: selectedCategory,
                    seat_numbers: selectedStands,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Unable to create payment order.');
                setIsProcessing(false);
                return;
            }

            if (!window.Razorpay) {
                setError('Payment library not loaded. Refresh and try again.');
                setIsProcessing(false);
                return;
            }

            const options = {
                key: razorpayKey || '',
                amount: data.amount * 100,
                currency: data.currency,
                name: 'SecureSeat IPL Tickets',
                description: match ? `${match.team1?.name || 'Team'} vs ${match.team2?.name || 'Team'}` : 'IPL Match Ticket',
                order_id: data.orderId,
                prefill: {
                    email: document.querySelector('meta[name="user-email"]')?.content || '',
                },
                handler: async (paymentResponse) => {
                    try {
                        const verifyRes = await fetch('/api/ipl-matches/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': getCsrfToken(),
                            },
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,
                                booking_id: data.booking_id,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) {
                            setError(verifyData.error || 'Payment verification failed.');
                            setIsProcessing(false);
                            return;
                        }

                        window.location.href = `/ipl/match-booking/${verifyData.booking_id}`;
                    } catch (verifyError) {
                        setError('Payment verification failed. Please try again.');
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                    },
                },
                theme: {
                    color: '#f97316',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError('Unable to start payment. Please try again.');
            setIsProcessing(false);
        }
    };

    const matchTitle = match
        ? `${match.team1?.name || 'Team 1'} vs ${match.team2?.name || 'Team 2'}`
        : 'Loading...';

    const selectedCatObj = PRICE_CATEGORIES.find(c => c.price === selectedCategory);
    const totalPrice = selectedCategory ? selectedCategory * quantity : 0;

    if (loading) return (
        <AppLayout>
            <div className="py-16 text-center text-gray-500 text-sm">Loading seating plan...</div>
        </AppLayout>
    );

    return (
        <AppLayout>
            <div className="flex flex-col min-h-screen bg-white">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-900">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-sm font-bold text-gray-900 flex-1 truncate">{matchTitle}</h1>
                </div>

                {/* Timer Banner */}
                <div
                    className="flex items-center justify-center gap-1 px-4 py-2 text-xs text-white font-medium"
                    style={{ background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)' }}
                >
                    <span>You have approximately</span>
                    <span className="font-bold">
                        {timerMins} minute{timerMins !== 1 ? 's' : ''} {timerSecs < 10 ? `0${timerSecs}` : timerSecs}s
                    </span>
                    <span>to select your seats.</span>
                </div>

                {/* Stadium Map */}
                <div className="relative bg-gray-50 px-2 pt-2 pb-0" style={{ background: '#f8f9fa' }}>
                    <StadiumMap
                        selectedCategory={selectedCategory}
                        selectedStands={selectedStands}
                        onStandClick={handleStandClick}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-4 mt-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</div>
                )}

                {/* Selection info */}
                {selectedCategory && (
                    <div className="mx-4 mt-2 px-3 py-2 bg-orange-50 rounded-xl text-xs text-orange-700 font-medium">
                        Selected: {selectedCatObj?.label} · {selectedStands.length}/{quantity} stand{quantity > 1 ? 's' : ''} chosen
                    </div>
                )}

                {/* Price category selector */}
                <div className="px-4 pt-3 pb-1">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                        Please select the price-category of your choice below
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {PRICE_CATEGORIES.map(cat => (
                            <button
                                key={cat.price}
                                onClick={() => handleCategorySelect(cat.price)}
                                className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                                    selectedCategory === cat.price
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-gray-300 bg-white text-gray-700'
                                }`}
                            >
                                <span className="block">{cat.label}</span>
                                {cat.tag && <span className="block text-[10px] text-orange-500 font-medium">{cat.tag}</span>}
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                        Selected category's stands will get highlighted on the layout
                    </p>
                </div>

                {/* Bottom CTA */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 mt-auto">
                    <div className="flex items-center justify-between gap-1">
                        <div>
                            {selectedCategory ? (
                                <>
                                    <p className="text-base font-bold text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-gray-500">{quantity} ticket{quantity > 1 ? 's' : ''} · {selectedCatObj?.label} per seat</p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">Select a category to continue</p>
                            )}
                        </div>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedCategory || selectedStands.length !== quantity || isProcessing}
                            className={`rounded-lg px-1.5 py-2.5 text-sm font-bold text-white transition-colors ${
                                selectedCategory && selectedStands.length === quantity && !isProcessing
                                    ? 'bg-orange-600 hover:bg-orange-700'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            {isProcessing ? 'Processing...' : 'Proceed to Book'}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}