import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";

export const auth = betterAuth({
    database: new Pool({
        // The 'uselibpqcompat' flag fixes the pg warning for Neon/Postgres
        connectionString: DATABASE_URL + "&uselibpqcompat=true"
    }),
    secret: BETTER_AUTH_SECRET,
   // ... rest of your config
    baseURL: BETTER_AUTH_URL, 
    
    // ✨ FIX: Use direct strings instead of a Regex pattern
    trustedOrigins: [
        "https://dlsca-frontend-3jgl.vercel.app",
        "https://dlsca-frontend-3jgl-4wzpauagx-fahads-projects-4ecec35f.vercel.app"
    ],

    emailAndPassword: {
    // ...
        enabled: true
    },
    plugins: [
        jwt() 
    ]
});