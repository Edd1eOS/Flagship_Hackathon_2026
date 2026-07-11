// The controlled demo storefront and the Lemonade Lane app it hands off to.
// Keep this exact and narrow - no wildcard domains - since it is also the
// extension's content-script activation scope and web-accessible-resource
// scope, not just a display list.
export const ALLOWED_MATCHES = [
  "http://localhost/*",
  "http://127.0.0.1/*",
  "https://web-seven-pied-41.vercel.app/*",
];
