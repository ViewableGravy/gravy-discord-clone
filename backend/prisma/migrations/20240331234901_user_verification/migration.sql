/*
  Warnings:

  - Added the required column `displayName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notifications` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verified` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "_id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "notifications" BOOLEAN NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "signupCode" TEXT,
    "dateVerified" DATETIME,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);
INSERT INTO "new_User" ("_id", "email", "hash", "salt", "username") SELECT "_id", "email", "hash", "salt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
