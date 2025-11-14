import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUser() {
  try {
    const email = 'jordanbastin@pm.me'
    const password = 'Mangue2809'
    const firstName = 'Jordan'
    const lastName = 'Bastin'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('✅ User already exists:', email)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log('✅ User created successfully!')
    console.log('   - Email:', user.email)
    console.log('   - Name:', user.firstName, user.lastName)
    console.log('   - Role:', user.role)
  } catch (error) {
    console.error('❌ Error creating user:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createUser()
