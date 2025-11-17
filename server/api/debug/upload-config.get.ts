import { resolve } from 'node:path'
import { access, constants } from 'node:fs/promises'

export default defineEventHandler(async event => {
  const uploadDir = process.env.UPLOAD_DIR ? resolve(process.env.UPLOAD_DIR) : resolve(process.cwd(), 'uploads')

  let canRead = false
  let canWrite = false

  try {
    await access(uploadDir, constants.R_OK)
    canRead = true
  } catch {
    // Cannot read
  }

  try {
    await access(uploadDir, constants.W_OK)
    canWrite = true
  } catch {
    // Cannot write
  }

  return {
    uploadDir,
    env: {
      UPLOAD_DIR: process.env.UPLOAD_DIR || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      cwd: process.cwd(),
    },
    permissions: {
      canRead,
      canWrite,
    },
  }
})
