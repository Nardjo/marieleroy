import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCtaSetting() {
  try {
    console.log('\n🔗 Adding CTA Link Setting\n')

    // Check if cta_link already exists
    const existingSetting = await prisma.siteSetting.findUnique({
      where: { key: 'cta_link' },
    })

    if (existingSetting) {
      console.log('✅ CTA Link setting already exists:', existingSetting.value || '(empty)')
      return
    }

    // Create the CTA Link setting
    const setting = await prisma.siteSetting.create({
      data: {
        key: 'cta_link',
        value: '',
        type: 'string',
      },
    })

    console.log('✅ CTA Link setting created successfully!')
    console.log('   - Key:', setting.key)
    console.log('   - Value:', setting.value || '(empty)')
    console.log('   - Type:', setting.type)
    console.log('')
  } catch (error) {
    console.error('\n❌ Error adding CTA Link setting:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addCtaSetting()
