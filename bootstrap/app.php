<?php

use App\Http\Middleware\CacheControl;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__ . '/../routes/web.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
      'csrf-token',
      '!/statamic-recaptcha/*',
      '!/forms/*'
    ]);

    $middleware->prependToGroup('web', \App\Http\Middleware\RoutingCheck::class);

    $middleware->appendToGroup('web', [
      CacheControl::class,
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions) {
    //
  })->create();
