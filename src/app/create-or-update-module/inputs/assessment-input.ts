import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { AssessmentMethodCallback } from '../callbacks/assessment-method.callback'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { optionalLabel, requiredLabel } from './inputs'
import { mapOpt } from '../../ops/undefined-ops'
import { AssessmentMethodEntry } from '../../types/assessment-methods'
import { AssessmentMethod } from '../../types/core/assessment-method'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showLabel, showPerson } from '../../ops/show.instances'
import { Rows } from '../../form/module-form/module-form.component'
import { Identity } from '../../types/core/person'
import { ExamPhase } from '../../types/core/exam-phase'
import { MetadataLike } from '../../types/metadata'
import { ExamPhasesCallback } from '../callbacks/exam-phases-callback'

function showTooltip(am: AssessmentMethod): string | undefined {
  switch (am.id) {
    case 'written-exam':
      return $localize`:@@written-exam:In den Klausurarbeiten soll die oder der Studierende nachweisen, dass sie oder er in begrenzter Zeit und mit beschränkten Hilfsmitteln Themen oder Fragestellungen aus Gebieten des jeweiligen Moduls mit geläufigen wissenschaftlichen Methoden ihrer oder seiner Fachrichtung erkennt und auf richtigem Wege zu einer Lösung finden kann.`
    case 'written-exam-answer-choice-method':
      return $localize`:@@written-exam-answer-choice-method:Klausurarbeiten können ganz oder teilweise auch in der Form des Antwortwahlverfahrens durchgeführt werden. Hierbei haben die Studierenden unter Aufsicht schriftlich gestellte Fragen durch die Angabe der für zutreffend befundenen Antworten aus einem Katalog vorgegebener Antwortmöglichkeiten zu lösen. Das Antwortwahlverfahren kommt in dazu geeigneten Modulen auf Antrag der Prüfenden und mit Zustimmung des Prüfungsausschusses zur Anwendung.`
    case 'oral-exam':
      return $localize`:@@oral-exam:Mündliche Prüfungen werden, außer in Fällen des § 18 Abs. 5, vor einer Prüferin oder einem Prüfer in Gegenwart einer sachkundigen Beisitzerin oder eines sachkundigen Beisitzers (§ 9 Abs. 1) oder vor mehreren Prüferinnen oder Prüfern (Kollegialprüfung) als Gruppenprüfungen oder als Einzelprüfungen abgelegt. Werden in einer Prüfung mehrere Fachgebiete gemeinsam geprüft, wird die oder der einzelne Studierende in jedem Fachgebiet grundsätzlich nur von einer Prüferin oder einem Prüfer geprüft, es sei denn, es liegt ein Fall des § 18 Abs. 5 vor. Vor der Festsetzung der Note hat die Prüferin oder der Prüfer die Beisitzerin oder den Beisitzer oder die anderen Prüferinnen oder Prüfer zu hören. Mündliche Prüfungen können auch mit Hilfe elektronischer Kommunikation durchgeführt werden.`
    case 'home-assignment':
      return $localize`:@@home-assignment:Eine Hausarbeit (z.B. Fallstudie, Recherche) dient der Feststellung, ob die Studierenden befähigt sind, innerhalb einer vorgegebenen Frist eine Fachaufgabe nach wissenschaftlichen und fachpraktischen Methoden selbstständig in schriftlicher oder elektronischer Form zu bearbeiten. Das Thema und der Umfang (z. B. Seitenzahl des Textteils) der Hausarbeit werden von der Prüferin beziehungsweise dem Prüfer zu Beginn des Semesters festgelegt. Eine Eigenständigkeitserklärung muss vom Prüfling unterzeichnet und abgegeben werden.`
    case 'open-book-exam':
      return $localize`:@@open-book-exam:Die Open-Book-Ausarbeitung ist eine Kurz-Hausarbeit und damit eine unbeaufsichtigte schriftliche oder elektronische Prüfung. Sie zeichnet sich dadurch aus, dass gemäß Hilfsmittelerklärung der Prüferin bzw. des Prüfers in der Regel alle Hilfsmittel zugelassen sind. Auf die Sicherung guter wissenschaftlicher Praxis durch ordnungsgemäßes Zitieren etc. und das Erfordernis der Eigenständigkeit der Erbringung jedweder Prüfungsleistung wird besonders hingewiesen.`
    case 'project':
      return $localize`:@@project:Die Projektarbeit ist eine Prüfungsleistung, die in der selbstständigen Bearbeitung einer eng umrissenen, wissenschaftlichen Fragestellung unter Anleitung mit einer schriftlichen Dokumentation der Ergebnisse in Berichtsform besteht.`
    case 'portfolio':
      return $localize`:@@portfolio:Ein Lernportfolio dokumentiert den studentischen Kompetenzentwicklungsprozess anhand von Präsentationen, Essays, Ausschnitten aus Praktikumsberichten, Inhaltsverzeichnissen von Hausarbeiten, Mitschriften, To-Do-Listen, Forschungsberichten und anderen Leistungsdarstellungen und Lernproduktionen, zusammengefasst als sogenannte „Artefakte“. Nur in Verbindung mit der studentischen Reflexion (schriftlich, mündlich oder auch in einem Video) der Verwendung dieser Artefakte für das Erreichen des zuvor durch die Prüferin oder den Prüfer transparent gemachten Lernziels wird das Lernportfolio zum Prüfungsgegenstand. Während der Erstellung des Lernportfolios wird von der Prüferin oder dem Prüfer im Semesterverlauf Feedback auf Entwicklungsschritte und/oder Artefakte gegeben. Als Prüfungsleistung wird eine nach dem Feedback überarbeitete Form des Lernportfolios – in handschriftlicher oder elektronischer Form – eingereicht.`
    case 'practical-report':
      return $localize`:@@practical-report:Ein Praktikumsbericht (z. B. Versuchsprotokoll) dient der Feststellung, ob die Studierenden befähigt sind, innerhalb einer vorgegebenen Frist eine laborpraktische Aufgabe selbstständig sowohl praktisch zu bearbeiten als auch Bearbeitungsprozess und Ergebnis schriftlich zu dokumentieren, zu bewerten und zu reflektieren. Praktikumsberichte können auch in Form einer Gruppenarbeit zur Prüfung zugelassen werden. Die Bewertung des Praktikumsberichts ist den Studierenden spätestens sechs Wochen nach Abgabe des Berichts bekanntzugeben.`
    case 'oral-contribution':
      return $localize`:@@oral-contribution:Ein mündlicher Beitrag (z. B. Referat, Präsentation, Verhandlung, Moderation) dient der Feststellung, ob die Studierenden befähigt sind, innerhalb einer vorgegebenen Frist eine praxisorientierte Aufgabe nach wissenschaftlichen und fachpraktischen Methoden selbstständig zu bearbeiten und mittels verbaler Kommunikation fachlich angemessen darzustellen. Die Dauer des mündlichen Beitrags wird von der Prüferin beziehungsweise dem Prüfer zu Beginn des Semesters festgelegt. Die für die Benotung des mündlichen Beitrags maßgeblichen Tatsachen sind in einem Protokoll festzuhalten. Die Note ist den Studierenden spätestens eine Woche nach dem mündlichen Beitrag bekanntzugeben.`
    case 'certificate-achievement':
      return $localize`:@@certificate-achievement:Mit einem Testat/Zwischentestat wird bescheinigt, dass die oder der Studierende eine Studienarbeit (z.B. Entwurf) im geforderten Umfang erstellt hat. Der zu erbringende Leistungsumfang sowie die geforderten Inhalte und Anforderungen ergeben sich aus der jeweiligen Modulbeschreibung im Modulhandbuch sowie aus der Aufgabenstellung.`
    case 'performance-assessment':
      return $localize`:@@performance-assessment:Im Rahmen einer Performanzprüfung werden realitätsnahe, typische Handlungssituationen simuliert. Die Studierenden werden hierzu mit einer oder mehreren Aufgabenstellungen konfrontiert, wie sie in ihrem späteren Berufsfeld tatsächlich vorkommen (können). Die Studierenden müssen diese Aufgabenstellung – nach Maßgabe der konkreten Ausgestaltung in dem jeweiligen Modul – alleine oder in der Rolle eines Mitgliedes einer mit den jeweiligen Aufgaben betrauten Gruppe in eigener Verantwortung lösen. Wie sorgfältig die Aufgabenstellung analysiert und welcher Lösungsweg eingeschlagen wird, welche Methoden und Instrumente ausgewählt und eingesetzt werden und wie die Studierenden die eigenen Aktivitäten sowie die Zusammenarbeit mit den anderen Gruppenmitgliedern ausgestalten, organisieren, koordinieren und dokumentieren (Projektmanagement), bestimmen die Studierenden analog zur beruflichen Praxis weitgehend selbst; dies wird bewertet (Performanz).`
    case 'role-play':
      return $localize`:@@role-play:Ein Rollenspiel (auch Planspiel) dient der Feststellung, ob die Studierenden befähigt sind, innerhalb einer vorgegebenen Zeitspanne in einer praxisnahen oder praxisanalogen Situation bzw. Simulation Aufgaben mit wissenschaftlichen Methoden und unter Einsatz von Kommunikations- und Kooperationstechniken in der Regel im Diskurs mit weiteren handelnden, realen oder virtuellen Personen zu lösen. Die Bewertung ist den Studierenden nach Abschluss des Rollenspiels bekanntzugeben.`
    case 'admission-colloquium':
      return $localize`:@@admission-colloquium:Ein Zugangskolloquium dient der Feststellung, ob die Studierenden die versuchsspezifischen Voraussetzungen erfüllen, eine definierte laborpraktische Aufgabe nach wissenschaftlichen und fachpraktischen Methoden selbständig und sicher bearbeiten zu können.`
    case 'specimen':
      return $localize`:@@specimen:Ein Präparat ist das materielle Produkt einer Arbeitsleistung, das hinsichtlich seiner Qualität und Quantität zuvor festgelegten Kriterien genügt. Es dient der Feststellung, ob der Prüfling befähigt ist, innerhalb vorgegebener Fristen eine Aufgabe mit dem Ziel der Herstellung eines Produktes nach wissenschaftlichen und fachpraktischen Methoden selbständig zu bearbeiten. Die Bewertung für das Präparat ist dem Prüfling spätestens zwei Wochen nach dem Abgabetermin bekanntzugeben.`
    default:
      return undefined
  }
}

