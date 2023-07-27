import { NumberInput } from '../../form/plain-input/plain-input.component'
import { FormInput } from '../../form/form-input'
import { WorkloadLike } from '../../types/workload'

export function workloadInput(workload?: WorkloadLike) {
  function lectureInput(): NumberInput {
    return go('Vorlesung', 'lecture', workload?.lecture)
  }

  function seminarInput(): NumberInput {
    return go('Seminar', 'seminar', workload?.seminar)
  }

  function practicalInput(): NumberInput {
    return go('Praktikum', 'practical', workload?.practical)
  }

  function exerciseInput(): NumberInput {
    return go('Übung', 'exercise', workload?.exercise)
  }

  function projectWorkInput(): NumberInput {
    return go('Projektarbeit', 'projectWork', workload?.projectWork)
  }

  function projectSupervisionInput(): NumberInput {
    return go('Projektbetreuung', 'projectSupervision', workload?.projectSupervision)
  }

  function go(label: string, attr: string, initialValue?: number): NumberInput {
    return {
      kind: 'number',
      label: label,
      attr: `workload-${attr}`,
      disabled: false,
      required: true,
      initialValue: initialValue ?? 0,
      min: 0,
    }
  }

  return <FormInput<unknown, unknown>[]>[
    lectureInput(),
    seminarInput(),
    practicalInput(),
    exerciseInput(),
    projectWorkInput(),
    projectSupervisionInput(),
  ]
}
