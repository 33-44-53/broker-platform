<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;

class AnalyticsController
{
    public function index(Request $request)
    {
        $userId = $request->user_id;
        $role = $request->role;

        if ($role === 'artisan') {
            $products = Product::where('artisan_id', $userId)->get();
            $orders = Order::where('artisan_id', $userId)->get();

            return response()->json([
                'totalRevenue' => $orders->sum('total'),
                'totalOrders' => $orders->count(),
                'activeProducts' => $products->where('is_active', true)->count(),
                'categoryDistribution' => $products->groupBy('category')->map(fn($g) => ['category' => $g[0]->category, 'count' => $g->count()]),
                'monthlySales' => $orders->groupBy(fn($o) => $o->created_at->format('M'))->map(fn($g) => ['month' => $g[0]->created_at->format('M'), 'sales' => $g->sum('total')])
            ]);
        }

        return response()->json(['success' => true]);
    }
}
