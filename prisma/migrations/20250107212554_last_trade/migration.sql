/*
  Warnings:

  - Added the required column `atr` to the `lastTrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `lastTrade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetPrice` to the `lastTrade` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lastTrade" (
    "ticker" TEXT NOT NULL PRIMARY KEY,
    "direction" TEXT NOT NULL,
    "atr" DECIMAL NOT NULL,
    "size" DECIMAL NOT NULL,
    "targetPrice" DECIMAL NOT NULL,
    "notified" BOOLEAN NOT NULL
);
INSERT INTO "new_lastTrade" ("direction", "notified", "ticker") SELECT "direction", "notified", "ticker" FROM "lastTrade";
DROP TABLE "lastTrade";
ALTER TABLE "new_lastTrade" RENAME TO "lastTrade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
