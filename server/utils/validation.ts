import { z } from 'zod'

// Custom validator for URLs and relative paths
const urlOrPath = z.string().refine(
  (val) => {
    // Allow relative paths starting with /
    if (val.startsWith('/')) return true
    // Allow full URLs
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  },
  { message: 'Invalid URL or path' }
)

// FAQ Schemas
export const faqCreateSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  displayOrder: z.number().int().optional(),
})

export const faqUpdateSchema = faqCreateSchema.partial()

// Testimonial Schemas
export const testimonialCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  quote: z.string().min(1, 'Quote is required'),
  embedUrl: z.string().url({ message: 'Invalid URL format' }),
  displayOrder: z.number().int().optional(),
})

export const testimonialUpdateSchema = z
  .object({
    title: z.string().min(1, 'Title is required').optional(),
    quote: z.string().min(1, 'Quote is required').optional(),
    embedUrl: z.string().url({ message: 'Invalid URL format' }).optional(),
    displayOrder: z.number().int().optional(),
  })
  .strict()

// About Section Schema
export const aboutSectionSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().min(1),
  imageUrl: urlOrPath.optional(),
})

// Method Schemas
export const methodHeaderSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
})

export const methodStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  stepOrder: z.number().int().min(1),
})

// Settings Schemas
export const siteSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().nullable(),
  type: z.string().optional(),
})

export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url().nullable(),
})

export const seoSettingsSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogImage: urlOrPath.optional(),
  twitterCard: z.string().optional(),
  robotsTxt: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
})
