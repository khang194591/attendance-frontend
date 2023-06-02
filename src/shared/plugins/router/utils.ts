import { RouteRecordRaw } from "vue-router";

export const getRoutesFromModules = () => {
  const results: Record<string, RouteRecordRaw> = {};
  const files = import.meta.glob("/**/modules/**/*.router.ts", {
    eager: true,
    import: "default",
  });
  for (const key in files) {
    const module = key.split("/")[3];
    results[module] = files[key] as RouteRecordRaw;
  }
  return results;
};

export const modulesRoutes = getRoutesFromModules();
