<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['order_number', 'buyer_id', 'buyer_name', 'total', 'status', 'payment_status', 'payment_method', 'delivery_address'];
    
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
