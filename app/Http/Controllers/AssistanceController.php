<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AssistanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Temple/Assistance', [
            'templates' => [
                [
                    'label' => 'Temple dress codes',
                    'icon' => '👗',
                ],
                [
                    'label' => 'Best time to visit',
                    'icon' => '⏰',
                ],
                [
                    'label' => 'Pooja for health',
                    'icon' => '🙏',
                ],
                [
                    'label' => 'Senior citizen tips',
                    'icon' => '👴',
                ],
                [
                    'label' => 'Festival calendar',
                    'icon' => '🎉',
                ],
                [
                    'label' => 'Travel route plan',
                    'icon' => '🗺️',
                ],
            ],
        ]);
    }
}
