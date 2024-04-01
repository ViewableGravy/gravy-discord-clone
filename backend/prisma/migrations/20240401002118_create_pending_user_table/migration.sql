/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `signupCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateTable
CREATE TABLE "PendingUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "notifications" BOOLEAN NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "signupCode" TEXT,
    "createdAt" DATETIME
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__UserFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__UserFollows" ("A", "B") SELECT "A", "B" FROM "_UserFollows";
DROP TABLE "_UserFollows";
ALTER TABLE "new__UserFollows" RENAME TO "_UserFollows";
CREATE UNIQUE INDEX "_UserFollows_AB_unique" ON "_UserFollows"("A", "B");
CREATE INDEX "_UserFollows_B_index" ON "_UserFollows"("B");
CREATE TABLE "new_Message" (
    "_id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("_id", "conversationId", "createdAt", "senderId", "text") SELECT "_id", "conversationId", "createdAt", "senderId", "text" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_Session" (
    "_id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("_id", "expires", "token", "userId") SELECT "_id", "expires", "token", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "notifications" BOOLEAN NOT NULL,
    "dateVerified" DATETIME,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);
INSERT INTO "new_User" ("dateVerified", "displayName", "dob", "email", "hash", "notifications", "salt", "username") SELECT "dateVerified", "displayName", "dob", "email", "hash", "notifications", "salt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new__ConversationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ConversationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation" ("_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ConversationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__ConversationToUser" ("A", "B") SELECT "A", "B" FROM "_ConversationToUser";
DROP TABLE "_ConversationToUser";
ALTER TABLE "new__ConversationToUser" RENAME TO "_ConversationToUser";
CREATE UNIQUE INDEX "_ConversationToUser_AB_unique" ON "_ConversationToUser"("A", "B");
CREATE INDEX "_ConversationToUser_B_index" ON "_ConversationToUser"("B");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_username_key" ON "PendingUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_email_key" ON "PendingUser"("email");
