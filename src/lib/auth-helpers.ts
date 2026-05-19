import { auth } from "@/auth";

/**
 * Helper: ambil session server-side dan periksa role.
 * Gunakan di API routes / Server Components.
 *
 * @param requiredRole - 'superuser' | 'user' | undefined (any authenticated)
 * @returns session user object atau throw Response 401/403
 */
export async function requireAuth(requiredRole?: "superuser" | "user") {
  const session = await auth();

  if (!session?.user) {
    throw Response.json(
      { success: false, message: "Tidak terautentikasi" },
      { status: 401 }
    );
  }

  const role = (session.user as { role?: string }).role;

  if (requiredRole && role !== requiredRole) {
    throw Response.json(
      { success: false, message: "Akses ditolak: insufficient role" },
      { status: 403 }
    );
  }

  return { ...session.user, role };
}

/**
 * Helper: periksa apakah user punya akses write (superuser only)
 */
export async function requireWriteAccess() {
  return requireAuth("superuser");
}

/**
 * Helper: periksa apakah user terautentikasi (superuser atau user)
 */
export async function requireAnyAuth() {
  const session = await auth();
  if (!session?.user) {
    throw Response.json(
      { success: false, message: "Tidak terautentikasi" },
      { status: 401 }
    );
  }
  const role = (session.user as { role?: string }).role;
  return { ...session.user, role };
}
