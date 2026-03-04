<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    protected $fillable = ['dispute_number', 'buyer_id', 'buyer_name', 'artisan_id', 'artisan_name', 'order_id', 'issue_type', 'description', 'status'];
}
