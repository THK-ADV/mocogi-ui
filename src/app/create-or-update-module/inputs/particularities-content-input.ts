import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'
import { Rows } from '../../form/module-form/module-form.component'

export function particularitiesContent(
  deContent?: Content,
  enContent?: Content,
): Rows<unknown, unknown> {
  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return $localize`Besonderheiten (deutsch)`
      case 'en':
        return $localize`Particularities (english)`
    }
  }

  function body(lang: Lang) {
    switch (lang) {
      case 'de':
        return deContent?.particularities ?? ''
      case 'en':
        return enContent?.particularities ?? ''
    }
  }

  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `particularities-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang),
    }
  }

  return {
    particularities: [
      { input: go('de') as FormInput<unknown, unknown>, language: 'de' },
      { input: go('en') as FormInput<unknown, unknown>, language: 'en' },
    ],
  }
}
