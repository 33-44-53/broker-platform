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
        if ($request->artisan_id) {
            $orders = Order::where('artisan_id', $request->artisan_id)->get();
        } else {
            $orders = Order::where('buyer_id', $request->buyer_id)->get();
        }
        return response()->json($orders);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        $order->update($request->only(['status', 'payment_status']));
        return response()->json(['success' => true, 'order' => $order]);
    }
}
