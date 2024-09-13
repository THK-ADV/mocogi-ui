import { NumberInput } from '../../form/plain-input/plain-input.component'
import { FormInput } from '../../form/form-input'
import { WorkloadLike } from '../../types/workload'
import { Rows } from '../../form/module-form/module-form.component'

export function workloadInput(workload?: WorkloadLike): Rows<unknown, unknown> {
  function lectureInput(): NumberInput {
    return go($localize`Vorlesung`, 'lecture', workload?.lecture)
  }

  function seminarInput(): NumberInput {
    return go($localize`Seminar`, 'seminar', workload?.seminar)
  }

  function practicalInput(): NumberInput {
    return go($localize`Praktikum`, 'practical', workload?.practical)
  }

  function exerciseInput(): NumberInput {
    return go($localize`Übung`, 'exercise', workload?.exercise)
  }

  function projectWorkInput(): NumberInput {
    return go($localize`Projektarbeit`, 'projectWork', workload?.projectWork)
  }

  function projectSupervisionInput(): NumberInput {
    return go($localize`Projektbetreuung`, 'projectSupervision', workload?.projectSupervision)
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

  return {
    'lecture': [{input: lectureInput() as FormInput<unknown, unknown>}],
    'seminar': [{input: seminarInput() as FormInput<unknown, unknown>}],
    'practical': [{input: practicalInput() as FormInput<unknown, unknown>}],
    'exercise': [{input: exerciseInput() as FormInput<unknown, unknown>}],
    'project-work': [{input: projectWorkInput() as FormInput<unknown, unknown>}],
    'project-supervision': [{input: projectSupervisionInput() as FormInput<unknown, unknown>}],
  }
}
