import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetPassword() {
  try {
    const email = 'jordanbastin@pm.me'
    const newPassword = 'Test123456' // Nouveau mot de passe simple pour tester

    console.log('🔍 Searching for user:', email)

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('✅ User found:', user.email)
    console.log('🔐 Resetting password...')

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    })

    console.log('✅ Password reset successfully!')
    console.log('   - Email:', email)
    console.log('   - New password:', newPassword)
    console.log('\n⚠️  IMPORTANT: Use these credentials to login:')
    console.log('   Email:', email)
    console.log('   Password:', newPassword)

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

resetPassword()
