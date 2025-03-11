<?php

namespace App\Providers;

use App\Mailer\Transport\Office365SmtpTransport;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Statamic\Statamic;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void {}

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    Mail::extend('office365', function ($config) {
      return new Office365SmtpTransport(
        $config['username'],
        $config['client_id'],
        $config['client_secret'],
        $config['tenant_id'],
        $config['refresh_token']
      );
    });

    // Force HTTPS on production and staging
    if ($this->app->environment('production', 'preprod', 'staging')) {
      URL::forceScheme('https');
    }

    // Statamic::vite('app', [
    //     'resources/js/cp.js',
    //     'resources/css/cp.css',
    // ]);
  }
}
