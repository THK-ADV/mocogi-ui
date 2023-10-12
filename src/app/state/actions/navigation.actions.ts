import { createActionGroup, emptyProps } from '@ngrx/store'

export const NavigationActions = createActionGroup({
  source: 'Navigation',
  events: {
    'Empty': emptyProps(),
  },
})
