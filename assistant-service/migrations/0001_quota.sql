CREATE TABLE assistant_quota (
  bucket TEXT PRIMARY KEY NOT NULL,
  used INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX assistant_quota_expiry ON assistant_quota(expires_at);
