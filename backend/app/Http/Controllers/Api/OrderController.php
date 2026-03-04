<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController
{
    public function store(Request $request)
    {
        $order = Order::create($request->all());
        return response()->json(['success' => true, 'order' => $order]);
    }

    public function index(Request $request)
    {
        $orders = Order::where('buyer_id', $request->buyer_id)->get();
        return response()->json($orders);
    }
}
