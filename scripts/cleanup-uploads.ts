import { cleanupExpiredUploads } from "../lib/uploads";

async function main() {
  const count = await cleanupExpiredUploads();
  console.log(`Removed ${count} expired files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
