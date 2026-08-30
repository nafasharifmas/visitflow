<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Place;
use Illuminate\Database\Seeder;

class PlaceSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            [
                'name' => 'Beach & Leisure',
                'description' => 'Open shoreline stops suited to relaxed walks, sunrise views, and casual day visits.',
                'icon' => 'Waves',
            ],
            [
                'name' => 'Beach & Culture',
                'description' => 'Coastal landmarks where beach scenery and local religious or civic identity meet.',
                'icon' => 'Landmark',
            ],
            [
                'name' => 'Culture & Religion',
                'description' => 'Spiritual and cultural sites that reflect the heritage of the Kalmunai region.',
                'icon' => 'Church',
            ],
            [
                'name' => 'Nature & Lagoon',
                'description' => 'Lagoon edges, waterways, and low-key natural landscapes for scenic stops.',
                'icon' => 'Leaf',
            ],
            [
                'name' => 'Beach & Fishing',
                'description' => 'Seafront areas connected to small-scale fishing life and local coastal routines.',
                'icon' => 'Fish',
            ],
            [
                'name' => 'Beach & Park',
                'description' => 'Public coastal spaces that suit families, evening visits, and gentle walks.',
                'icon' => 'Trees',
            ],
            [
                'name' => 'Coastal Townscape',
                'description' => 'Town-adjacent coastal stretches that work as accessible public viewpoints.',
                'icon' => 'Palmtree',
            ],
            [
                'name' => 'Lighthouse & Coast',
                'description' => 'Distinctive maritime landmarks with open sea views and strong visual identity.',
                'icon' => 'Lighthouse',
            ],
            [
                'name' => 'Crafts & Community',
                'description' => 'Community spaces linked to local handloom and neighbourhood culture.',
                'icon' => 'Scissors',
            ],
        ])->mapWithKeys(function (array $category) {
            $slug = str($category['name'])->slug()->toString();

            return [
                $category['name'] => Category::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'name' => $category['name'],
                        'description' => $category['description'],
                        'icon' => $category['icon'],
                        'status' => 'active',
                    ],
                ),
            ];
        });

        $places = [
            [
                'name' => 'Maruthamunai Beach',
                'category' => 'Beach & Leisure',
                'slug' => 'maruthamunai-beach',
                'short_description' => 'An uncrowded stretch of coast known for sunrise views and a relaxed local atmosphere.',
                'full_description' => "Maruthamunai Beach is one of the closest seaside stops for a short local outing, with open sand, sea breeze, and easy access from town. It also sits near the area's traditional handloom neighbourhoods, making it a practical anchor for a broader cultural day visit.",
                'address' => 'Maruthamunai, Ampara District, Sri Lanka',
                'latitude' => 7.4363270,
                'longitude' => 81.8232500,
                'distance_from_home' => 0.5,
                'opening_time' => '05:30',
                'closing_time' => '19:00',
                'visit_duration_minutes' => 90,
                'travel_tips' => 'Best for sunrise and early evening visits; coastal conditions can be rough, so swimming should be treated cautiously.',
            ],
            [
                'name' => 'Kalmunai Beach & Beach Mosque',
                'category' => 'Beach & Culture',
                'slug' => 'kalmunai-beach-and-beach-mosque',
                'short_description' => 'A well-known beachfront stop that combines sea views with a prominent mosque-side public space.',
                'full_description' => 'This Kalmunai beachfront area is popular for evening walks, sea views, and the visual character created by the adjacent Beach Mosque. It works well as a short scenic stop and as an easy public meeting point within the coastal town area.',
                'address' => 'Beach Road, Kalmunai 32300, Sri Lanka',
                'latitude' => 7.4118834,
                'longitude' => 81.8391109,
                'distance_from_home' => 3.8,
                'opening_time' => '05:00',
                'closing_time' => '21:00',
                'visit_duration_minutes' => 75,
                'travel_tips' => 'Sunset is the busiest period; roadside parking and pedestrian activity are usually higher in the late afternoon.',
            ],
            [
                'name' => "Muhyideen Grand Jumu'ah Masjid",
                'category' => 'Culture & Religion',
                'slug' => 'muhyideen-grand-jumuah-masjid',
                'short_description' => 'A major Kalmunai mosque recognized as a landmark for worship, architecture, and community life.',
                'full_description' => "Muhyideen Grand Jumu'ah Masjid stands out as one of the area's most prominent religious landmarks. Visitors interested in local culture can include it as a respectful heritage stop when exploring Kalmunai and its surrounding coastal neighbourhoods.",
                'address' => 'Mosque Road, Kalmunai 32300, Sri Lanka',
                'latitude' => 7.4042860,
                'longitude' => 81.8316800,
                'distance_from_home' => 4.0,
                'opening_time' => '04:30',
                'closing_time' => '21:00',
                'visit_duration_minutes' => 45,
                'travel_tips' => 'Dress modestly and plan around prayer times; non-worship visits should remain respectful and low-disruption.',
            ],
            [
                'name' => 'Koddaikallar Village & Lagoon',
                'category' => 'Nature & Lagoon',
                'slug' => 'koddaikallar-village-and-lagoon',
                'short_description' => 'A quieter lagoon-side setting suited to low-key scenic visits and nature-oriented stops.',
                'full_description' => 'Koddaikallar offers a slower-paced contrast to the open coast, with lagoon scenery and a more village-scale environment. It fits itinerary plans that mix seafront locations with calmer water-edge landscapes and local settlement views.',
                'address' => 'Koddaikallar, Eastern Province, Sri Lanka',
                'latitude' => 7.4833000,
                'longitude' => 81.8000000,
                'distance_from_home' => 5.5,
                'opening_time' => '06:00',
                'closing_time' => '18:30',
                'visit_duration_minutes' => 80,
                'travel_tips' => 'This is best treated as a daylight stop; carry essentials because visitor facilities may be limited compared with busier beach areas.',
            ],
            [
                'name' => 'Palamunai Beach Park',
                'category' => 'Beach & Fishing',
                'slug' => 'palamunai-beach-park',
                'short_description' => 'A southern coastal stop with open beach frontage and visible ties to local fishing activity.',
                'full_description' => 'Palamunai Beach Park offers a different coastal mood from the busier Kalmunai-side beaches, with a more open stretch and stronger links to working coastal life. It is a good option for a later stop in a southbound day route.',
                'address' => 'Palamunai, Addalaichenai, Sri Lanka',
                'latitude' => 7.2694400,
                'longitude' => 81.8653000,
                'distance_from_home' => 8.0,
                'opening_time' => '05:30',
                'closing_time' => '19:00',
                'visit_duration_minutes' => 80,
                'travel_tips' => 'Sea conditions can shift quickly; it is better suited to coastal viewing and walking than to extended swimming plans.',
            ],
            [
                'name' => 'Sainthamaruthu Beach',
                'category' => 'Beach & Park',
                'slug' => 'sainthamaruthu-beach',
                'short_description' => 'A public beach area used for everyday recreation, evening visits, and casual family outings.',
                'full_description' => 'Sainthamaruthu Beach works well for short evening plans thanks to its public accessibility and local popularity. It is a straightforward addition to a coastal itinerary when the goal is a relaxed stop without a long inland detour.',
                'address' => 'Sainthamaruthu 32300, Sri Lanka',
                'latitude' => 7.3950119,
                'longitude' => 81.8443482,
                'distance_from_home' => 3.2,
                'opening_time' => '05:00',
                'closing_time' => '20:00',
                'visit_duration_minutes' => 70,
                'travel_tips' => 'The promenade feel is strongest near sunset, when the area is more social and active.',
            ],
            [
                'name' => 'Karaitivu Coastline',
                'category' => 'Coastal Townscape',
                'slug' => 'karaitivu-coastline',
                'short_description' => 'A coastal town-edge viewpoint area that extends the Kalmunai beach experience farther south.',
                'full_description' => 'Karaitivu provides a coastal continuation beyond the central Kalmunai stretch, with town-side access to sea views and a lived-in neighbourhood character. It can be paired with nearby beaches for a compact route focused on the southern coastline.',
                'address' => 'Karaitivu, Ampara District, Sri Lanka',
                'latitude' => 7.3769500,
                'longitude' => 81.8387900,
                'distance_from_home' => 6.4,
                'opening_time' => '05:30',
                'closing_time' => '19:00',
                'visit_duration_minutes' => 60,
                'travel_tips' => 'Treat this as a flexible scenic stop rather than a tightly programmed attraction with managed facilities.',
            ],
            [
                'name' => 'Nintavur Beach Park',
                'category' => 'Beach & Park',
                'slug' => 'nintavur-beach-park',
                'short_description' => 'A coastal park-style stop with open beach access and room for a slower-paced visit.',
                'full_description' => 'Nintavur Beach Park is useful for itinerary plans that continue south of Kalmunai and still want a clear beachfront stop. It offers wide coastal views and can be combined with Oluvil-bound attractions in the same route.',
                'address' => 'Nintavur 32340, Sri Lanka',
                'latitude' => 7.3528192,
                'longitude' => 81.8581643,
                'distance_from_home' => 10.5,
                'opening_time' => '05:30',
                'closing_time' => '19:00',
                'visit_duration_minutes' => 85,
                'travel_tips' => 'Bring shade or water if visiting in midday hours; the open beach setting offers limited natural cover.',
            ],
            [
                'name' => 'Oluvil Lighthouse',
                'category' => 'Lighthouse & Coast',
                'slug' => 'oluvil-lighthouse',
                'short_description' => 'A distinctive maritime landmark on the southern east coast with strong visual appeal.',
                'full_description' => 'Oluvil Lighthouse is one of the most recognizable coastal landmarks in the area and makes a strong anchor stop for a longer southbound route. Its value is mostly scenic and photographic, especially when paired with nearby shoreline visits.',
                'address' => 'Oluvil, Ampara District, Sri Lanka',
                'latitude' => 7.2904200,
                'longitude' => 81.8672300,
                'distance_from_home' => 12.0,
                'opening_time' => '06:00',
                'closing_time' => '18:30',
                'visit_duration_minutes' => 60,
                'travel_tips' => 'The surrounding coast is best visited in fair weather with enough daylight to enjoy the open seafront views.',
            ],
            [
                'name' => 'Maruthamunai Handloom Quarter',
                'category' => 'Crafts & Community',
                'slug' => 'maruthamunai-handloom-quarter',
                'short_description' => 'A community-linked stop that reflects the handloom identity long associated with Maruthamunai.',
                'full_description' => "Maruthamunai is known locally for handloom work, and this part of the town helps represent that living craft identity within the app's day-visit experience. It gives the itinerary a cultural stop that complements the beach-focused locations nearby.",
                'address' => 'Main Street, Maruthamunai, Sri Lanka',
                'latitude' => 7.4367544,
                'longitude' => 81.8130995,
                'distance_from_home' => 1.1,
                'opening_time' => '08:00',
                'closing_time' => '19:30',
                'visit_duration_minutes' => 50,
                'travel_tips' => 'This stop works best during daytime business hours when local craft activity is more visible.',
            ],
        ];

        foreach ($places as $placeData) {
            $category = $categories[$placeData['category']];

            Place::updateOrCreate(
                ['slug' => $placeData['slug']],
                [
                    'category_id' => $category->id,
                    'name' => $placeData['name'],
                    'slug' => $placeData['slug'],
                    'short_description' => $placeData['short_description'],
                    'full_description' => $placeData['full_description'],
                    'address' => $placeData['address'],
                    'latitude' => $placeData['latitude'],
                    'longitude' => $placeData['longitude'],
                    'distance_from_home' => $placeData['distance_from_home'],
                    'opening_time' => $placeData['opening_time'],
                    'closing_time' => $placeData['closing_time'],
                    'visit_duration_minutes' => $placeData['visit_duration_minutes'],
                    'travel_tips' => $placeData['travel_tips'],
                    'status' => 'active',
                    'is_featured' => true,
                ],
            );
        }
    }
}