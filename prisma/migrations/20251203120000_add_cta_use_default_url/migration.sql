-- Add ctaUseDefaultUrl to testimonials_header
ALTER TABLE "testimonials_header" ADD COLUMN "ctaUseDefaultUrl" BOOLEAN NOT NULL DEFAULT true;

-- Add ctaUseDefaultUrl to hero_section
ALTER TABLE "hero_section" ADD COLUMN "ctaUseDefaultUrl" BOOLEAN NOT NULL DEFAULT true;

-- Add ctaUseDefaultUrl to method_header
ALTER TABLE "method_header" ADD COLUMN "ctaUseDefaultUrl" BOOLEAN NOT NULL DEFAULT true;

-- Add ctaButtonUrl and ctaUseDefaultUrl to cost_of_inaction_section
ALTER TABLE "cost_of_inaction_section" ADD COLUMN "ctaButtonUrl" TEXT;
ALTER TABLE "cost_of_inaction_section" ADD COLUMN "ctaUseDefaultUrl" BOOLEAN NOT NULL DEFAULT true;
