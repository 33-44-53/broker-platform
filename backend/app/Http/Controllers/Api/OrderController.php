<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController
{
    public function store(Request $request)
    {
        $orderData = $request->except('order_items');
        $orderData['order_number'] = 'ORD-' . time() . '-' . rand(1000, 9999);
        
        $order = Order::create($orderData);
        
        if ($request->order_items) {
            foreach ($request->order_items as $item) {
                $order->items()->create($item);
            }
        }
        
        return response()->json(['success' => true, 'order' => $order]);
    }

    public function index(Request $request)
    {
        if ($request->artisan_id) {
            $orders = Order::whereHas('items', function ($query) use ($request) {
                $query->whereIn('product_id', function ($subquery) use ($request) {
                    $subquery->select('id')->from('products')->where('artisan_id', $request->artisan_id);
                });
            })->with('items')->get();
        } else {
            $orders = Order::where('buyer_id', $request->buyer_id)->with('items')->get();
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
