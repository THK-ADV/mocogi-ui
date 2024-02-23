import { Pipe, PipeTransform } from '@angular/core'
import { PipelineError } from '../types/validation-result'

@Pipe({
  name: 'pipelineError',
})
export class PipelineErrorPipe implements PipeTransform {

  transform(err: PipelineError): unknown {
    switch (err.tag) {
      case 'parsing-error':
        return `${this.headline('Parsen', err.metadata)}\
                <h4>Erwartet:</h4><p>${err.error.expected}</p>\`
                <h4>Vorgefunden:</h4><p>${err.error.found}</p>`
      case 'printing-error':
        return `${this.headline('Printen', err.metadata)}\
                <h4>Erwartet:</h4><p>${err.error.expected}</p>\`
                <h4>Vorgefunden:</h4><p>${err.error.found}</p>`
      case 'validation-error':
        return `${this.headline('Validieren', err.metadata)}\
                <p>${err.error.errs.map(s => `${s}<br>`)}</p>`
    }
  }

  headline = (kind: string, metadata: string): string =>
    `<h3>Fehler beim ${kind} von ${metadata}</h3>`
}
