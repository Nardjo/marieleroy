-- AlterTable: Add eyebrow and bigPromise columns, migrate description to eyebrow, then drop description
ALTER TABLE "hero_section" ADD COLUMN "eyebrow" TEXT;
ALTER TABLE "hero_section" ADD COLUMN "bigPromise" TEXT;

-- Copy existing description data to eyebrow
UPDATE "hero_section" SET "eyebrow" = "description";

-- Drop the description column
ALTER TABLE "hero_section" DROP COLUMN "description";
