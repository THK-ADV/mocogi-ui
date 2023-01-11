import { Label } from '../types/core/label'
import { Module } from '../types/module'

export function showLabel(label: Label): string {
  return label.deLabel
}

export function showModule(module: Module): string {
  return module.title
}

