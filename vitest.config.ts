import baseConfig from "./vite.config";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(async (configEnv) => {
	const base =
		typeof baseConfig === "function"
			? await baseConfig(configEnv)
			: baseConfig;
	return mergeConfig(base, {
		test: {
			passWithNoTests: true,
		},
	});
});
