/*
  Warnings:

  - You are about to alter the column `atr` on the `lastTrade` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `size` on the `lastTrade` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `targetPrice` on the `lastTrade` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lastTrade" (
    "ticker" TEXT NOT NULL PRIMARY KEY,
    "direction" TEXT NOT NULL,
    "atr" REAL NOT NULL,
    "size" REAL NOT NULL,
    "targetPrice" REAL NOT NULL,
    "notified" BOOLEAN NOT NULL
);
INSERT INTO "new_lastTrade" ("atr", "direction", "notified", "size", "targetPrice", "ticker") SELECT "atr", "direction", "notified", "size", "targetPrice", "ticker" FROM "lastTrade";
DROP TABLE "lastTrade";
ALTER TABLE "new_lastTrade" RENAME TO "lastTrade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
