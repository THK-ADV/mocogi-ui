import {
  asRecord,
  parseAbbreviation,
  parseAssessmentMethods,
  parseCompetences,
  parseDeContent,
  parseDuration,
  parseECTS,
  parseEnContent,
  parseGlobalCriteria,
  parseLanguage,
  parseLecturers,
  parseLocation,
  parseModuleCompendium,
  parseModuleManagement,
  parseModuleRelation,
  parseModuleType,
  parseOptional,
  parseParticipants,
  parsePo,
  parsePrerequisites,
  parseSeason,
  parseStatus,
  parseString,
  parseTaughtWith,
  parseTitle,
  parseWorkload
} from './metadata-protocol-factory'
import { WorkloadProtocol } from './workload'
import { Participants } from './participants'
import { ModuleRelation } from './module-relation'
import { AssessmentMethods } from './assessment-methods'
import { Content } from './content'
import { PrerequisitesOutput } from './prerequisites'
import { POs } from './pos'

describe('metadata protocol factory', () => {

  it('should parse to record', () => {
    const record = asRecord({'k1': 'v1', 'k2': 1})
    expect(record['k1']).toEqual('v1')
    expect(record['k2']).toEqual(1)
    expect(record['k3']).toBeUndefined()
  })

  it('should parse a string', () => {
    expect(parseString('k1', {'k1': 'v1'}))
      .toEqual('v1')
    try {
      parseString('k2', {'k1': 'v1'})
    } catch (e) {
      expect((e as Error).message).not.toEqual('')
    }
  })

  it('should parse optional', () => {
    expect(parseOptional('b', {'a': 1, 'b': 2}, v => v))
      .toEqual(2)
    expect(parseOptional('b', {'a': 1, 'b': null}, v => v))
      .toBeUndefined()
    expect(parseOptional('b', {'a': 1, 'b': undefined}, v => v))
      .toBeUndefined()
    expect(parseOptional('b', {'a': 1}, v => v))
      .toBeUndefined()
  })

  it('should parse title', () => {
    expect(parseTitle({'title': 'Paradigmen der Programmierung'}))
      .toEqual('Paradigmen der Programmierung')
  })

  it('should parse abbreviation', () => {
    expect(parseAbbreviation({'abbreviation': 'PP'}))
      .toEqual('PP')
  })

  it('should parse module type', () => {
    expect(parseModuleType({'moduleType': {'abbrev': 'module', 'deLabel': 'Modul', 'enLabel': 'Module'}}))
      .toEqual('module')
  })

  it('should parse ects', () => {
    expect(parseECTS({'ects': 5}))
      .toEqual(5)
    expect(parseECTS({'ects': '5'}))
      .toEqual(5)
  })

  it('should parse language', () => {
    expect(parseLanguage({'language': {'abbrev': 'de', 'deLabel': 'Deutsch', 'enLabel': 'german'}}))
      .toEqual('de')
  })

  it('should parse duration', () => {
    expect(parseDuration({'duration': 1}))
      .toEqual(1)
  })

  it('should parse season', () => {
    expect(parseSeason({'season': {'abbrev': 'ss', 'deLabel': 'Sommersemester', 'enLabel': 'summer term'}}))
      .toEqual('ss')
  })

  it('should parse workload', () => {
    const workload: Record<string, unknown> = {
      'workload-lecture': 1,
      'workload-seminar': 2,
      'workload-practical': 3,
      'workload-exercise': 4,
      'workload-projectSupervision': 5,
      'workload-projectWork': 6,
    }
    const result: WorkloadProtocol = {
      lecture: 1,
      seminar: 2,
      practical: 3,
      exercise: 4,
      projectSupervision: 5,
      projectWork: 6
    }
    expect(parseWorkload(workload))
      .toEqual(result)
  })

  it('should parse status', () => {
    expect(parseStatus({'status': {'abbrev': 'active', 'deLabel': 'Aktiv', 'enLabel': 'active'}}))
      .toEqual('active')
  })

  it('should parse location', () => {
    expect(parseLocation({'location': {'abbrev': 'gm', 'deLabel': 'Gummersbach', 'enLabel': 'Gummersbach'}}))
      .toEqual('gm')
  })

  it('should parse participants', () => {
    expect(parseParticipants({'participants': [{'value': {'min': 0, 'max': 10}}]}))
      .toEqual(<Participants>{min: 0, max: 10})
    expect(parseParticipants({'participants': []}))
      .toBeUndefined()
  })

  it('should parse module relation', () => {
    const parent: { 'value': ModuleRelation } = {
      'value': {
        'kind': 'parent',
        'children': ['dca56fa6-1952-4b47-bf60-3dcb32e86ada', 'c45bc346-61ae-446c-a98d-55abaef5729f']
      }
    }
    const child: { 'value': ModuleRelation } = {
      'value': {
        'kind': 'child',
        'parent': 'dca56fa6-1952-4b47-bf60-3dcb32e86ada'
      }
    }
    expect(parseModuleRelation({'module-relation': [parent]}))
      .toEqual(parent.value)
    expect(parseModuleRelation({'module-relation': [child]}))
      .toEqual(child.value)
    expect(parseModuleRelation({'module-relation': []}))
      .toBeUndefined()
  })

  it('should parse module coordinator', () => {
    const moduleCoordinator: Record<string, unknown> = {
      'id': 'cko',
      'lastname': 'Kohls',
      'firstname': 'Christian',
      'title': 'Prof. Dr.',
      'faculties': [{
        'abbrev': 'f10',
        'deLabel': 'Fakultät für Informatik und Ingenieurwissenschaften',
        'enLabel': 'Faculty of Computer Science and Engineering Science'
      }],
      'abbreviation': 'CK',
      'status': 'active',
      'kind': 'single'
    }
    expect(parseModuleManagement({'moduleCoordinator': moduleCoordinator}))
      .toEqual(['cko'])
  })

  it('should parse lecturer', () => {
    const lecturer: Record<string, unknown>[] = [
      {
        'value': {
          'id': 'ado',
          'lastname': 'Dobrynin',
          'firstname': 'Alexander',
          'title': 'M.Sc.',
          'faculties': [{
            'abbrev': 'f10',
            'deLabel': 'Fakultät für Informatik und Ingenieurwissenschaften',
            'enLabel': 'Faculty of Computer Science and Engineering Science'
          }],
          'abbreviation': 'AD',
          'status': 'active',
          'kind': 'single'
        }
      },
      {
        'value': {
          'id': 'cko',
          'lastname': 'Kohls',
          'firstname': 'Christian',
          'title': 'Prof. Dr.',
          'faculties': [{
            'abbrev': 'f10',
            'deLabel': 'Fakultät für Informatik und Ingenieurwissenschaften',
            'enLabel': 'Faculty of Computer Science and Engineering Science'
          }],
          'abbreviation': 'CK',
          'status': 'active',
          'kind': 'single'
        }
      }
    ]
    expect(parseLecturers({'lecturer': lecturer}))
      .toEqual(['ado', 'cko'])
    expect(parseLecturers({'lecturer': []}))
      .toEqual([])
  })

  it('should parse assessmentMethods', () => {
    const mandatory: Record<string, unknown>[] = [{'value': {'method': 'written-exam', 'percentage': null, 'precondition': ['practical']}}]
    const optional: Record<string, unknown>[] = [{'value': {'method': 'written-exam', 'percentage': undefined, 'precondition': []}}]
    const res1: AssessmentMethods = {
      mandatory: [{'method': 'written-exam', 'percentage': undefined, 'precondition': ['practical']}],
      optional: [{'method': 'written-exam', 'percentage': undefined, 'precondition': []}]
    }
    const res2: AssessmentMethods = {
      mandatory: [],
      optional: []
    }
    expect(parseAssessmentMethods({
      'assessment-methods-mandatory': mandatory,
      'assessment-methods-optional': optional
    })).toEqual(res1)
    expect(parseAssessmentMethods({
      'assessment-methods-mandatory': [],
      'assessment-methods-optional': []
    })).toEqual(res2)
  })

  it('should parse content', () => {
    const content: Record<string, unknown> = {
      'learning-outcome-content-de': '\na\n',
      'learning-outcome-content-en': '\nb\n',
      'module-content-de': '\nc\n',
      'module-content-en': '\nd\n',
      'learning-methods-content-de': '\ne\n',
      'learning-methods-content-en': '\nf\n',
      'literature-content-de': '\ng\n',
      'literature-content-en': '\nh\n',
      'particularities-content-de': '\ni\n',
      'particularities-content-en': 'j'
    }
    const deContent: Content = {
      learningOutcome: '\na\n',
      content: '\nc\n',
      teachingAndLearningMethods: '\ne\n',
      recommendedReading: '\ng\n',
      particularities: '\ni\n',
    }
    const enContent: Content = {
      learningOutcome: '\nb\n',
      content: '\nd\n',
      teachingAndLearningMethods: '\nf\n',
      recommendedReading: '\nh\n',
      particularities: 'j'
    }
    expect(parseDeContent(content)).toEqual(deContent)
    expect(parseEnContent(content)).toEqual(enContent)
  })

  it('should parse prerequisites', () => {
    const input: Record<string, unknown> = {
      'required-prerequisites-text': '',
      'required-prerequisites-modules': [],
      'required-prerequisites-po': [],
      'recommended-prerequisites-text': 'Coden können, Spaß haben',
      'recommended-prerequisites-modules': [
        {'value': {'id': 'dca56fa6-1952-4b47-bf60-3dcb32e86ada', 'title': 'Algorithmen und Programmierung 1', 'abbrev': 'AP1'}},
        {'value': {'id': 'f1fd21a9-ab5c-40b0-ab09-3dff35e86a72', 'title': 'Algorithmen und Programmierung 2', 'abbrev': 'AP2'}}
      ],
      'recommended-prerequisites-po': [],
    }
    const result: PrerequisitesOutput = {
      required: undefined,
      recommended: {
        text: 'Coden können, Spaß haben',
        modules: ['dca56fa6-1952-4b47-bf60-3dcb32e86ada', 'f1fd21a9-ab5c-40b0-ab09-3dff35e86a72'],
        pos: []
      }
    }
    expect(parsePrerequisites(input)).toEqual(result)
  })

  it('should parse pos', () => {
    const mandatory: Record<string, unknown>[] = [
      {
        'value':
          {
            'po': 'inf_mi4',
            'recommendedSemester': [3],
            'recommendedSemesterPartTime': []
          }
      },
      {
        'value':
          {
            'po': 'inf_inf2',
            'recommendedSemester': [4],
            'recommendedSemesterPartTime': []
          }
      }
    ]
    const optional: Record<string, unknown>[] = [
      {
        'value':
          {
            'po': 'inf_wi4',
            'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
            'partOfCatalog': false,
            'recommendedSemester': [3]
          }
      },
      {
        'value':
          {
            'po': 'inf_itm2',
            'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
            'partOfCatalog': false,
            'recommendedSemester': [3, 4]
          }
      }
    ]
    const result: POs = {
      mandatory: [
        {
          'po': 'inf_mi4',
          'recommendedSemester': [3],
          'recommendedSemesterPartTime': []
        },
        {
          'po': 'inf_inf2',
          'recommendedSemester': [4],
          'recommendedSemesterPartTime': []
        }
      ],
      optional: [
        {
          'po': 'inf_wi4',
          'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
          'partOfCatalog': false,
          'recommendedSemester': [3]
        },
        {
          'po': 'inf_itm2',
          'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
          'partOfCatalog': false,
          'recommendedSemester': [3, 4]
        }
      ]
    }
    const input = {'po-mandatory': mandatory, 'po-optional': optional}
    expect(parsePo(input)).toEqual(result)
  })

  it('should parse competences', () => {
    const competences: Record<string, unknown>[] = [
      {
        'value':
          {
            'abbrev': 'analyze_domains',
            'deLabel': 'Analyze Domains',
            'deDesc': 'Die Absolvent*innen sind in der Lage, Fachdomänen zu analysieren und Beziehungen von Entitäten und Konzepten sowohl innerhalb der Domäne wie auch zwischen Domänen aufzudecken. Dies ist eine wesentliche Voraussetzung für die Konzeption und Umsetzung digitaler Artefakte für ganz unterschiedliche gesellschaftliche und wirtschaftliche Bereiche.\nHierfür sind die Absolvent*innen in der Lage, sich selbstständig neue Methoden und neues Wissen anzueignen. Sie erkennen, welches Wissen in einer bestimmten Domäne für sie relevant ist, indem sie wissenschaftlich, analytisch und reflektiert arbeiten. Sie beherrschen Methoden zur Analyse von Domänen und ihren Fachsprachen, und können die Erkenntnisse formal präzise und gleichzeitig verständlich dokumentieren und kommunizieren.\n',
            'enLabel': 'Analyze Domains',
            'enDesc': 'Graduates are able to analyze subject domains and uncover relationships of entities and concepts both within and between domains. This is an essential prerequisite for the conception and implementation of digital artifacts for very different social and economic areas.\nFor this purpose, graduates are able to independently acquire new methods and new knowledge. They recognize what knowledge is relevant to them in a particular domain by working scientifically, analytically and reflectively. They are proficient in methods for analyzing domains and their specialized languages, and can document and communicate the findings in a formally precise and at the same time comprehensible manner.\n'
          }
      }
    ]
    expect(parseCompetences({'competences': competences}))
      .toEqual(['analyze_domains'])
  })

  it('should parse global criteria', () => {
    const globalCriteria: Record<string, unknown>[] = [
      {
        'value':
          {
            'abbrev': 'employability',
            'deLabel': 'Employability',
            'deDesc': 'In unseren Studiengängen qualifizieren wir unsere Studierenden für komplexe Tätigkeiten in einer sich wandelnden,  arbeitsteiligen, zunehmend digitalisierten und internationalen Berufswelt und befähigen sie zur verantwortlichen Mitgestaltung ihrer Arbeits- und Lebenswelt. Employability und Global Citizenship bedingen sich in unserem Verständnis gegenseitig. Daher beinhaltet Employability nicht nur eine Ausbildungsfunktion, sondern fordert immer auch die Bildungsfunktion im Medium der Wissenschaft.\n',
            'enLabel': 'Employability',
            'enDesc': ''
          }
      }
    ]
    expect(parseGlobalCriteria({'global-criteria': globalCriteria}))
      .toEqual(['employability'])
  })

  it('should parse taught with', () => {
    const taughtWith: Record<string, unknown>[] = [
      {
        'value':
          {
            'id': 'dca56fa6-1952-4b47-bf60-3dcb32e86ada',
            'title': 'Algorithmen und Programmierung 1',
            'abbrev': 'AP1'
          }
      }
    ]
    expect(parseTaughtWith({'taught-with': taughtWith}))
      .toEqual(['dca56fa6-1952-4b47-bf60-3dcb32e86ada'])
  })

  it('should parse module compendium', () => {
    const input: Record<string, unknown> = {
      'title': 'Paradigmen der Programmierung',
      'abbreviation': 'PP',
      'moduleType':
        {
          'abbrev': 'module',
          'deLabel': 'Modul',
          'enLabel': 'Module'
        },
      'ects': 5,
      'language':
        {
          'abbrev': 'de',
          'deLabel': 'Deutsch',
          'enLabel': 'german'
        },
      'duration': 1,
      'season':
        {
          'abbrev': 'ss',
          'deLabel': 'Sommersemester',
          'enLabel': 'summer term'
        },
      'location':
        {
          'abbrev': 'gm',
          'deLabel': 'Gummersbach',
          'enLabel': 'Gummersbach'
        },
      'status':
        {
          'abbrev': 'active',
          'deLabel': 'Aktiv',
          'enLabel': 'active'
        },
      'participants':
        [
          {
            'value':
              {
                'min': 0,
                'max': 10
              }
          }
        ],
      'module-relation':
        [
          {
            'value':
              {
                'kind': 'parent',
                'children':
                  [
                    'dca56fa6-1952-4b47-bf60-3dcb32e86ada'
                  ]
              }
          }
        ],
      'moduleCoordinator':
        {
          'id': 'cko',
          'lastname': 'Kohls',
          'firstname': 'Christian',
          'title': 'Prof. Dr.',
          'faculties':
            [
              {
                'abbrev': 'f10',
                'deLabel': 'Fakultät für Informatik und Ingenieurwissenschaften',
                'enLabel': 'Faculty of Computer Science and Engineering Science'
              }
            ],
          'abbreviation': 'CK',
          'status': 'active',
          'kind': 'single'
        },
      'lecturer':
        [
          {
            'value':
              {
                'id': 'ado',
                'lastname': 'Dobrynin',
                'firstname': 'Alexander',
                'title': 'M.Sc.',
                'faculties':
                  [
                    {
                      'abbrev': 'f10',
                      'deLabel': 'Fakultät für Informatik und Ingenieurwissenschaften',
                      'enLabel': 'Faculty of Computer Science and Engineering Science'
                    }
                  ],
                'abbreviation': 'AD',
                'status': 'active',
                'kind': 'single'
              }
          }
        ],
      'assessment-methods-mandatory':
        [
          {
            'value':
              {
                'method': 'written-exam',
                'precondition':
                  [
                    'practical'
                  ]
              }
          },
          {
            'value':
              {
                'method': 'oral-exams',
                'percentage': '50',
                'precondition':
                  [
                    'written-exam'
                  ]
              }
          }
        ],
      'assessment-methods-optional':
        [
          {
            'value':
              {
                'method': 'written-exam',
                'precondition':
                  []
              }
          }
        ],
      'workload-lecture': 36,
      'workload-seminar': 0,
      'workload-practical': 18,
      'workload-exercise': 18,
      'workload-projectWork': 0,
      'workload-projectSupervision': 0,
      'required-prerequisites-modules':
        [],
      'required-prerequisites-po':
        [],
      'recommended-prerequisites-text': 'Coden können, Spaß haben',
      'recommended-prerequisites-modules':
        [
          {
            'value':
              {
                'id': 'dca56fa6-1952-4b47-bf60-3dcb32e86ada',
                'title': 'Algorithmen und Programmierung 1',
                'abbrev': 'AP1'
              }
          },
          {
            'value':
              {
                'id': 'f1fd21a9-ab5c-40b0-ab09-3dff35e86a72',
                'title': 'Algorithmen und Programmierung 2',
                'abbrev': 'AP2'
              }
          }
        ],
      'recommended-prerequisites-po':
        [
          {
            'value':
              {
                'id': 'inf_wsc1',
                'label': 'Web Science PO 1 (M.Sc.)',
                'abbrev': 'inf_wsc PO 1 (M.Sc.)'
              }
          }
        ],
      'po-mandatory':
        [
          {
            'value':
              {
                'po': 'inf_mi4',
                'recommendedSemester':
                  [
                    3
                  ],
                'recommendedSemesterPartTime':
                  []
              }
          },
          {
            'value':
              {
                'po': 'inf_inf2',
                'recommendedSemester':
                  [
                    4
                  ],
                'recommendedSemesterPartTime':
                  []
              }
          },
          {
            'value':
              {
                'po': 'inf_inf1',
                'recommendedSemester':
                  [
                    3
                  ],
                'recommendedSemesterPartTime':
                  []
              }
          },
          {
            'value':
              {
                'po': 'inf_inf1_flex',
                'recommendedSemester':
                  [
                    3
                  ],
                'recommendedSemesterPartTime':
                  []
              }
          }
        ],
      'po-optional':
        [
          {
            'value':
              {
                'po': 'inf_wi4',
                'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
                'partOfCatalog': false,
                'recommendedSemester':
                  [
                    3,
                    4
                  ]
              }
          },
          {
            'value':
              {
                'po': 'inf_itm2',
                'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
                'partOfCatalog': false,
                'recommendedSemester':
                  [
                    3,
                    4
                  ]
              }
          },
          {
            'value':
              {
                'po': 'inf_wi5',
                'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
                'partOfCatalog': false,
                'recommendedSemester':
                  [
                    3,
                    4
                  ]
              }
          },
          {
            'value':
              {
                'po': 'inf_itm1',
                'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
                'partOfCatalog': false,
                'recommendedSemester':
                  [
                    3,
                    4
                  ]
              }
          }
        ],
      'competences':
        [
          {
            'value':
              {
                'abbrev': 'analyze_domains',
                'deLabel': 'Analyze Domains',
                'deDesc': 'Die Absolvent*innen sind in der Lage, Fachdomänen zu analysieren und Beziehungen von Entitäten und Konzepten sowohl innerhalb der Domäne wie auch zwischen Domänen aufzudecken. Dies ist eine wesentliche Voraussetzung für die Konzeption und Umsetzung digitaler Artefakte für ganz unterschiedliche gesellschaftliche und wirtschaftliche Bereiche.\nHierfür sind die Absolvent*innen in der Lage, sich selbstständig neue Methoden und neues Wissen anzueignen. Sie erkennen, welches Wissen in einer bestimmten Domäne für sie relevant ist, indem sie wissenschaftlich, analytisch und reflektiert arbeiten. Sie beherrschen Methoden zur Analyse von Domänen und ihren Fachsprachen, und können die Erkenntnisse formal präzise und gleichzeitig verständlich dokumentieren und kommunizieren.\n',
                'enLabel': 'Analyze Domains',
                'enDesc': 'Graduates are able to analyze subject domains and uncover relationships of entities and concepts both within and between domains. This is an essential prerequisite for the conception and implementation of digital artifacts for very different social and economic areas.\nFor this purpose, graduates are able to independently acquire new methods and new knowledge. They recognize what knowledge is relevant to them in a particular domain by working scientifically, analytically and reflectively. They are proficient in methods for analyzing domains and their specialized languages, and can document and communicate the findings in a formally precise and at the same time comprehensible manner.\n'
              }
          }
        ],
      'global-criteria':
        [],
      'taught-with':
        [
          {
            'value':
              {
                'id': 'c45bc346-61ae-446c-a98d-55abaef5729f',
                'title': 'Social Computing Projekt',
                'abbrev': 'SCP'
              }
          }
        ],
      'learning-outcome-content-de': 'a',
      'learning-outcome-content-en': 'b',
      'module-content-de': 'c',
      'module-content-en': 'd',
      'learning-methods-content-de': 'e',
      'learning-methods-content-en': 'f',
      'literature-content-de': 'g',
      'literature-content-en': 'h',
      'particularities-content-de': 'i',
      'particularities-content-en': 'j'
    }
    expect(parseModuleCompendium(input))
  })
})
