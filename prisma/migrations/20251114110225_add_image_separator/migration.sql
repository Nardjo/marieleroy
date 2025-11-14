-- CreateTable
CREATE TABLE "image_separator" (
    "id" TEXT NOT NULL,
    "desktopImage" TEXT,
    "mobileImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_separator_pkey" PRIMARY KEY ("id")
);
