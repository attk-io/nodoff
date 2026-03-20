import { ref, watch, onMounted } from "vue";

type Theme = "light" | "dark";

const STORAGE_KEY = "nodoff-theme";

export function useTheme() {
  const theme = ref<Theme>("dark");

  function apply(t: Theme) {
    const el = document.documentElement;
    if (t === "dark") {
      el.classList.add("dark");
      el.classList.remove("light");
    } else {
      el.classList.add("light");
      el.classList.remove("dark");
    }
  }

  function toggle() {
    theme.value = theme.value === "dark" ? "light" : "dark";
  }

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      theme.value = stored;
    } else {
      theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    apply(theme.value);
  });

  watch(theme, (t) => {
    apply(t);
    localStorage.setItem(STORAGE_KEY, t);
  });

  return { theme, toggle };
}
