import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const PermissionsDialogActions = createActionGroup({
  source: 'Permissions Dialog',
  events: {
    Enter: props<{ moduleId: string }>(),
    Save: props<{ moduleId: string }>(),
    Remove: props<{ campusId: string }>(),
    Add: props<{ campusId: string }>(),
    Edit: props<{ changedCampusId: string; newValue: string }>(),
    Cancel: emptyProps(),
  },
})

export const PermissionsDialogApiActions = createActionGroup({
  source: 'Permissions Dialog API',
  events: {
    'Saved Changes Success': emptyProps(),
    'Received Permissions Successfully': props<{
      permissions: Array<string>
    }>(),
  },
})
