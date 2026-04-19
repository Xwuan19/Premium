var modifiedHeaders = $request.headers;
var eTag = "X-RevenueCat-ETag";
var eTagLower = "x-revenuecat-etag";

if (modifiedHeaders[eTag]) { modifiedHeaders[eTag] = ""; }
if (modifiedHeaders[eTagLower]) { modifiedHeaders[eTagLower] = ""; }

$done({headers: modifiedHeaders});
