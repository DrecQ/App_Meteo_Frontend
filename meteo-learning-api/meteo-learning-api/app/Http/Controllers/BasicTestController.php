<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BasicTestController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Basic test working!']);
    }
}
