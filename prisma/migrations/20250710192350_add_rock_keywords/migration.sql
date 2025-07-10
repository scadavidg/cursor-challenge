/*
  Warnings:

  - You are about to drop the `RockKeyword` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RockKeyword";

-- CreateTable
CREATE TABLE "rock_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "rock_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rock_keywords_keyword_key" ON "rock_keywords"("keyword");
