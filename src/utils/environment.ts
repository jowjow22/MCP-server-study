import { z } from "zod"

const envSchema = z.object({
    SENTRY_USER_API_KEY: z.string().min(1),
    MONDAY_API_KEY: z.string().min(1),
})

export const env = envSchema.safeParse(process.env)

if (!env.success) {
    console.error(env.error.format())
    process.exit(1)
}

export default env.data