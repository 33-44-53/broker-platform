<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;

class ProfileController
{
    public function show(Request $request)
    {
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $user]);
    }

    public function update(Request $request)
    {
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }
        
        $user->update([
            'name' => $request->name,
            'bio' => $request->bio,
            'location' => $request->location,
            'skills' => $request->skills,
            'phone' => $request->phone,
            'national_id' => $request->national_id,
            'national_id_photo' => $request->national_id_photo,
        ]);
        
        return response()->json(['success' => true, 'message' => 'Profile updated successfully', 'data' => $user]);
    }
}
