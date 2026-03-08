import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";

export const auth = betterAuth({
    // ... rest of your config
    baseURL: BETTER_AUTH_URL, 
    
    // ✨ FIX: Add the specific failing URL to the list
    trustedOrigins: [
        "https://dlsca-frontend-3jgl.vercel.app",
        "https://dlsca-frontend-3jgl-kdcmm08q1-fahads-projects-4ecec35f.vercel.app"
    ],

    emailAndPassword: {
        enabled: true
    },
    plugins: [
        jwt() 
    ]
});