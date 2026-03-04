<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'buyer'
        ]);
        return response()->json(['success' => true, 'user' => $user]);
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'error' => 'Invalid credentials'], 401);
        }
        return response()->json(['success' => true, 'user' => $user]);
    }

    public function getArtisans()
    {
        return response()->json(User::where('role', 'artisan')->get());
    }

    public function getBuyers()
    {
        return response()->json(User::where('role', 'buyer')->get());
    }

    public function toggleStatus(Request $request)
    {
        $user = User::find($request->user_id);
        $user->is_active = !$user->is_active;
        $user->save();
        return response()->json(['success' => true]);
    }
}
