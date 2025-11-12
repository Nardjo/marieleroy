export interface Testimonial {
  id: string
  title: string
  quote: string
  embedUrl: string
  displayOrder: number
  createdAt?: Date
  updatedAt?: Date
}

export interface TestimonialInput {
  title: string
  quote: string
  embedUrl: string
  displayOrder?: number
}
