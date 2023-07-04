import { ComponentStyleConfig } from "@chakra-ui/theme";
import {
  extendTheme,
} from "@chakra-ui/vue-next";
import {
  feChevronDown,
  feMail,
  feEdit,
  feEye,
  feExternalLink,
  feFileText,
  feShare_2,
  feArchive,
  feSearch,
  feDownload,
  feChevronUp,
  feMessageSquare,
  feX,
  feCopy,
  feDatabase,
  feCheckSquare,
  fePlus,
  feList,
} from "feather-icons-paths";
import {
  FaDiscord,
  BiListCheck,
  FaMapMarkerAlt,
  HiArrowNarrowRight,
  IoMenu,
  OiTable,
  RiArrowDownSFill,
  HiDocumentSearch,
  BiTools,
  MdSettingsOutlined,
  LaMoneyBillSolid,
  IoCheckmarkCircle,
  BiPeopleFill,
  FaDonate,
  MdMarkemailunreadOutlined,
  RiMailSendLine,
  MdCloseOutlined,
  BiMagic,
  BiClock,
  BiClockFill,
  BiCaretLeftFill,
  BiCaretRightFill,
  IoCall,
  FcGoogle,
  ViFileTypeOutlook,
} from "oh-vue-icons/icons";
import { IconType } from "oh-vue-icons/types/icons";

// todo move to /apps/chakra

