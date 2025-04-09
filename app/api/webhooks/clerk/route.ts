import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // Get the SIGNING_SECRET from environment variables
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  // Return early if SIGNING_SECRET is not set (development/build time)
  if (!SIGNING_SECRET) {
    console.warn("Warning: SIGNING_SECRET is not set");
    return new Response("Webhook signing secret not configured", {
      status: 400,
    });
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Handle different webhook events
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created": {
        const {
          id,
          email_addresses,
          username,
          first_name,
          last_name,
          image_url,
        } = evt.data;
        const primaryEmail = email_addresses[0]?.email_address;
        const fullName = [first_name, last_name].filter(Boolean).join(" ");

        const user = await prisma.user.create({
          data: {
            clerkId: id,
            email: primaryEmail || `${id}@example.com`, // フォールバックメール
            username: username || id,
            name: fullName || "Anonymous",
            image: image_url,
          },
        });

        return new Response(JSON.stringify(user), { status: 201 });
      }

      case "user.updated": {
        const {
          id,
          email_addresses,
          username,
          first_name,
          last_name,
          image_url,
        } = evt.data;
        const primaryEmail = email_addresses[0]?.email_address;
        const fullName = [first_name, last_name].filter(Boolean).join(" ");

        const user = await prisma.user.update({
          where: { clerkId: id },
          data: {
            email: primaryEmail,
            username: username || id,
            name: fullName || "Anonymous",
            image: image_url,
          },
        });

        return new Response(JSON.stringify(user), { status: 200 });
      }

      case "user.deleted": {
        const { id } = evt.data;
        await prisma.user.delete({
          where: { clerkId: id },
        });

        return new Response(null, { status: 204 });
      }

      default:
        console.log(`Received webhook type: ${eventType}`);
        return new Response("Webhook received", { status: 200 });
    }
  } catch (error) {
    console.error(`Error processing ${eventType}:`, error);
    return new Response(`Error processing ${eventType}`, { status: 500 });
  }
}
