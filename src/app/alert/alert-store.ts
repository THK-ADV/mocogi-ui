import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { Alert } from './alert'

export const AlertStore = signalStore(
  { providedIn: 'root' },
  withState({ alerts: new Array<Alert>() }),
  withMethods((store) => {
    return {
      add(alert: Alert): void {
        patchState(store, (state) => ({
          alerts: [...state.alerts, alert],
        }))
      },
      remove(alert: Alert): void {
        patchState(store, ({ alerts }) => ({
          alerts: alerts.filter((a) => a !== alert),
        }))
      },
      removeAll(): void {
        patchState(store, () => ({ alerts: [] }))
      },
    }
  }),
)
