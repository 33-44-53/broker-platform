<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

class ReviewController
{
    public function index(Request $request)
    {
        return response()->json([]);
    }

    public function store(Request $request)
    {
        return response()->json(['success' => true]);
    }
}
