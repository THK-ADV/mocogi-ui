import { Metadata } from '../../http/http.service'
import { NumberInput } from '../../form/plain-input/plain-input.component'
import { FormInput } from '../../form/form-input'

export function workloadInput(metadata?: Metadata): FormInput[] {
  function lectureInput(): NumberInput {
    return go('Vorlesung', 'lecture', metadata?.workload.lecture)
  }

  function seminarInput(): NumberInput {
    return go('Seminar', 'seminar', metadata?.workload.seminar)
  }

  function practicalInput(): NumberInput {
    return go('Praktikum', 'practical', metadata?.workload.practical)
  }

  function exerciseInput(): NumberInput {
    return go('Übung', 'exercise', metadata?.workload.exercise)
  }

  function projectWorkInput(): NumberInput {
    return go('Projektarbeit', 'projectWork', metadata?.workload.projectWork)
  }

  function projectSupervisionInput(): NumberInput {
    return go('Projektbetreuung', 'projectSupervision', metadata?.workload.projectSupervision)
  }

  function go(label: string, attr: string, initialValue?: number): NumberInput {
    return {
      kind: 'number',
      label: label,
      attr: `workload-${attr}`,
      disabled: false,
      required: true,
      initialValue: initialValue ?? 0,
      min: 0
    }
  }

  return [
    lectureInput(),
    seminarInput(),
    practicalInput(),
    exerciseInput(),
    projectWorkInput(),
    projectSupervisionInput()
  ]
}
