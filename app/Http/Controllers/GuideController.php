<?php

namespace App\Http\Controllers;

use App\Models\Guide;
use Inertia\Inertia;

class GuideController extends Controller
{
    public function index()
    {
        // Fetch active guides from database
        $guides = Guide::whereRelation('temple', 'status', 'active')
                       ->where('status', 'active')
                       ->with('temple')
                       ->get()
                       ->map(function ($guide) {
                           return [
                               'id' => $guide->id,
                               'name' => $guide->name,
                               'category' => 'Guide',
                               'specialization' => $guide->language . ' Language Guide',
                               'image' => '/banner/' . ($guide->image ?? 'guide-1.jpg'),
                               'image_style' => 'width: 100%; height: 250px; object-fit: cover; object-position: center;',
                               'rating' => $guide->rating ?? 4.5,
                               'reviews' => rand(50, 200),
                               'price' => $guide->price,
                               'description' => $guide->description,
                               'languages' => $guide->language,
                               'experience' => $guide->experience ?? '5 years',
                           ];
                       })
                       ->toArray();

        return Inertia::render('Temple/Guide', [
            'guides' => $guides,
        ]);
    }

    public function show($id)
    {
        $guide = Guide::where('status', 'active')
                     ->whereRelation('temple', 'status', 'active')
                     ->with('temple')
                     ->findOrFail($id);

        return Inertia::render('Temple/GuideProfile', [
            'guide' => [
                'id' => $guide->id,
                'name' => $guide->name,
                'category' => 'Guide',
                'specialization' => $guide->language . ' Language Guide',
                'image' => '/banner/' . ($guide->image ?? 'guide-1.jpg'),
                'rating' => $guide->rating ?? 4.5,
                'reviews' => rand(50, 200),
                'price' => $guide->price,
                'description' => $guide->description,
                'longDescription' => $guide->description,
                'languages' => [$guide->language],
                'experience' => $guide->experience ?? '5 years',
                'verified' => true,
                'availability' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                'hourlyRate' => $guide->price,
                'groupRate' => $guide->price * 10,
                'maxGroupSize' => 15,
            ],
        ]);
    }
}
