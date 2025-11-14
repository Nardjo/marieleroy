-- AlterTable
ALTER TABLE "hero_section" ADD COLUMN     "avatarUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "clientsText" TEXT NOT NULL DEFAULT 'clients satisfaits';
