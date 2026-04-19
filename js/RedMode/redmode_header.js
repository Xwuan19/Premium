/**
 * @name RedMode Header Fix
 * @author Xwuan
 * @description Delete ETag to bypass RevenueCat cache
 */

var modifiedHeaders = $request.headers;
var eTag = "X-RevenueCat-ETag";
var eTagLower = "x-revenuecat-etag";

if (modifiedHeaders[eTag]) { modifiedHeaders[eTag] = ""; }
if (modifiedHeaders[eTagLower]) { modifiedHeaders[eTagLower] = ""; }

console.log("RedMode Header Fix by Xwuan Applied");
$done({headers: modifiedHeaders});
