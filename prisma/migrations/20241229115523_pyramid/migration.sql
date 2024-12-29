/*
  Warnings:

  - You are about to drop the column `entryPrice` on the `pyramid` table. All the data in the column will be lost.
  - Added the required column `targetPrice` to the `pyramid` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pyramid" (
    "ticker" TEXT NOT NULL PRIMARY KEY,
    "direction" TEXT NOT NULL,
    "unitSize" DECIMAL NOT NULL,
    "count" INTEGER NOT NULL,
    "atr" DECIMAL NOT NULL,
    "targetPrice" DECIMAL NOT NULL
);
INSERT INTO "new_pyramid" ("atr", "count", "direction", "ticker", "unitSize") SELECT "atr", "count", "direction", "ticker", "unitSize" FROM "pyramid";
DROP TABLE "pyramid";
ALTER TABLE "new_pyramid" RENAME TO "pyramid";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
