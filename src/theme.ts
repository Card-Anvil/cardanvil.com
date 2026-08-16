import {
	createSystem,
	defaultConfig,
	defineConfig,
	defineGlobalStyles,
	mergeConfigs,
} from "@chakra-ui/react";

const customGlobalCss = defineGlobalStyles({
	"*, *::before, *::after": {
		boxSizing: "border-box",
	},
	body: {
		margin: 0,
	},
	"#root": {
		minH: "100dvh",
		display: "flex",
		flexDirection: "column",
	},
});

export const system = createSystem(
	mergeConfigs(
		defaultConfig,
		defineConfig({
			globalCss: customGlobalCss,
		}),
	),
);
