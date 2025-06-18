<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SimpleTestController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Simple test working!']);
    }
}