export const chakraConfig = {
  extendTheme: extendTheme({
    breakpoints: {
      sm: "30em", // 480px
      md: "48em",
      tablet: "48em", // 768px
      lg: "62em", // 992px
      xl: "80em",
      laptop: "80em", // 1280px
      "2xl": "96em", // 1536px
      "3xl": "1680px",
      fullhd: "120em",
    },
    boxShadow: {
      // tailwind shadows
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
    components: {
      Heading: {
        variants: {
          "page-header": {
            fontWeight: "normal",
            fontSize: "3xl",
            mb: "px",
          },
        },
      },
      Button: {
        defaultProps: {
          colorScheme: "blue",
        },
        baseStyle: {
          fontWeight: "normal",
        },
        variants: {
          outline: {
            borderColor: "gray.300",
            color: "gray.600",
            _hover: {
              bg: "gray.75",
              borderColor: "gray.700",
            }
          }
        }
      } as ComponentStyleConfig,
      Link: {
        colorScheme: "blue",
        variants: {
          "side-menu": {
            py: "10px",
            px: 4,
            display: "flex",
            alignItems: "center",
            gap: 3,
            borderRadius: "lg",
            _hover: {
              color: "white",
              textDecoration: "none",
            },
          },
          none: {
            _hover: {
              textDecoration: "none",
            },
          },
        },
      },
      FormLabel: {
        baseStyle: {
          color: "gray.500",
          fontSize: "sm",
        },
      },
    },
    colors: {
      gray: {
        75: "#f4f8fb",
      },
    },
  }),
  icons: {
    library: {
      feX,
      feEdit,
      feChevronDown,
      feChevronUp,
      feMail,
      feExternalLink,
      feMessageSquare,
      feDownload,
      feSearch,
      feEye,
      feFileText,
      feArchive,
      feCopy,
      feCheckSquare,
      feShare_2,
      feDatabase,
      fePlus,
      feList,
    },
    extend: {
      ...getOhVueIconProps(BiListCheck),
      ...getOhVueIconProps(FaDiscord),
      ...getOhVueIconProps(LaMoneyBillSolid),
      ...getOhVueIconProps(IoMenu),
      ...getOhVueIconProps(RiArrowDownSFill),
      ...getOhVueIconProps(HiArrowNarrowRight),
      ...getOhVueIconProps(FaMapMarkerAlt),
      ...getOhVueIconProps(OiTable),
      ...getOhVueIconProps(HiDocumentSearch),
      ...getOhVueIconProps(BiTools),
      ...getOhVueIconProps(MdSettingsOutlined),
      ...getOhVueIconProps(IoCheckmarkCircle),
      ...getOhVueIconProps(BiPeopleFill),
      ...getOhVueIconProps(FaDonate),
      ...getOhVueIconProps(MdMarkemailunreadOutlined),
      ...getOhVueIconProps(RiMailSendLine),
      ...getOhVueIconProps(MdCloseOutlined),
      ...getOhVueIconProps(BiClockFill),
      ...getOhVueIconProps(BiMagic),
      ...getOhVueIconProps(BiClock),
      ...getOhVueIconProps(BiCaretLeftFill),
      ...getOhVueIconProps(BiCaretRightFill),
      ...getOhVueIconProps(IoCall),
      ...getOhVueIconProps(FcGoogle),
      ...getOhVueIconProps(ViFileTypeOutlook),
      people: {
        path: `
          <path d="M3.17647 4.11111C3.17647 3.44807 3.42747 2.81219 3.87425 2.34334C4.32102 1.8745 4.92698 1.61111 5.55882 1.61111C6.19066 1.61111 6.79662 1.8745 7.2434 2.34334C7.69018 2.81219 7.94118 3.44807 7.94118 4.11111C7.94118 4.77415 7.69018 5.41004 7.2434 5.87888C6.79662 6.34772 6.19066 6.61111 5.55882 6.61111C4.92698 6.61111 4.32102 6.34772 3.87425 5.87888C3.42747 5.41004 3.17647 4.77415 3.17647 4.11111ZM5.55882 0.5C4.64617 0.5 3.77089 0.880455 3.12554 1.55767C2.4802 2.23488 2.11765 3.15338 2.11765 4.11111C2.11765 5.06884 2.4802 5.98734 3.12554 6.66455C3.77089 7.34177 4.64617 7.72222 5.55882 7.72222C6.47148 7.72222 7.34676 7.34177 7.9921 6.66455C8.63745 5.98734 9 5.06884 9 4.11111C9 3.15338 8.63745 2.23488 7.9921 1.55767C7.34676 0.880455 6.47148 0.5 5.55882 0.5ZM11.5804 13.4389C12.15 13.6833 12.8668 13.8333 13.7647 13.8333C15.7564 13.8333 16.8575 13.0911 17.4378 12.24C17.7405 11.7934 17.9303 11.2734 17.9894 10.7289C17.9947 10.6783 17.9982 10.6275 18 10.5767V10.5C18 10.2811 17.9589 10.0644 17.8791 9.8622C17.7993 9.65999 17.6823 9.47625 17.5348 9.32149C17.3873 9.16672 17.2122 9.04396 17.0196 8.9602C16.8269 8.87644 16.6203 8.83333 16.4118 8.83333H11.5094C11.7635 9.15556 11.9541 9.53222 12.0653 9.94444H16.4118C16.5522 9.94444 16.6868 10.003 16.7861 10.1072C16.8854 10.2113 16.9412 10.3527 16.9412 10.5V10.56L16.9359 10.6156C16.8953 10.9679 16.7716 11.3039 16.5759 11.5933C16.2296 12.1033 15.4779 12.7222 13.7647 12.7222C12.9896 12.7222 12.4115 12.5956 11.9785 12.41C11.8916 12.7211 11.7656 13.0722 11.5804 13.4389ZM0 11.0556C0 10.4662 0.223109 9.90096 0.620244 9.48421C1.01738 9.06746 1.55601 8.83333 2.11765 8.83333H9C9.56164 8.83333 10.1003 9.06746 10.4974 9.48421C10.8945 9.90096 11.1176 10.4662 11.1176 11.0556V11.1489C11.1176 11.16 11.1176 11.1744 11.1155 11.1933C11.1026 11.4133 11.0725 11.6318 11.0255 11.8467C10.9355 12.2556 10.7566 12.8022 10.3955 13.3511C9.65329 14.4778 8.21965 15.5 5.55882 15.5C2.898 15.5 1.46435 14.4778 0.722118 13.3511C0.331226 12.7536 0.0874935 12.0638 0.0127058 11.3433C0.00637881 11.2787 0.00214112 11.2138 0 11.1489V11.0556ZM1.05882 11.1222V11.1422L1.06624 11.2344C1.12361 11.7671 1.30467 12.2768 1.59353 12.7189C2.10918 13.5011 3.19024 14.3889 5.55882 14.3889C7.92741 14.3889 9.00847 13.5011 9.52412 12.7189C9.81306 12.2768 9.99413 11.7671 10.0514 11.2344C10.0549 11.2038 10.057 11.173 10.0578 11.1422L10.0588 11.1233V11.0556C10.0588 10.7609 9.94727 10.4783 9.7487 10.2699C9.55013 10.0615 9.28082 9.94444 9 9.94444H2.11765C1.83683 9.94444 1.56751 10.0615 1.36895 10.2699C1.17038 10.4783 1.05882 10.7609 1.05882 11.0556V11.1222ZM12.1765 4.94444C12.1765 4.50242 12.3438 4.07849 12.6417 3.76593C12.9395 3.45337 13.3435 3.27778 13.7647 3.27778C14.1859 3.27778 14.5899 3.45337 14.8878 3.76593C15.1856 4.07849 15.3529 4.50242 15.3529 4.94444C15.3529 5.38647 15.1856 5.8104 14.8878 6.12296C14.5899 6.43552 14.1859 6.61111 13.7647 6.61111C13.3435 6.61111 12.9395 6.43552 12.6417 6.12296C12.3438 5.8104 12.1765 5.38647 12.1765 4.94444ZM13.7647 2.16667C13.0627 2.16667 12.3894 2.45932 11.893 2.98026C11.3965 3.50119 11.1176 4.20773 11.1176 4.94444C11.1176 5.68116 11.3965 6.3877 11.893 6.90863C12.3894 7.42956 13.0627 7.72222 13.7647 7.72222C14.4668 7.72222 15.14 7.42956 15.6365 6.90863C16.1329 6.3877 16.4118 5.68116 16.4118 4.94444C16.4118 4.20773 16.1329 3.50119 15.6365 2.98026C15.14 2.45932 14.4668 2.16667 13.7647 2.16667Z" fill="currentcolor"/>
        `,
        viewBox: "0 0 18 16",
      },
      letter: {
        path: `
          <g>
            <path d="M468.693,85.388H42.027C18.987,85.174,0.213,103.628,0,126.561c0,0.32,0,0.64,0,0.96v255.147
            c0,23.467,20.48,43.947,43.84,43.947h422.933c24.107,0,45.227-20.587,45.227-43.947V127.521
            C512,104.268,492.587,85.388,468.693,85.388z M490.667,382.774c0,11.413-11.84,22.613-23.893,22.613H43.84
            c-11.84,0-22.507-10.773-22.507-22.613V127.521c0-11.84,8.853-20.8,20.693-20.8h426.667c12.16,0,21.973,9.387,21.973,20.8
            V382.774z"/>
            <path d="M437.333,160.054H352c-5.867,0-10.667,4.8-10.667,10.667v85.333c0,5.867,4.8,10.667,10.667,10.667h85.333
            c5.867,0,10.667-4.8,10.667-10.667v-85.333C448,164.854,443.2,160.054,437.333,160.054z M426.667,245.388h-64v-64h64V245.388z"/>
            <path d="M96,192.054h106.667c5.867,0,10.667-4.8,10.667-10.667c0-5.867-4.8-10.667-10.667-10.667H96
            c-5.867,0-10.667,4.8-10.667,10.667C85.333,187.254,90.133,192.054,96,192.054z"/>
            <path d="M96,277.388h64c5.867,0,10.667-4.8,10.667-10.667c0-5.867-4.8-10.667-10.667-10.667H96
            c-5.867,0-10.667,4.8-10.667,10.667C85.333,272.588,90.133,277.388,96,277.388z"/>
            <path d="M437.333,320.054H96c-5.867,0-10.667,4.8-10.667,10.667c0,5.867,4.8,10.667,10.667,10.667h341.333
            c5.867,0,10.667-4.8,10.667-10.667C448,324.854,443.2,320.054,437.333,320.054z"/>
          </g>
        `,
        viewBox: "0 0 512 512",
      },
      "io-checkmark-circle-outline": {
        path: `
          <path fill="none" stroke="currentcolor" stroke-miterlimit="10" stroke-width="32" d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path>
          <path fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352 176L217.6 336 160 272"></path>
        `,
        viewBox: "0 0 512 512",
      },
      task: {
        path: `
          <path d="M6.57143 12.6056L4.00714 10.1939L3 11.1411L6.57143 14.5L13 8.45393L11.9929 7.5L6.57143 12.6056Z" fill="currentcolor"/>
          <path d="M13.6364 2.53571H11.5909V1.85714C11.5909 1.49721 11.4472 1.15201 11.1915 0.897498C10.9358 0.642984 10.5889 0.5 10.2273 0.5H4.77273C4.41107 0.5 4.06422 0.642984 3.80849 0.897498C3.55276 1.15201 3.40909 1.49721 3.40909 1.85714V2.53571H1.36364C1.00198 2.53571 0.655131 2.6787 0.3994 2.93321C0.143668 3.18773 0 3.53292 0 3.89286V18.1429C0 18.5028 0.143668 18.848 0.3994 19.1025C0.655131 19.357 1.00198 19.5 1.36364 19.5H13.6364C13.998 19.5 14.3449 19.357 14.6006 19.1025C14.8563 18.848 15 18.5028 15 18.1429V3.89286C15 3.53292 14.8563 3.18773 14.6006 2.93321C14.3449 2.6787 13.998 2.53571 13.6364 2.53571ZM4.77273 1.85714H10.2273V4.57143H4.77273V1.85714ZM13.6364 18.1429H1.36364V3.89286H3.40909V5.92857H11.5909V3.89286H13.6364V18.1429Z" fill="currentcolor"/>
        `,
        viewBox: "0 0 16 20",
      },
      user: {
        path: `
          <path d="M18 8.991C18 4.0275 13.968 0 9 0C4.032 0 0 4.0275 0 8.991C0 11.7248 1.242 14.1885 3.186 15.8422C3.204 15.8602 3.222 15.8603 3.222 15.8783C3.384 16.0042 3.546 16.1302 3.726 16.2563C3.816 16.3102 3.888 16.3811 3.978 16.4531C5.46533 17.4615 7.22105 18.0004 9.018 18C10.815 18.0004 12.5707 17.4615 14.058 16.4531C14.148 16.3991 14.22 16.3283 14.31 16.2731C14.472 16.1483 14.652 16.0222 14.814 15.8962C14.832 15.8783 14.85 15.8782 14.85 15.8602C16.758 14.1874 18 11.7248 18 8.991ZM9 16.8671C7.308 16.8671 5.76 16.3271 4.482 15.4282C4.5 15.2842 4.536 15.1414 4.572 14.9974C4.67926 14.6071 4.83656 14.2324 5.04 13.8825C5.238 13.5405 5.472 13.2345 5.76 12.9645C6.03 12.6945 6.354 12.4436 6.678 12.2456C7.02 12.0476 7.38 11.9036 7.776 11.7956C8.17508 11.6881 8.58668 11.634 9 11.6348C10.227 11.6261 11.4089 12.0967 12.294 12.9465C12.708 13.3605 13.032 13.8465 13.266 14.4034C13.392 14.7274 13.482 15.0694 13.536 15.4282C12.2076 16.3622 10.6239 16.8646 9 16.8671ZM6.246 8.54212C6.0874 8.179 6.00764 7.78635 6.012 7.39012C6.012 6.99525 6.084 6.59925 6.246 6.23925C6.408 5.87925 6.624 5.55638 6.894 5.28638C7.164 5.01638 7.488 4.8015 7.848 4.6395C8.208 4.4775 8.604 4.4055 9 4.4055C9.414 4.4055 9.792 4.4775 10.152 4.6395C10.512 4.8015 10.836 5.0175 11.106 5.28638C11.376 5.55638 11.592 5.88037 11.754 6.23925C11.916 6.59925 11.988 6.99525 11.988 7.39012C11.988 7.80412 11.916 8.18213 11.754 8.541C11.5977 8.89567 11.3781 9.21894 11.106 9.495C10.8298 9.76668 10.5066 9.98587 10.152 10.1419C9.40818 10.4476 8.57382 10.4476 7.83 10.1419C7.47541 9.98587 7.15215 9.76668 6.876 9.495C6.60354 9.22296 6.3892 8.89839 6.246 8.541V8.54212ZM14.598 14.5114C14.598 14.4754 14.58 14.4574 14.58 14.4214C14.403 13.8582 14.142 13.325 13.806 12.8396C13.4697 12.3507 13.0563 11.9195 12.582 11.5627C12.2198 11.2903 11.8272 11.0607 11.412 10.8787C11.6009 10.7542 11.7759 10.6097 11.934 10.4479C12.2024 10.1829 12.438 9.88684 12.636 9.56588C13.0347 8.91091 13.2405 8.1568 13.23 7.39012C13.2356 6.82258 13.1253 6.25986 12.906 5.73637C12.6895 5.23197 12.3778 4.774 11.988 4.3875C11.5988 4.00503 11.1407 3.69966 10.638 3.4875C10.1136 3.26857 9.5502 3.15871 8.982 3.16462C8.41373 3.15907 7.85028 3.26931 7.326 3.48863C6.81891 3.70034 6.35975 4.01218 5.976 4.4055C5.59355 4.79429 5.28817 5.25197 5.076 5.75437C4.85668 6.27786 4.74643 6.84058 4.752 7.40812C4.752 7.80412 4.806 8.18213 4.914 8.541C5.022 8.919 5.166 9.261 5.364 9.58387C5.544 9.90788 5.796 10.1959 6.066 10.4659C6.228 10.6279 6.408 10.7708 6.606 10.8967C6.18956 11.0836 5.79681 11.3192 5.436 11.5988C4.968 11.9588 4.554 12.3896 4.212 12.8576C3.87254 13.341 3.61134 13.8748 3.438 14.4394C3.42 14.4754 3.42 14.5114 3.42 14.5294C1.998 13.0905 1.116 11.1488 1.116 8.991C1.116 4.6575 4.662 1.11487 9 1.11487C13.338 1.11487 16.884 4.6575 16.884 8.991C16.8816 11.061 16.0597 13.0458 14.598 14.5114Z" fill="currentcolor"/>
        `,
        viewBox: "0 0 18 18",
      },
      dollar: {
        path: `
          <path d="M9.1375 7.9375C8.7125 7.83125 8.2875 7.61875 7.96875 7.3C7.65 7.19375 7.54375 6.875 7.54375 6.6625C7.54375 6.45 7.65 6.13125 7.8625 6.025C8.18125 5.8125 8.5 5.6 8.81875 5.70625C9.45625 5.70625 9.9875 6.025 10.3062 6.45L11.2625 5.175C10.9438 4.85625 10.625 4.64375 10.3062 4.43125C9.9875 4.21875 9.5625 4.1125 9.1375 4.1125V2.625H7.8625V4.1125C7.33125 4.21875 6.8 4.5375 6.375 4.9625C5.95 5.49375 5.63125 6.13125 5.7375 6.76875C5.7375 7.40625 5.95 8.04375 6.375 8.46875C6.90625 9 7.65 9.31875 8.2875 9.6375C8.60625 9.74375 9.03125 9.95625 9.35 10.1688C9.5625 10.3813 9.66875 10.7 9.66875 11.0187C9.66875 11.3375 9.5625 11.6562 9.35 11.975C9.03125 12.2937 8.60625 12.4 8.2875 12.4C7.8625 12.4 7.33125 12.2937 7.0125 11.975C6.69375 11.7625 6.375 11.4438 6.1625 11.125L5.1 12.2938C5.41875 12.7188 5.7375 13.0375 6.1625 13.3563C6.69375 13.675 7.33125 13.9937 7.96875 13.9937V15.375H9.1375V13.7812C9.775 13.675 10.3063 13.3562 10.7313 12.9312C11.2625 12.4 11.5812 11.55 11.5812 10.8062C11.5812 10.1687 11.3687 9.425 10.8375 9C10.3062 8.46875 9.775 8.15 9.1375 7.9375ZM8.5 0.5C3.825 0.5 0 4.325 0 9C0 13.675 3.825 17.5 8.5 17.5C13.175 17.5 17 13.675 17 9C17 4.325 13.175 0.5 8.5 0.5ZM8.5 16.3312C4.4625 16.3312 1.16875 13.0375 1.16875 9C1.16875 4.9625 4.4625 1.66875 8.5 1.66875C12.5375 1.66875 15.8312 4.9625 15.8312 9C15.8312 13.0375 12.5375 16.3312 8.5 16.3312Z" fill="currentcolor"/>
        `,
        viewBox: "0 0 17 18",
      },
    },
  },
}

function getOhVueIconProps(icon: IconType) {
  return {
    [icon.name]: {
      path: icon.raw,
      viewBox: `${icon.minX} ${icon.minY} ${icon.width} ${icon.height}`,
    },
  };
}
