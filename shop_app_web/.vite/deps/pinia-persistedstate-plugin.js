import "./chunk-LQ2VYIYD.js";

// node_modules/pinia-persistedstate-plugin/dist/pinia-persistedstate-plugin.es.js
function logGroup(mutationId, mutation, state) {
  const group = console.groupCollapsed || console.group;
  try {
    group(mutationId, (/* @__PURE__ */ new Date()).toLocaleString());
    console.log("mutation", mutation);
    console.log("state", state);
    console.groupEnd();
  } catch (e) {
    console.log("—— log end ——");
  }
}
function createPersistedState(options) {
  const storage = (options == null ? void 0 : options.storage) || window && window.localStorage;
  const key = (options == null ? void 0 : options.key) || "pinia";
  const logger = (options == null ? void 0 : options.logger) || false;
  const getState = (key2, storage2) => {
    const value = storage2.getItem ? storage2.getItem(key2) : storage2.get(key2);
    try {
      return typeof value === "string" ? JSON.parse(value) : typeof value === "object" ? value : void 0;
    } catch (err) {
    }
    return void 0;
  };
  const setState = (key2, state, storage2) => {
    return storage2.setItem ? storage2.setItem(key2, JSON.stringify(state)) : storage2.set(key2, JSON.stringify(state));
  };
  return (Context) => {
    const store = Context.store;
    const tempKey = `${key}-${store.$id}`;
    const data = getState(tempKey, storage);
    data && store.$patch(data);
    store.$subscribe((mutation, state) => {
      logger && logGroup(mutation.storeId, mutation, state);
      const tempKey2 = `${key}-${mutation.storeId}`;
      setState(tempKey2, state, storage);
    });
  };
}
export {
  createPersistedState
};
//# sourceMappingURL=pinia-persistedstate-plugin.js.map
