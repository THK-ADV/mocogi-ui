import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'
import { Rows } from '../../form/module-form/module-form.component'

export function learningMethodsContent(deContent?: Content, enContent?: Content): Rows<unknown, unknown> {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `learning-methods-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang),
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return $localize`Lehr- und Lernmethoden (deutsch)`
      case 'en':
        return $localize`Teaching and Learning Methods (english)`
    }
  }

  function body(lang: Lang) {
    switch (lang) {
      case 'de':
        return deContent?.teachingAndLearningMethods ?? ''
      case 'en':
        return enContent?.teachingAndLearningMethods ?? ''
    }
  }

  return {
    'learning-methods': [
      {input: go('de') as FormInput<unknown, unknown>, language: 'de'},
      {input: go('en') as FormInput<unknown, unknown>, language: 'en'},
    ],
  }
}
