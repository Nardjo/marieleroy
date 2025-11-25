-- CreateTable
CREATE TABLE "testimonials_header" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL DEFAULT 'Témoignages',
    "title" TEXT NOT NULL,
    "highlight" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_header_pkey" PRIMARY KEY ("id")
);
