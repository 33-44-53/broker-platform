<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController
{
    public function index()
    {
        return response()->json(Product::all());
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (is_string($data['images'] ?? null)) {
            $data['images'] = json_decode($data['images'], true);
        }
        $product = Product::create($data);
        return response()->json(['success' => true, 'product' => $product]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $data = $request->all();
        if (is_string($data['images'] ?? null)) {
            $data['images'] = json_decode($data['images'], true);
        }
        $product->update($data);
        return response()->json(['success' => true, 'product' => $product]);
    }

    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json(['success' => true]);
    }
}
