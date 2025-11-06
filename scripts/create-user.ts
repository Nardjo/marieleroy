#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import { createInterface } from 'readline'
import { promisify } from 'util'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = promisify(rl.question).bind(rl)

async function createUser() {
  console.log("\n🔐 Création d'un utilisateur\n")

  try {
    // Email
    const email = (await question('📧 Email: ')) as string
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide')
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error(`Un utilisateur avec l'email ${email} existe déjà`)
    }

    // Prénom
    const firstName = (await question('👤 Prénom: ')) as string
    if (!firstName) {
      throw new Error('Le prénom est requis')
    }

    // Nom de famille (optionnel)
    const lastName = (await question('👤 Nom de famille (optionnel): ')) as string

    // Mot de passe
    const password = (await question('🔑 Mot de passe: ')) as string
    if (!password || password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères')
    }

    // Créer l'utilisateur
    console.log('\n⏳ Création en cours...')

    const hashedPassword = await bcrypt.hash(password, 10)
    const name = `${firstName} ${lastName || ''}`.trim()

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName: lastName || null,
        name,
        role: 'ADMIN',
      },
    })

    console.log('\n✅ Utilisateur créé avec succès!\n')
    console.log('📋 Détails:')
    console.log(`   Nom: ${user.name}`)
    console.log(`   Prénom: ${user.firstName}`)
    console.log(`   Nom de famille: ${user.lastName || 'Non renseigné'}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Rôle: ${user.role}`)
    console.log(`   ID: ${user.id}`)
    console.log('\n🎉 Vous pouvez maintenant vous connecter avec ces identifiants!')
  }
  catch (error: any) {
    console.error('\n❌ Erreur:', error.message)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
    rl.close()
  }
}

createUser()
