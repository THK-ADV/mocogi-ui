import {
  asRecord,
  parseAbbreviation,
  parseDuration,
  parseECTS,
  parseLanguage, parseLecturers,
  parseLocation, parseModuleManagement,
  parseModuleRelation,
  parseModuleType,
  parseParticipants,
  parseSeason,
  parseStatus,
  parseString,
  parseTitle,
  parseWorkload
} from './metadata-protocol-factory'
import { WorkloadProtocol } from './workload'
import { Participants } from './participants'
import { ModuleRelation, Parent } from './module-relation'

describe('metadata protocol factory', () => {
  const input__: unknown = {
    'title': 'Paradigmen der Programmierung',
    'abbreviation': 'PP',
    'moduleType': {'abbrev': 'module', 'deLabel': 'Modul', 'enLabel': 'Module'},
    'ects': 5,
    'language': {'abbrev': 'de', 'deLabel': 'Deutsch', 'enLabel': 'german'},
    'duration': 1,
    'season': {'abbrev': 'ss', 'deLabel': 'Sommersemester', 'enLabel': 'summer term'},
    'location': {'abbrev': 'gm', 'deLabel': 'Gummersbach', 'enLabel': 'Gummersbach'},
    'status': {'abbrev': 'active', 'deLabel': 'Aktiv', 'enLabel': 'active'},
    'participants': [],
    'module-relation': [],
    'moduleCoordinator': {
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
    },
    'lecturer': [{
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
    }],
    'assessment-methods-mandatory': [{'value': {'method': 'written-exam', 'percentage': null, 'precondition': ['practical']}}],
    'assessment-methods-optional': [{'value': {'method': 'written-exam', 'percentage': null, 'precondition': []}}],
    'workload-lecture': 36,
    'workload-seminar': 0,
    'workload-practical': 18,
    'workload-exercise': 18,
    'workload-projectWork': 0,
    'workload-projectSupervision': 0,
    'required-prerequisites-text': '',
    'required-prerequisites-modules': [],
    'required-prerequisites-po': [],
    'recommended-prerequisites-text': 'Coden können, Spaß haben',
    'recommended-prerequisites-modules': [{
      'value': {
        'id': 'dca56fa6-1952-4b47-bf60-3dcb32e86ada',
        'title': 'Algorithmen und Programmierung 1',
        'abbrev': 'AP1'
      }
    }, {'value': {'id': 'f1fd21a9-ab5c-40b0-ab09-3dff35e86a72', 'title': 'Algorithmen und Programmierung 2', 'abbrev': 'AP2'}}],
    'recommended-prerequisites-po': [],
    'po-mandatory': [{
      'value': {
        'po': 'inf_mi4',
        'recommendedSemester': [3],
        'recommendedSemesterPartTime': []
      }
    }, {'value': {'po': 'inf_inf2', 'recommendedSemester': [4], 'recommendedSemesterPartTime': []}}, {
      'value': {
        'po': 'inf_inf1',
        'recommendedSemester': [3],
        'recommendedSemesterPartTime': []
      }
    }, {'value': {'po': 'inf_inf1_flex', 'recommendedSemester': [3], 'recommendedSemesterPartTime': []}}],
    'po-optional': [{
      'value': {
        'po': 'inf_wi4',
        'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
        'partOfCatalog': false,
        'recommendedSemester': [3, 4]
      }
    }, {
      'value': {
        'po': 'inf_itm2',
        'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
        'partOfCatalog': false,
        'recommendedSemester': [3, 4]
      }
    }, {
      'value': {
        'po': 'inf_wi5',
        'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
        'partOfCatalog': false,
        'recommendedSemester': [3, 4]
      }
    }, {
      'value': {
        'po': 'inf_itm1',
        'instanceOf': 'aacd9661-dba7-40e5-b98d-4e7019e18365',
        'partOfCatalog': false,
        'recommendedSemester': [3, 4]
      }
    }],
    'competences': [],
    'global-criteria': [],
    'taught-with': [],
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
    expect(parseParticipants({'participants': {'value': {'min': 0, 'max': 10}}}))
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
    expect(parseModuleRelation({'module-relation': parent}))
      .toEqual(parent.value)
    expect(parseModuleRelation({'module-relation': child}))
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
  })
})
