/*
  Warnings:

  - You are about to drop the column `direction` on the `lastTrade` table. All the data in the column will be lost.
  - You are about to drop the column `notified` on the `lastTrade` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lastTrade" (
    "ticker" TEXT NOT NULL PRIMARY KEY,
    "atr" REAL NOT NULL,
    "size" REAL NOT NULL,
    "targetPrice" REAL NOT NULL
);
INSERT INTO "new_lastTrade" ("atr", "size", "targetPrice", "ticker") SELECT "atr", "size", "targetPrice", "ticker" FROM "lastTrade";
DROP TABLE "lastTrade";
ALTER TABLE "new_lastTrade" RENAME TO "lastTrade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
