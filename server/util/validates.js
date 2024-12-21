import { z } from 'zod'

// Esquema de validación para un usuario
const userSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'El nombre de usuario no puede tener más de 20 caracteres')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'El nombre de usuario solo puede contener letras, números y guiones bajos',
    ),

  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder los 100 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe tener al menos un número')
    .regex(/[\W_]/, 'La contraseña debe tener al menos un carácter especial'),
})

export const validateCredentials = (obj) => {
  const res = userSchema.safeParse(obj)
  if (!res.success) {
    return { error: res.error.errors.map((e) => e.message) }
  }
  return { success: true }
}
