import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'
import { Rows } from '../../form/module-form/module-form.component'

export function learningOutcomeContent(deContent?: Content, enContent?: Content): Rows<unknown, unknown> {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `learning-outcome-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang),
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return $localize`Angestrebte Lernergebnisse`
      case 'en':
        return $localize`Learning Outcome`
    }
  }

  function body(lang: Lang) {
    switch (lang) {
      case 'de':
        return deContent?.learningOutcome ?? ''
      case 'en':
        return enContent?.learningOutcome ?? ''
    }
  }

  return {
    'learning-outcome': [
      {input: go('de') as FormInput<unknown, unknown>, language: 'de'},
      {input: go('en') as FormInput<unknown, unknown>, language: 'en'},
    ],
  }
}
