<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auction extends Model
{
    protected $fillable = ['product_id', 'product_name', 'product_image', 'artisan_id', 'artisan_name', 'starting_bid', 'current_bid', 'min_increment', 'description', 'duration', 'scheduled_date', 'end_time', 'status', 'winner_id', 'winner_name'];
}
