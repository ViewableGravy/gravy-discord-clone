/*
  Warnings:

  - Made the column `username` on table `PendingUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PendingUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "notifications" BOOLEAN NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "signupHash" TEXT NOT NULL,
    "signupSalt" TEXT NOT NULL,
    "createdAt" DATETIME
);
INSERT INTO "new_PendingUser" ("createdAt", "displayName", "dob", "email", "hash", "id", "notifications", "salt", "signupHash", "signupSalt", "username") SELECT "createdAt", "displayName", "dob", "email", "hash", "id", "notifications", "salt", "signupHash", "signupSalt", "username" FROM "PendingUser";
DROP TABLE "PendingUser";
ALTER TABLE "new_PendingUser" RENAME TO "PendingUser";
CREATE UNIQUE INDEX "PendingUser_username_key" ON "PendingUser"("username");
CREATE UNIQUE INDEX "PendingUser_email_key" ON "PendingUser"("email");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "notifications" BOOLEAN NOT NULL,
    "dateVerified" DATETIME,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);
INSERT INTO "new_User" ("dateVerified", "displayName", "dob", "email", "hash", "id", "notifications", "salt", "username") SELECT "dateVerified", "displayName", "dob", "email", "hash", "id", "notifications", "salt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
