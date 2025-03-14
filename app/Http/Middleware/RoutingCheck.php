<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoutingCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('cp*')) {
            return $next($request);
        }

        $allowedRegions = ['americas', 'apac', 'emea'];
        $firstSegment  = $request->segment(1);

        if (! in_array($firstSegment, $allowedRegions)) {
            return redirect('/americas/' . $request->path(), 301);
        }

        return $next($request);
    }
}
