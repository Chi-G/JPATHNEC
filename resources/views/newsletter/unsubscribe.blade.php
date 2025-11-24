<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Unsubscribed</title>
  </head>
  <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial; color:#111;">
    <div style="max-width:720px;margin:0 auto;padding:24px;text-align:center;">
      @if(isset($status) && $status === 'success')
        <h2>You have been unsubscribed</h2>
        <p>If this was a mistake, you can always re-subscribe on the site.</p>
      @elseif(isset($status) && $status === 'not_found')
        <h2>Subscription not found</h2>
        <p>We couldn't find a subscription for that link. It may have already been used.</p>
      @else
        <h2>Unsubscribe</h2>
        <p>Processing...</p>
      @endif
    </div>
  </body> 
  </html>
