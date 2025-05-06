<?php

use App\Http\Controllers\Api\CsrfTokenController;
use App\Http\Controllers\HomeController;
use App\Http\Middleware\CacheControl;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class);
Route::get('/csrf-token', CsrfTokenController::class)
  ->withoutMiddleware(CacheControl::class);
