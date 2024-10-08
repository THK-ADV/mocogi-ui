import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'
import { Rows } from '../../form/module-form/module-form.component'

export function moduleContent(
  deContent?: Content,
  enContent?: Content,
): Rows<unknown, unknown> {
  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return $localize`Modulinhalte (deutsch)`
      case 'en':
        return $localize`Module Content (english)`
    }
  }

  function body(lang: Lang) {
    switch (lang) {
      case 'de':
        return deContent?.content ?? ''
      case 'en':
        return enContent?.content ?? ''
    }
  }

  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `module-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang),
    }
  }

  return {
    'module-content': [
      { input: go('de') as FormInput<unknown, unknown>, language: 'de' },
      { input: go('en') as FormInput<unknown, unknown>, language: 'en' },
    ],
  }
}
