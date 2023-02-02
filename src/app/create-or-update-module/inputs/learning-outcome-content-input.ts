import { FormInput } from '../../form/form-input'
import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { Lang } from './inputs'
import { Content } from '../../types/content'

export function learningOutcomeContent(deContent?: Content, enContent?: Content): FormInput[] {
  // function go(lang: Lang): TextAreaInput[] {
  //   return [
  //     {
  //       kind: 'text-area',
  //       label: what(lang),
  //       attr: `learning-outcome-content-what-${lang}`,
  //       disabled: false,
  //       required: false
  //     },
  //     {
  //       kind: 'text-area',
  //       label: whereby(lang),
  //       attr: `learning-outcome-content-whereby-${lang}`,
  //       disabled: false,
  //       required: false
  //     },
  //     {
  //       kind: 'text-area',
  //       label: wherefore(lang),
  //       attr: `learning-outcome-content-wherefore-${lang}`,
  //       disabled: false,
  //       required: false
  //     }
  //   ]
  // }
  //
  // function what(lang: Lang): string {
  //   switch (lang) {
  //     case 'de':
  //       return 'Was (deutsch)'
  //     case 'en':
  //       return 'What (english)'
  //   }
  // }
  //
  // function whereby(lang: Lang): string {
  //   switch (lang) {
  //     case 'de':
  //       return 'Womit (deutsch)'
  //     case 'en':
  //       return 'Whereby (english)'
  //   }
  // }
  //
  // function wherefore(lang: Lang): string {
  //   switch (lang) {
  //     case 'de':
  //       return 'Wozu (deutsch)'
  //     case 'en':
  //       return 'Wherefore (english)'
  //   }
  // }
  //
  // return [...go('de'), ...go('en')]

  function go(lang: Lang): TextAreaInput {
    return {
      kind: 'text-area',
      label: label(lang),
      attr: `learning-outcome-content-${lang}`,
      disabled: false,
      required: false,
      initialValue: body(lang)
    }
  }

  function label(lang: Lang) {
    switch (lang) {
      case 'de':
        return 'Angestrebte Lernergebnisse'
      case 'en':
        return 'Learning Outcome'
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

  return [go('de'), go('en')]
}
