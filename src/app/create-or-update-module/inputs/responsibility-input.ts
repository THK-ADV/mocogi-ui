import { Metadata, Person } from '../../http/http.service'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { MultipleOptionsInput } from '../../form/multiple-options-input/multiple-options-input.component'

export const moduleCoordinatorInput = (persons: Person[], metadata?: Metadata): OptionsInput<Person> =>
  ({
    kind: 'options',
    label: 'Modulverantwortliche*r',
    attr: 'moduleCoordinator',
    disabled: false,
    required: true,
    data: persons,
    show: showPerson,
    initialValue: metadata && (as => as.find(a => metadata.moduleManagement.some(m => m === a.id)))
  })

export const lecturerInput = (persons: Person[], metadata?: Metadata): MultipleOptionsInput<Person> =>
  ({
    kind: 'multiple-options',
    label: 'Dozierende',
    attr: 'lecturer',
    disabled: false,
    required: true,
    data: persons,
    show: showPerson,
    initialValue: metadata && (xs => xs.filter(a => metadata.lecturers.some(m => m === a.id)))
  })

const showPerson = (p: Person): string => {
  switch (p.kind) {
    case 'single':
      return `${p.lastname}, ${p.firstname}`
    case 'group':
      return p.title
    case 'unknown':
      return p.title
  }
}
