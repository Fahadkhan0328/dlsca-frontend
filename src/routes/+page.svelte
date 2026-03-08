<script lang="ts">
    import TracePlot from "$lib/components/TracePlot.svelte";
    import { signUp, signIn, signOut, useSession, authClient } from "$lib/auth-client";

    const session = useSession();

    let name = "";
    let email = "";
    let password = "";
    let isLogin = true; 
    let loading = false;
    let errorMessage = "";
    let backendData: any = null;

    async function handleSubmit() {
        loading = true;
        errorMessage = "";
        try {
            if (isLogin) {
                const { error } = await signIn.email({ email, password });
                if (error) errorMessage = "error.message";
            } else {
                const { error } = await signUp.email({ email, password, name });
                if (error) errorMessage = "error.message";
            }
        } catch (e: any) {
            errorMessage = "An unexpected error occurred.";
        } finally {
            loading = false;
        }
    }

    // --- Original GET Fetch ---
    async function fetchFromPython() {
        loading = true;
        errorMessage = "";
        
        const { data: jwtData, error: jwtError } = await authClient.token();
        const token = jwtData?.token;

        if (!token) {
            errorMessage = "Failed to mint JWT. Please log out and back in.";
            loading = false;
            return;
        }

        try {
            const response = await fetch("https://dlsca-backend-production.up.railway.app/api/secure-data", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("FastAPI rejected the token or file not found.");
            backendData = await response.json();
        } catch (e: any) {
            errorMessage = e.message;
        } finally {
            loading = false;
        }
    }

    // ✨ NEW FUNCTION: Handle File Uploads ✨
    async function handleFileUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        loading = true;
        errorMessage = "";

        const { data: jwtData } = await authClient.token();
        const token = jwtData?.token;

        if (!token) {
            errorMessage = "Authentication failed. Please log in again.";
            loading = false;
            return;
        }

        // Package the file securely
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://dlsca-backend-production.up.railway.app/api/upload", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                // Note: The browser automatically sets the correct Content-Type for files!
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Upload failed.");
            }
            
            // Instantly update the chart with the new data!
            backendData = await response.json();
        } catch (e: any) {
            errorMessage = e.message;
        } finally {
            loading = false;
            target.value = ''; // Reset the file input
        }
    }
</script>

<main class="app-container">
    {#if $session?.isPending}
        <div class="card"><p>Loading session...</p></div>
    {:else if $session?.data?.user}
        <div class="card dashboard">
            <div class="avatar-circle">{$session.data.user.name.charAt(0).toUpperCase()}</div>
            <h2>Welcome, {$session.data.user.name}!</h2>
            <p class="text-muted">{$session.data.user.email}</p>
            
            <div class="info-box">
                <div class="button-group">
                    <button class="btn-primary" on:click={fetchFromPython} disabled={loading}>
                        {loading ? 'Processing...' : '🔌 Load Default Trace'}
                    </button>
                    
                    <label class="btn-secondary" class:disabled={loading}>
                        {loading ? 'Uploading...' : '📁 Upload .npy Trace'}
                        <input type="file" accept=".npy" on:change={handleFileUpload} disabled={loading} hidden />
                    </label>
                </div>
                
                {#if backendData}
                    <div class="success-box">
                        <small>Currently Viewing: <strong>{backendData.data.filename}</strong></small>
                        <TracePlot dataPoints={backendData.data.results} />
                    </div>
                {/if}
            </div>

            {#if errorMessage}<p class="error">{errorMessage}</p>{/if}

            <button class="btn-link logout-btn" on:click={() => signOut()}>Sign Out</button>
        </div>
    {:else}
        <div class="card auth-form">
            <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p class="subtitle">{isLogin ? 'Enter your credentials' : 'Register a new user'}</p>
            {#if errorMessage}<p class="error">{errorMessage}</p>{/if}
            <form on:submit|preventDefault={handleSubmit}>
                {#if !isLogin}<input bind:value={name} placeholder="Full Name" required />{/if}
                <input type="email" bind:value={email} placeholder="Email Address" required />
                <input type="password" bind:value={password} placeholder="Password" required />
                <button type="submit" class="btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
            </form>
            <button class="btn-link" on:click={() => { isLogin = !isLogin; errorMessage = ""; }}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
        </div>
    {/if}
</main>

<style>
    /* ... Keep all your existing styles exactly as they are ... */
    :global(body) { margin: 0; font-family: -apple-system, sans-serif; background: #f4f7f6; color: #333; }
    .app-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .card { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 480px; text-align: center; border: 1px solid #eee; }
    h2 { margin: 0 0 0.5rem; font-size: 1.5rem; }
    .subtitle { font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; }
    input { width: 100%; padding: 0.85rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box; font-size: 1rem; }
    input:focus { outline: 2px solid #000; border-color: transparent; }
    
    .btn-primary { width: 100%; padding: 0.9rem; background: #000; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 1rem; }
    .btn-primary:disabled { background: #666; cursor: not-allowed; }
    
    /* ✨ New styles for the upload button */
    .button-group { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .btn-secondary { width: 100%; padding: 0.9rem; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s;}
    .btn-secondary:hover { background: #e2e8f0; }
    .btn-secondary.disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-link { background: none; border: none; color: #000; margin-top: 1.25rem; cursor: pointer; font-size: 0.9rem; font-weight: 500; }
    .btn-link:hover { text-decoration: underline; }
    .avatar-circle { width: 64px; height: 64px; background: #eff6ff; color: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.5rem; font-weight: bold; border: 2px solid #dbeafe; }
    .success-box { margin-top: 1.5rem; text-align: left; }
    .success-box small { font-weight: bold; color: #64748b; display: block; margin-bottom: 0.5rem; }
    .error { color: #dc2626; font-size: 0.85rem; margin: 1rem 0; background: #fef2f2; padding: 0.5rem; border-radius: 6px; border: 1px solid #fee2e2; }
    .text-muted { color: #64748b; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .logout-btn { color: #ef4444; margin-top: 2rem; border: 1px solid #fee2e2; padding: 0.5rem 1rem; border-radius: 8px; background: white; cursor: pointer; font-weight: bold;}
    .logout-btn:hover { background: #fef2f2; }
</style>