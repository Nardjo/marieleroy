-- AlterTable
ALTER TABLE "hero_section" DROP COLUMN "avatarUrls";
ALTER TABLE "hero_section" ADD COLUMN "avatars" JSONB NOT NULL DEFAULT '[]';
