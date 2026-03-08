import { auth } from "$lib/auth";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ request }: RequestEvent) {
    return auth.handler(request);
}

export async function POST({ request }: RequestEvent) {
    return auth.handler(request);
}