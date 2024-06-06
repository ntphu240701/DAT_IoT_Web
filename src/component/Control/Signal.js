import { signal } from "@preact/signals-react";

export const plantState = signal("default");
export const plantData = signal([]);
export const listDevice = signal([]);
export const mode = signal("overview");
export const defaultDataState = signal(true);
export const defaultData = signal({
  defaultscreenid_: 0,
  defaultscreenstate_: 0,
});
