import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'
import { Rows } from '../../form/module-form/module-form.component'

export function literatureContent(
  deContent?: Content,
  enContent?: Content,
): Rows<unknown, unknown> {
  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return $localize`Empfohlene Literatur (deutsch)`
      case 'en':
        return $localize`Recommended Reading (english)`
    }
  }

  function body(lang: Lang) {
    switch (lang) {
      case 'de':
        return deContent?.recommendedReading ?? ''
      case 'en':
        return enContent?.recommendedReading ?? ''
    }
  }

  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `literature-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang),
    }
  }

  return {
    'learning-outcome': [
      { input: go('de') as FormInput<unknown, unknown>, language: 'de' },
      { input: go('en') as FormInput<unknown, unknown>, language: 'en' },
    ],
  }
}
