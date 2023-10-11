import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const NavigationActions = createActionGroup({
  source: 'Navigation',
  events: {
    'Navigate': props<{ path: Array<string> }>(),
    'Empty': emptyProps(),
  },
})
