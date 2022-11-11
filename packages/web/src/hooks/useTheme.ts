import { darkTheme, lightTheme } from "naive-ui";
import { Ref } from "vue";
const naiveUiTheme = {
  darkTheme,
  lightTheme,
};
interface IThemeItem {
  [key: string]: string;
}

interface IThemeConfig {
  lightTheme: IThemeItem;
  darkTheme: IThemeItem;
}

const baseThemeConfig: IThemeItem = {
  "--border-radius": "8px",
  "--border-radius-small": "4px",
};
const themeConfig: IThemeConfig = {
  lightTheme: {
    "--primary-bgc": "#fff",
    "--secondary-bgc": "#f4f4f4",
    "--border-color": "#f8f8f8",
    "--box-shadow-color": "rgba(0,0,0, .08)",

    "--text-color-base": "#000",
    "--text-color1": "rgb(31, 34, 37)",
    "--text-color2": "rgb(51, 54, 57)",
    "--text-color3": "rgb(118, 124, 130)",
    "--text-color-disabled": "rgba(194, 194, 194, 1)",
    "--placeholder-color": "rgba(194, 194, 194, 1)",

    "--primary-color": "#18a058",
    "--primary-color-desalt": "rgba(22,160,88, .5)",
    "--primary-color-hover": "#36ad6a",
    "--primary-color-pressed": "#0c7a43",
    "--primary-color-suppl": "#36ad6a",

    "--info-color": "#2080f0",
    "--info-color-hover": "#4098fc",
    "--info-color-pressed": "#1060c9",
    "--info-color-suppl": "#4098fc",

    "--success-color": "#18a058",
    "--success-color-hover": "#36ad6a",
    "--success-color-pressed": "#0c7a43",
    "--success-color-suppl": "#36ad6a",

    "--warning-color": "#f0a020",
    "--warning-color-hover": "#fcb040",
    "--warning-color-pressed": "#c97c10",
    "--warning-color-suppl": "#fcb040",

    "--error-color": "#d03050",
    "--error-color-hover": "#de576d",
    "--error-color-pressed": "#ab1f3f",
    "--error-color-suppl": "#de576d",
  },
  darkTheme: {
    "--primary-bgc": "#18181c",
    "--secondary-bgc": "#101014",
    "--border-color": "#2d2d30",
    "--box-shadow-color": "rgba(255,255,255, .08)",

    "--text-color-base": "#fff",
    "--text-color1": "rgba(255, 255, 255, 0.9)",
    "--text-color2": "rgba(255, 255, 255, 0.82)",
    "--text-color3": "rgba(255, 255, 255, 0.52)",
    "--text-color-disabled": "rgba(255, 255, 255, 0.38)",
    "--placeholder-color": "rgba(255, 255, 255, 0.38)",

    "--primary-color": "#63e2b7",
    "--primary-color-desalt": "rgba(99,226,183, .5)",
    "--primary-color-hover": "#7fe7c4",
    "--primary-color-pressed": "#5acea7",
    "--primary-color-suppl": "rgb(42, 148, 125)",

    "--info-color": "#70c0e8",
    "--info-color-hover": "#8acbec",
    "--info-color-pressed": "#66afd3",
    "--info-color-suppl": "rgb(56, 137, 197)",

    "--success-color": "#63e2b7",
    "--success-color-hover": "#7fe7c4",
    "--success-color-pressed": "#5acea7",
    "--success-color-suppl": "rgb(42, 148, 125)",

    "--warning-color": "#f2c97d",
    "--warning-color-hover": "#f5d599",
    "--warning-color-pressed": "#e6c260",
    "--warning-color-suppl": "rgb(240, 138, 0)",

    "--error-color": "#e88080",
    "--error-color-hover": "#e98b8b",
    "--error-color-pressed": "#e57272",
    "--error-color-suppl": "rgb(208, 58, 82)",
  },
};
let activeTheme: Ref<keyof IThemeConfig> = ref("lightTheme");
export function useTheme(defaultTheme: keyof IThemeConfig = "lightTheme") {
  activeTheme.value = defaultTheme;
  const setTheme = (theme: IThemeItem): void => {
    for (let key in theme) {
      document
        .getElementsByTagName("body")[0]
        .style.setProperty(key, theme[key]);
    }
  };
  const setBaseTheme = (): void => {
    for (let key in baseThemeConfig) {
      document
        .getElementsByTagName("body")[0]
        .style.setProperty(key, baseThemeConfig[key]);
    }
  };
  const changeTheme = (
    themeName: undefined | Ref<keyof IThemeConfig> | keyof IThemeConfig
  ): void => {
    themeName = unref(themeName);
    activeTheme.value = themeName as keyof IThemeConfig;
    let theme = themeConfig[themeName as keyof IThemeConfig];
    if (!theme) {
      activeTheme.value = "lightTheme";
      theme = themeConfig["lightTheme"];
    }
    setTheme(theme);
  };
  return {
    naiveUiTheme,
    activeTheme,
    themeConfig,
    changeTheme,
    setBaseTheme,
  };
}
