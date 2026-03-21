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
	html: {
		minH: "100%",
	},
	body: {
		margin: 0,
		minH: "100%",
	},
	"#root": {
		minH: "100%",
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
