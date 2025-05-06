<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CsrfTokenController extends Controller
{
  public function __invoke(Request $request)
  {
    return Response::json([
        'token' => csrf_token(),
      ])
      ->withHeaders([
        'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0'
      ]);
  }
}
