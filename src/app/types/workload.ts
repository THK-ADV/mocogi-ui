export interface WorkloadLike {
  lecture: number
  seminar: number
  practical: number
  exercise: number
  projectSupervision: number
  projectWork: number
}

export interface Workload extends WorkloadLike {
  lecture: number
  seminar: number
  practical: number
  exercise: number
  projectSupervision: number
  projectWork: number
  selfStudy: number
  total: number
}

export interface WorkloadProtocol extends WorkloadLike {
  lecture: number
  seminar: number
  practical: number
  exercise: number
  projectSupervision: number
  projectWork: number
}
