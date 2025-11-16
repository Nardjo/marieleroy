import { z } from 'zod'

/**
 * Nettoie les champs optionnels en convertissant les chaînes vides en null
 */
export const cleanOptionalField = (value: any): any => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'string' && value.trim() === '') return null
  return value
}

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
  subtitle: z.string().nullable().optional(),
  description: z.string().min(1),
  imageUrl: urlOrPath.nullable().optional(),
})

// Method Schemas
export const methodHeaderSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
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
  ogImage: z.union([z.string(), z.any()]).optional().transform(val => {
    // Si c'est un objet vide ou null, retourner une chaîne vide
    if (!val || (typeof val === 'object' && Object.keys(val).length === 0)) {
      return undefined
    }
    // Si c'est déjà une string, la retourner
    if (typeof val === 'string') {
      return val
    }
    return undefined
  }),
  twitterCard: z.string().optional(),
  robotsTxt: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
})

// User Profile Schemas
export const userProfileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional().nullable(),
  email: z.string().email('Invalid email format'),
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
