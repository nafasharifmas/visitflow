<?php
namespace Tests\Feature;
use App\Models\Category; use App\Models\Place; use Illuminate\Foundation\Testing\RefreshDatabase; use Tests\TestCase;
class PlaceApiTest extends TestCase { use RefreshDatabase; public function test_places_can_be_searched_and_filtered():void { $beach=Category::create(['name'=>'Beach','slug'=>'beach','status'=>'active']); Place::create(['category_id'=>$beach->id,'name'=>'Emerald Coast','slug'=>'emerald-coast','short_description'=>'Sample','address'=>'Sample','latitude'=>6.0,'longitude'=>80.0,'distance_from_home'=>5,'opening_time'=>'06:00','closing_time'=>'18:00','visit_duration_minutes'=>60,'status'=>'active']); $this->getJson('/api/v1/places?search=Emerald&category=beach')->assertOk()->assertJsonPath('data.0.slug','emerald-coast'); } }
