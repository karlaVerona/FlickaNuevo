<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // User::factory()->create([...]);  ← comentado, usaba columna 'name' que no existe

        $this->call(AdminUserSeeder::class);
    }
}