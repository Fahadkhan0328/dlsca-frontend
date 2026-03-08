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
    
    // ✨ UPDATE: Add the new failing preview link here
    trustedOrigins: [
        "https://dlsca-frontend-3jgl.vercel.app",
        "https://dlsca-frontend-3jgl-6jsavclt7-fahads-projects-4ecec35f.vercel.app"
    ],

    emailAndPassword: {
        enabled: true
    },
    plugins: [
        jwt() 
    ]
});