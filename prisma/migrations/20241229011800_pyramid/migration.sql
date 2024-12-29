-- CreateTable
CREATE TABLE "pyramid" (
    "ticker" TEXT NOT NULL PRIMARY KEY,
    "direction" TEXT NOT NULL,
    "unitSize" DECIMAL NOT NULL,
    "count" INTEGER NOT NULL,
    "atr" DECIMAL NOT NULL,
    "entryPrice" DECIMAL NOT NULL
);
