import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function verifyUser() {
  try {
    const email = 'jordanbastin@pm.me'
    const password = 'Mangue2809'

    console.log('🔍 Searching for user:', email)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      console.log('❌ User not found in database')
      console.log('\n📝 All users in database:')
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      })
      console.log(allUsers)
      return
    }

    console.log('✅ User found!')
    console.log('   - ID:', user.id)
    console.log('   - Email:', user.email)
    console.log('   - Name:', user.firstName, user.lastName)
    console.log('   - Role:', user.role)
    console.log('   - Created:', user.createdAt)

    // Test password
    console.log('\n🔐 Testing password...')
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (isPasswordValid) {
      console.log('✅ Password is correct!')
    } else {
      console.log('❌ Password is incorrect!')
      console.log('   - Stored hash:', user.password.substring(0, 20) + '...')

      // Try with new hash
      console.log('\n🔄 Generating new hash for comparison:')
      const newHash = await bcrypt.hash(password, 10)
      console.log('   - New hash:', newHash.substring(0, 20) + '...')

      const testAgain = await bcrypt.compare(password, newHash)
      console.log('   - Test with new hash:', testAgain ? '✅ Works' : '❌ Failed')
    }

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

verifyUser()
