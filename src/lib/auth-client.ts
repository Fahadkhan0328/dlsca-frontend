import { createAuthClient } from "better-auth/svelte";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    // ✨ FIX: Use the current browser URL instead of a hardcoded one
    // This ensures the client always talks to the same domain it is hosted on
    baseURL: typeof window !== 'undefined' ? window.location.origin : "https://dlsca-frontend-3jgl.vercel.app",
    plugins: [
        jwtClient() 
    ]
});

export const { signIn, signUp, signOut, useSession } = authClient;