<?php

namespace App\Mailer\Transport;

use League\OAuth2\Client\Provider\GenericProvider;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\Smtp\Auth\XOAuth2Authenticator;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Psr\Log\LoggerInterface;

class Office365SmtpTransport extends AbstractTransport
{
  private ?string $accessToken = null;

  public function __construct(
    private string $username,
    private string $clientId,
    private string $clientSecret,
    private string $tenantId,
    LoggerInterface $logger = null
  )
  {
    // Passing null as the dispatcher since it's not used in this transport.
    parent::__construct(null, $logger);
  }

  public function __toString(): string
  {
    return 'office365+smtp';
  }

  protected function doSend(SentMessage $message): void
  {
    // Retrieve an access token using OAuth2.
    $accessToken = $this->getAccessToken();

    // Set up the underlying SMTP transport with Office 365 SMTP details.
    $smtpTransport = new EsmtpTransport(
      'smtp.office365.com',
      587,
      false,
      authenticators: [
        new XOAuth2Authenticator(),
      ]
    );
    $smtpTransport->setUsername($this->username);
    // Use the OAuth2 access token as the password.
    $smtpTransport->setPassword($accessToken);

    // Delegate the sending of the message to the underlying SMTP transport.
    // This method accepts a SentMessage instance.
    $smtpTransport->send($message->getMessage(), $message->getEnvelope());
  }

  private function getAccessToken(): string
  {
    if ($this->accessToken) {
      return $this->accessToken;
    }

    $provider = new GenericProvider([
      'clientId' => $this->clientId,
      'clientSecret' => $this->clientSecret,
      'redirectUri' => 'https://localhost', // Not used for this flow
      'urlAuthorize' => 'https://login.microsoftonline.com/' . $this->tenantId . '/oauth2/v2.0/authorize',
      'urlAccessToken' => 'https://login.microsoftonline.com/' . $this->tenantId . '/oauth2/v2.0/token',
      'urlResourceOwnerDetails' => '',
      'scopes' => ['https://outlook.office365.com/.default'],
    ]);

    $accessToken = $provider->getAccessToken('client_credentials');

    $this->accessToken = $accessToken->getToken();

    return $this->accessToken;
  }
}

