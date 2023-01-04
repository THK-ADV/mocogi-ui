import { Label, Module } from '../http/http.service'

export function showLabel(label: Label): string {
  return label.deLabel
}

export function showModule(module: Module): string {
  return module.title
}