export type AssessmentMethodKind = 'mandatory' | 'optional'

export function assessmentInput(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: (
    attr: string,
    kind: AssessmentMethodKind,
  ) => AssessmentMethodEntry[],
  examPhases: ExamPhase[],
  currentExamPhases: (attr: string) => ExamPhase[],
  identities: Identity[],
  metadata: MetadataLike | undefined,
): Rows<unknown, unknown> {
  const examiner = identities.filter((a) => a.kind !== 'group')

  function assignmentMethodLabel(kind: AssessmentMethodKind): string {
    switch (kind) {
      case 'mandatory':
        return optionalLabel(
          $localize`Prüfungsformen für alle Pflicht Studiengänge`,
        )
      case 'optional':
        return optionalLabel(
          $localize`Prüfungsformen für alle als WPF belegbare Studiengänge`,
        )
    }
  }

  // TODO maybe change everything to objects
  function showAssessmentMethodEntry(e: AssessmentMethodEntry): string {
    return (
      mapOpt(
        assessmentMethods.find((a) => a.id === e.method),
        showLabel,
      ) ?? '???'
    )
  }

  function dialogInstance(attr: string, kind: AssessmentMethodKind) {
    const entries = currentEntries(attr, kind)
    const callback = new AssessmentMethodCallback(assessmentMethods, entries)
    const columns = [
      { attr: 'method', title: $localize`Prüfungsform` },
      { attr: 'percentage', title: $localize`Prozentualer Anteil` },
      { attr: 'precondition', title: $localize`Vorbedingungen` },
    ]

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      $localize`Prüfungsformen bearbeiten`,
      [
        <OptionsInput<AssessmentMethod>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: assessmentMethods,
          show: showLabel,
          tooltip: (am) => showTooltip(am),
          id: (a) => a.id,
        },
        {
          kind: 'number',
          label: optionalLabel(columns[1].title),
          attr: columns[1].attr,
          disabled: false,
          required: false,
        },
        <OptionsInput<AssessmentMethod>>{
          kind: 'options',
          label: optionalLabel(columns[2].title),
          attr: columns[2].attr,
          disabled: false,
          required: false,
          data: assessmentMethods,
          show: showLabel,
          id: (a) => a.id,
        },
      ],
      entries,
    )
  }

  function go(
    kind: AssessmentMethodKind,
  ): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
    const attr = `assessment-methods-${kind}`
    const entries = currentEntries(attr, kind)
    return {
      kind: 'read-only',
      label: assignmentMethodLabel(kind),
      attr: attr,
      disabled: false,
      required: false,
      options: assessmentMethods,
      show: showAssessmentMethodEntry,
      initialValue: (xs) =>
        entries.filter((a) => xs.some((m) => m.id === a.method)),
      dialogInstance: () => dialogInstance(attr, kind),
    }
  }

  function assessmentMethodsMandatoryInput(): ReadOnlyInput<
    AssessmentMethod,
    AssessmentMethodEntry
  > {
    return go('mandatory')
  }

  function assessmentMethodsOptionalInput(): ReadOnlyInput<
    AssessmentMethod,
    AssessmentMethodEntry
  > {
    return go('optional')
  }

  function showExamPhase(p: ExamPhase) {
    return p.label
  }

  function examPhaseDialogInstance(attr: string) {
    const columns = [{ attr: 'exam-phase', title: $localize`Prüfungsphase` }]
    const current = currentExamPhases(attr)
    const callback = new ExamPhasesCallback(
      examPhases,
      current,
      columns[0].attr,
      showExamPhase,
    )
    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      $localize`Prüfungsphasen bearbeiten`,
      [
        <OptionsInput<ExamPhase>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: examPhases,
          show: showExamPhase,
          id: (a) => a.id,
        },
      ],
      current,
    )
  }

  function examPhasesInput(): ReadOnlyInput<ExamPhase, ExamPhase> {
    const attr = 'exam-phases'
    const entries = currentExamPhases(attr)
    return {
      kind: 'read-only',
      label: $localize`Prüfungsphasen`,
      attr: attr,
      disabled: false,
      required: true,
      options: examPhases,
      show: showExamPhase,
      initialValue: (xs) =>
        entries.filter((a) => xs.some((m) => m.id === a.id)),
      dialogInstance: () => examPhaseDialogInstance(attr),
    }
  }

  function firstExaminerInput(): OptionsInput<Identity> {
    return {
      kind: 'options',
      label: $localize`Erstprüfer*in`,
      attr: 'first-examiner',
      disabled: false,
      required: true,
      data: examiner,
      show: showPerson,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.examiner.first)),
      id: (a) => a.id,
    }
  }

  function secondExaminerInput(): OptionsInput<Identity> {
    return {
      kind: 'options',
      label: $localize`Zweitprüfer*in`,
      attr: 'second-examiner',
      disabled: false,
      required: true,
      data: examiner,
      show: showPerson,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.examiner.second)),
      id: (a) => a.id,
    }
  }

  return {
    'assessment-methods': [
      {
        input: assessmentMethodsMandatoryInput() as FormInput<unknown, unknown>,
      },
    ],
    'assessment-methods-optional': [
      {
        input: assessmentMethodsOptionalInput() as FormInput<unknown, unknown>,
      },
    ],
    'exam-phases': [
      { input: examPhasesInput() as FormInput<unknown, unknown> },
    ],
    'first-examiner': [
      { input: firstExaminerInput() as FormInput<unknown, unknown> },
    ],
    'second-examiner': [
      { input: secondExaminerInput() as FormInput<unknown, unknown> },
    ],
  }
}
