import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";

export const auth = betterAuth({
    database: new Pool({
        // This 'uselibpqcompat' flag fixes the pg warning you received
        connectionString: DATABASE_URL + "&uselibpqcompat=true"
    }),
    secret: BETTER_AUTH_SECRET,
    // This fixes the "Base URL could not be determined" warning
    baseURL: BETTER_AUTH_URL, 
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        jwt() 
    ]
});