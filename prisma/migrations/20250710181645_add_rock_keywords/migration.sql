-- CreateTable
CREATE TABLE "RockKeyword" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "RockKeyword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RockKeyword_keyword_key" ON "RockKeyword"("keyword");
