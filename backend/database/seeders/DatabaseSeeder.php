<?php
namespace Database\Seeders;
use App\Models\Setting; use App\Models\User; use Illuminate\Database\Seeder; use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder {
 public function run():void {
  User::updateOrCreate(['email'=>'admin@example.com'],['name'=>'Development Admin','password'=>Hash::make('Password123!'),'role'=>'admin','status'=>'active']);
  User::updateOrCreate(['email'=>'user@example.com'],['name'=>'Development User','password'=>Hash::make('Password123!'),'role'=>'user','status'=>'active']);
  Setting::upsertMany(Setting::defaults());
  $this->call(PlaceSeeder::class);
 }
}