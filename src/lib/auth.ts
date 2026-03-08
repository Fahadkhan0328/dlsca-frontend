import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";

export const auth = betterAuth({
    database: new Pool({
        connectionString: DATABASE_URL + "&uselibpqcompat=true"
    }),
    secret: BETTER_AUTH_SECRET,
    baseURL: BETTER_AUTH_URL, 
    
    // ✨ THE FIX: Trust the production domain AND all Vercel subdomains
    trustedOrigins: [
        "https://dlsca-frontend-3jgl.vercel.app",
        "https://dlsca-frontend-3jgl-owiipwert-fahads-projects-4ecec35f.vercel.app"
    ],
    
    // NOTE: If your TypeScript version gives an error with Regex, 
    // keep manually adding the specific link as shown above.

    emailAndPassword: {
        enabled: true
    },
    plugins: [
        jwt() 
    ]
});