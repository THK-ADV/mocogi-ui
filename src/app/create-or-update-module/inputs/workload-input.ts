import { Metadata } from '../../http/http.service'
import { NumberInput } from '../../form/plain-input/plain-input.component'

export const lectureInput = (metadata?: Metadata): NumberInput =>
  go('Vorlesung', 'lecture', metadata?.workload.lecture)

export const seminarInput = (metadata?: Metadata): NumberInput =>
  go('Seminar', 'seminar', metadata?.workload.seminar)

export const practicalInput = (metadata?: Metadata): NumberInput =>
  go('Praktikum', 'practical', metadata?.workload.practical)

export const exerciseInput = (metadata?: Metadata): NumberInput =>
  go('Übung', 'exercise', metadata?.workload.exercise)

export const projectWorkInput = (metadata?: Metadata): NumberInput =>
  go('Projektarbeit', 'projectWork', metadata?.workload.projectWork)

export const projectSupervisionInput = (metadata?: Metadata): NumberInput =>
  go('Projektbetreuung', 'projectSupervision', metadata?.workload.projectSupervision)

function go(label: string, attr: string, initialValue?: number): NumberInput {
  return {
    kind: 'number',
    label: label,
    attr: `workload-${attr}'`,
    disabled: false,
    required: true,
    initialValue: initialValue ?? 0,
    min: 0
  }
}
