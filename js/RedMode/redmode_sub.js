/**
 * @name RedMode Pro Unlock
 * @author Xwuan
 * @description Unlock Premium features for RedMode
 */

var obj = JSON.parse($response.body);

obj.Attention = "RedMode Premium đã được kích hoạt bởi Xwuan! Chúc bạn dùng vui vẻ.";

var redmode_data = {
  "is_sandbox": false,
  "ownership_type": "PURCHASED",
  "billing_issues_detected_at": null,
  "period_type": "normal",
  "expires_date": "2099-12-31T23:59:59Z",
  "grace_period_expires_date": null,
  "unsubscribe_detected_at": null,
  "original_purchase_date": "2024-01-01T00:00:00Z",
  "purchase_date": "2024-01-01T00:00:00Z",
  "store": "app_store"
};

obj.subscriber.subscriptions["com.redmode.pro"] = redmode_data;
obj.subscriber.entitlements["pro"] = {
  "grace_period_expires_date": null,
  "purchase_date": "2024-01-01T00:00:00Z",
  "product_identifier": "com.redmode.pro",
  "expires_date": "2099-12-31T23:59:59Z"
};

$done({body: JSON.stringify(obj)});
