-- KiSHORi VATiKA - MySQL schema + application query templates
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS kv_website
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE kv_website;

SET NAMES utf8mb4;

-- =========================
-- Core tables
-- =========================

CREATE TABLE IF NOT EXISTS User (
  id VARCHAR(32) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NULL,
  password VARCHAR(255) NULL,
  role ENUM('CUSTOMER', 'OWNER') NOT NULL DEFAULT 'CUSTOMER',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastVisitAt DATETIME NULL
);

CREATE TABLE IF NOT EXISTS Offer (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  validFrom DATETIME NOT NULL,
  validTo DATETIME NOT NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  heroImageUrl VARCHAR(1024) NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX Offer_createdAt_idx (createdAt),
  INDEX Offer_isActive_validFrom_validTo_idx (isActive, validFrom, validTo)
);

CREATE TABLE IF NOT EXISTS Enquiry (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  message TEXT NOT NULL,
  checkIn DATETIME NOT NULL,
  checkOut DATETIME NOT NULL,
  guests INT NOT NULL,
  source VARCHAR(100) NOT NULL DEFAULT 'website',
  status ENUM('NEW', 'CONTACTED', 'BOOKED', 'CANCELLED') NOT NULL DEFAULT 'NEW',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  offerId VARCHAR(32) NULL,
  userId VARCHAR(32) NULL,
  CONSTRAINT Enquiry_offer_fk FOREIGN KEY (offerId) REFERENCES Offer(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT Enquiry_user_fk FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX Enquiry_createdAt_idx (createdAt),
  INDEX Enquiry_offerId_idx (offerId),
  INDEX Enquiry_status_createdAt_idx (status, createdAt)
);

CREATE TABLE IF NOT EXISTS Visit (
  id VARCHAR(32) PRIMARY KEY,
  userId VARCHAR(32) NULL,
  sessionId VARCHAR(191) NOT NULL,
  ip VARCHAR(128) NULL,
  userAgent TEXT NULL,
  path VARCHAR(1024) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Visit_user_fk FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX Visit_createdAt_idx (createdAt),
  INDEX Visit_sessionId_idx (sessionId)
);

CREATE TABLE IF NOT EXISTS OfferFeature (
  id VARCHAR(32) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  offerId VARCHAR(32) NOT NULL,
  CONSTRAINT OfferFeature_offer_fk FOREIGN KEY (offerId) REFERENCES Offer(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS SocialAccount (
  id VARCHAR(32) PRIMARY KEY,
  platform ENUM('FACEBOOK', 'INSTAGRAM') NOT NULL,
  pageId VARCHAR(255) NULL,
  accountId VARCHAR(255) NULL,
  accessToken TEXT NOT NULL,
  refreshToken TEXT NULL,
  expiresAt DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY SocialAccount_platform_key (platform)
);

CREATE TABLE IF NOT EXISTS OfferPublication (
  id VARCHAR(32) PRIMARY KEY,
  offerId VARCHAR(32) NOT NULL,
  platform ENUM('FACEBOOK', 'INSTAGRAM') NOT NULL,
  status ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
  externalPostId VARCHAR(255) NULL,
  errorMessage TEXT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  socialAccountId VARCHAR(32) NULL,
  CONSTRAINT OfferPublication_offer_fk FOREIGN KEY (offerId) REFERENCES Offer(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT OfferPublication_social_fk FOREIGN KEY (socialAccountId) REFERENCES SocialAccount(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX OfferPublication_offerId_createdAt_idx (offerId, createdAt),
  INDEX OfferPublication_platform_createdAt_idx (platform, createdAt)
);

CREATE TABLE IF NOT EXISTS AnalyticsEvent (
  id VARCHAR(32) PRIMARY KEY,
  type ENUM('PAGE_VIEW', 'OFFER_CLICK', 'ENQUIRY_SUBMITTED') NOT NULL,
  userId VARCHAR(32) NULL,
  sessionId VARCHAR(191) NOT NULL,
  offerId VARCHAR(32) NULL,
  path VARCHAR(1024) NULL,
  metadata JSON NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT AnalyticsEvent_user_fk FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT AnalyticsEvent_offer_fk FOREIGN KEY (offerId) REFERENCES Offer(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX AnalyticsEvent_createdAt_idx (createdAt),
  INDEX AnalyticsEvent_type_createdAt_idx (type, createdAt),
  INDEX AnalyticsEvent_offerId_createdAt_idx (offerId, createdAt),
  INDEX AnalyticsEvent_sessionId_createdAt_idx (sessionId, createdAt)
);

-- =========================
-- Operational tables
-- =========================

CREATE TABLE IF NOT EXISTS Visitor (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  sessionId VARCHAR(191) NOT NULL UNIQUE,
  ip VARCHAR(128) NULL,
  userAgent TEXT NULL,
  firstSeenAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastSeenAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastPath VARCHAR(1024) NULL,
  INDEX Visitor_lastSeenAt_idx (lastSeenAt)
);

CREATE TABLE IF NOT EXISTS UserPreference (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  sessionId VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `value` TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY UserPreference_session_key_unique (sessionId, `key`)
);

CREATE TABLE IF NOT EXISTS ContactMessage (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  message TEXT NOT NULL,
  source VARCHAR(100) NOT NULL DEFAULT 'website',
  path VARCHAR(1024) NULL,
  sessionId VARCHAR(191) NULL,
  ip VARCHAR(128) NULL,
  userAgent TEXT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ContactMessage_createdAt_idx (createdAt)
);

CREATE TABLE IF NOT EXISTS NewsletterSignup (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  source VARCHAR(100) NOT NULL DEFAULT 'website',
  sessionId VARCHAR(191) NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS AdminActivity (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  adminId VARCHAR(32) NULL,
  action VARCHAR(191) NOT NULL,
  entity VARCHAR(191) NULL,
  entityId VARCHAR(64) NULL,
  metadata JSON NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX AdminActivity_createdAt_idx (createdAt)
);

CREATE TABLE IF NOT EXISTS ErrorLog (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  level VARCHAR(20) NOT NULL DEFAULT 'error',
  message TEXT NOT NULL,
  stack TEXT NULL,
  path VARCHAR(1024) NULL,
  context JSON NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ErrorLog_createdAt_idx (createdAt)
);

-- =========================
-- Query templates
-- =========================
-- Use placeholders (?) with your MySQL driver.

-- Auth / user
-- Find owner by email:
-- SELECT id, email, name, role, password FROM User WHERE email = ? LIMIT 1;
-- Update last visit:
-- UPDATE User SET lastVisitAt = NOW() WHERE id = ?;

-- Public offers
-- Active offers:
-- SELECT id, title, description, price, validFrom, validTo, isActive
-- FROM Offer
-- WHERE isActive = 1 AND validFrom <= NOW() AND validTo >= NOW()
-- ORDER BY validTo ASC
-- LIMIT ?;
-- Offer by id:
-- SELECT id, title, description, price, validFrom, validTo, isActive
-- FROM Offer WHERE id = ? LIMIT 1;
-- Offer features:
-- SELECT label, value FROM OfferFeature WHERE offerId = ?;

-- Enquiry
-- Create enquiry:
-- INSERT INTO Enquiry (id, name, email, phone, message, checkIn, checkOut, guests, source, status, offerId, userId)
-- VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'website', 'NEW', ?, ?);
-- Update enquiry status:
-- UPDATE Enquiry SET status = ? WHERE id = ?;
-- List enquiries:
-- SELECT id, name, email, checkIn, checkOut, status, createdAt, offerId
-- FROM Enquiry
-- ORDER BY createdAt DESC
-- LIMIT ? OFFSET ?;

-- Analytics
-- Upsert visitor:
-- INSERT INTO Visitor (sessionId, ip, userAgent, firstSeenAt, lastSeenAt, lastPath)
-- VALUES (?, ?, ?, NOW(), NOW(), ?)
-- ON DUPLICATE KEY UPDATE
--   ip = VALUES(ip),
--   userAgent = VALUES(userAgent),
--   lastSeenAt = NOW(),
--   lastPath = VALUES(lastPath);
-- Insert visit:
-- INSERT INTO Visit (id, userId, sessionId, ip, userAgent, path)
-- VALUES (?, ?, ?, ?, ?, ?);
-- Insert analytics event:
-- INSERT INTO AnalyticsEvent (id, type, userId, sessionId, offerId, path, metadata)
-- VALUES (?, ?, ?, ?, ?, ?, ?);
-- Analytics summary (last 30 days):
-- SELECT DATE(createdAt) AS day, COUNT(*) AS events
-- FROM AnalyticsEvent
-- WHERE createdAt >= NOW() - INTERVAL 30 DAY
-- GROUP BY DATE(createdAt)
-- ORDER BY day ASC;

-- Contact / newsletter
-- INSERT INTO ContactMessage (id, name, email, phone, message, source, path, sessionId, ip, userAgent)
-- VALUES (UUID(), ?, ?, ?, ?, 'website', ?, ?, ?, ?);
-- INSERT INTO NewsletterSignup (id, email, source, sessionId)
-- VALUES (UUID(), ?, 'website', ?)
-- ON DUPLICATE KEY UPDATE source = VALUES(source);

-- Preferences
-- INSERT INTO UserPreference (id, sessionId, `key`, `value`)
-- VALUES (UUID(), ?, ?, ?)
-- ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updatedAt = NOW();

-- Social accounts and publications
-- Upsert social account by platform:
-- INSERT INTO SocialAccount (id, platform, pageId, accountId, accessToken, refreshToken, expiresAt)
-- VALUES (?, ?, ?, ?, ?, ?, ?)
-- ON DUPLICATE KEY UPDATE
--   pageId = VALUES(pageId),
--   accountId = VALUES(accountId),
--   accessToken = VALUES(accessToken),
--   refreshToken = VALUES(refreshToken),
--   expiresAt = VALUES(expiresAt);
-- Insert publication row:
-- INSERT INTO OfferPublication (id, offerId, platform, status, externalPostId, errorMessage, socialAccountId)
-- VALUES (?, ?, ?, ?, ?, ?, ?);

-- Admin logs / errors
-- INSERT INTO AdminActivity (id, adminId, action, entity, entityId, metadata)
-- VALUES (UUID(), ?, ?, ?, ?, ?);
-- INSERT INTO ErrorLog (id, level, message, stack, path, context)
-- VALUES (UUID(), ?, ?, ?, ?, ?);

