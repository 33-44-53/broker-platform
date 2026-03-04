<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'discount', 'category', 'images', 'artisan_id', 'artisan_name', 'artisan_location', 'stock', 'rating', 'reviews', 'is_active'];
    protected $casts = ['images' => 'json'];
}
