import ChakraUIVuePlugin, { chakra, extendTheme } from "@chakra-ui/vue-next";
import { domElements } from "@chakra-ui/vue-system";
import { defineNuxtPlugin } from "#app";
import { feChevronDown, feExternalLink, feMessageSquare, feX } from "feather-icons-paths";
import {
  FaDiscord,
  FaMapMarkerAlt,
  HiArrowNarrowRight,
  IoMenu,
  RiArrowDownSFill,
} from "oh-vue-icons/icons";
import { IconType } from "oh-vue-icons/types/icons";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ChakraUIVuePlugin, {
    extendTheme: extendTheme({
      components: {
        Button: {
          defaultProps: {
            colorScheme: "blue",
          },
          variants: {
            solid: {
              fontWeight: "normal",
            },
            outline: {
              borderColor: "blue.500",
              fontWeight: "normal",
            },
            link: {
              fontWeight: "normal",
            },
          },
        },
        Link: {
          colorScheme: "blue",
        },
        FormLabel: {
          baseStyle: {
            fontWeight: "normal",
          },
        },
      },
      colors: {
        gray: {
          75: "#f4f8fb",
        }
      },
    }),
    icons: {
      library: {
        feX,
        feChevronDown,
        feExternalLink,
        feMessageSquare,
      },
      extend: {
        ...getOhVueIconProps(FaDiscord),
        ...getOhVueIconProps(IoMenu),
        ...getOhVueIconProps(RiArrowDownSFill),
        ...getOhVueIconProps(HiArrowNarrowRight),
        ...getOhVueIconProps(FaMapMarkerAlt),
      },
    },
  });

  domElements.forEach((tag) => {
    nuxtApp.vueApp.component(`chakra.${tag}`, chakra(tag));
  });
});

function getOhVueIconProps(icon: IconType) {
  return {
    [icon.name]: {
      path: icon.raw,
      viewBox: `${icon.minX} ${icon.minY} ${icon.width} ${icon.height}`,
    },
  };
}
