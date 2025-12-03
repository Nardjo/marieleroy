-- Add CTA fields to testimonials_header
ALTER TABLE "testimonials_header" ADD COLUMN "ctaTitle" TEXT;
ALTER TABLE "testimonials_header" ADD COLUMN "ctaDescription" TEXT;
ALTER TABLE "testimonials_header" ADD COLUMN "ctaButtonText" TEXT;
ALTER TABLE "testimonials_header" ADD COLUMN "ctaButtonUrl" TEXT;

-- Add CTA fields to hero_section
ALTER TABLE "hero_section" ADD COLUMN "ctaButtonText" TEXT;
ALTER TABLE "hero_section" ADD COLUMN "ctaButtonUrl" TEXT;

-- Add CTA fields to method_header
ALTER TABLE "method_header" ADD COLUMN "ctaTitle" TEXT;
ALTER TABLE "method_header" ADD COLUMN "ctaDescription" TEXT;
ALTER TABLE "method_header" ADD COLUMN "ctaButtonText" TEXT;
ALTER TABLE "method_header" ADD COLUMN "ctaButtonUrl" TEXT;

-- Set default values for existing records
UPDATE "testimonials_header" SET
  "ctaTitle" = 'Tu veux faire passer ton business au niveau supérieur ?',
  "ctaDescription" = 'Parle-moi de ton projet et on voit ensemble comment augmenter tes conversions sans t''épuiser.',
  "ctaButtonText" = 'Réserve ton appel offert';

UPDATE "hero_section" SET
  "ctaButtonText" = 'On discute ?';

UPDATE "method_header" SET
  "ctaTitle" = 'Besoin d''un regard expert sur ton marketing ?',
  "ctaDescription" = 'On analyse ton copywriting ensemble et je te montre ce qui peut réellement booster tes conversions.',
  "ctaButtonText" = 'Obtenir un audit gratuit';
