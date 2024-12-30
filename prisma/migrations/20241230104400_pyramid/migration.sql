/*
  Warnings:

  - Added the required column `notified` to the `lastTrade` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lastTrade" (
    "ticker" TEXT NOT NULL PRIMARY KEY,
    "direction" TEXT NOT NULL,
    "notified" BOOLEAN NOT NULL
);
INSERT INTO "new_lastTrade" ("direction", "ticker") SELECT "direction", "ticker" FROM "lastTrade";
DROP TABLE "lastTrade";
ALTER TABLE "new_lastTrade" RENAME TO "lastTrade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
