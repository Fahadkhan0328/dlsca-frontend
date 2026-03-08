import { createAuthClient } from "better-auth/svelte";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:5173",
    plugins: [
        jwtClient() 
    ]
});

export const { signIn, signUp, signOut, useSession } = authClient;