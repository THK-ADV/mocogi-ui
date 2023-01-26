import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'

export function learningMethodsContent(deContent?: Content, enContent?: Content): FormInput[] {
  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `learning-methods-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang)
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return 'Lehr- und Lernmethoden (deutsch)'
      case 'en':
        return 'Teaching and Learning Methods (english)'
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

  return [go('de'), go('en')]
}
