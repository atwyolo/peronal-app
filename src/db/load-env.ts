import { loadEnvConfig } from "@next/env";

// Scripts run outside Next (tsx), so load .env.local exactly the way Next does.
loadEnvConfig(process.cwd());
