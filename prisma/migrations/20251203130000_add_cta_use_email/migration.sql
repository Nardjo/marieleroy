-- Add ctaUseEmail and ctaEmailSubject to testimonials_header
ALTER TABLE "testimonials_header" ADD COLUMN "ctaUseEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "testimonials_header" ADD COLUMN "ctaEmailSubject" TEXT;

-- Add ctaUseEmail and ctaEmailSubject to hero_section
ALTER TABLE "hero_section" ADD COLUMN "ctaUseEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "hero_section" ADD COLUMN "ctaEmailSubject" TEXT;

-- Add ctaUseEmail and ctaEmailSubject to method_header
ALTER TABLE "method_header" ADD COLUMN "ctaUseEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "method_header" ADD COLUMN "ctaEmailSubject" TEXT;

-- Add ctaUseEmail and ctaEmailSubject to cost_of_inaction_section
ALTER TABLE "cost_of_inaction_section" ADD COLUMN "ctaUseEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "cost_of_inaction_section" ADD COLUMN "ctaEmailSubject" TEXT;
