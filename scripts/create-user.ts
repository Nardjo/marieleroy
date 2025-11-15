import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Promisify readline question
function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createUser() {
  try {
    console.log('\n🔐 Create Admin User\n')

    // Get user input
    const email = await question('Email: ')
    const password = await question('Password: ')
    const firstName = await question('First Name: ')
    const lastName = await question('Last Name: ')

    if (!email || !password || !firstName) {
      console.error('❌ Email, password, and first name are required!')
      process.exit(1)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      console.log('\n❌ User already exists:', email)
      rl.close()
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName: lastName || '',
        name: `${firstName} ${lastName || ''}`.trim(),
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log('\n✅ User created successfully!')
    console.log('   - Email:', user.email)
    console.log('   - Name:', user.name)
    console.log('   - Role:', user.role)
    console.log('')
  } catch (error) {
    console.error('\n❌ Error creating user:', error)
    throw error
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

createUser()
