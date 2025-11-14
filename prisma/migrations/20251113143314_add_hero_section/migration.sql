-- CreateTable
CREATE TABLE "hero_section" (
    "id" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_section_pkey" PRIMARY KEY ("id")
);
