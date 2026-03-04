<?php

namespace App\Http\Controllers\Api;

use App\Models\Auction;
use Illuminate\Http\Request;

class AuctionController
{
    public function store(Request $request)
    {
        if ($request->action === 'request') {
            $auction = Auction::create([
                'product_id' => $request->product_id,
                'product_name' => $request->product_name,
                'product_image' => $request->product_image,
                'artisan_id' => $request->artisan_id,
                'artisan_name' => $request->artisan_name,
                'starting_bid' => $request->starting_bid,
                'current_bid' => $request->starting_bid,
                'min_increment' => $request->min_increment,
                'description' => $request->description,
                'duration' => $request->duration,
                'status' => 'pending'
            ]);
            return response()->json(['success' => true, 'auction' => $auction]);
        }
    }

    public function index(Request $request)
    {
        if ($request->pending) {
            return response()->json(Auction::where('status', 'pending')->get());
        }
        return response()->json(Auction::all());
    }

    public function approve(Request $request)
    {
        $auction = Auction::find($request->auction_id);
        $auction->update([
            'status' => 'approved',
            'scheduled_date' => $request->scheduled_date,
            'end_time' => $request->end_time
        ]);
        return response()->json(['success' => true]);
    }

    public function reject(Request $request)
    {
        Auction::destroy($request->auction_id);
        return response()->json(['success' => true]);
    }
}
