/***** BASE IMPORTS *****/
import { Store, useStore } from "@tanstack/react-store";
import { useCallback } from "react";

/***** STORE *****/
const notificationStore = new Store({
  permission: Notification.permission,
  loading: false
})

/***** COMPONENT START *****/
export const useBrowserNotification = () => {
  /***** HOOKS *****/
  const { loading, permission } = useStore(notificationStore);

  /***** FUNCTIONS *****/
  const requestPermission = useCallback(async () => {
    notificationStore.setState((state) => ({ ...state, loading: true }));

    await Notification.requestPermission().then((permission) => {
      notificationStore.setState((state) => ({ ...state, permission, loading: false }));
    })
  }, []);

  const trigger = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === "default") {
      if (!notificationStore.state.loading) {
        requestPermission().then(() => {
          if (Notification.permission === 'granted') {
            new Notification(title, options);
          }
        })
      }
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }, [])

  /***** RENDER *****/
  return {
    loading,
    trigger,
    requestPermission,
    permission
  }
}
