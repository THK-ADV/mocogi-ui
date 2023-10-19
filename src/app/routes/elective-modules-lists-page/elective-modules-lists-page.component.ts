import { Component } from '@angular/core'
import {  ElectiveModulesList } from '../../components/modules/elective-modules-lists-list/elective-modules-lists-list.component'

@Component({
  selector: 'cops-elective-modules-lists-page',
  templateUrl: './elective-modules-lists-page.component.html',
  styleUrls: ['./elective-modules-lists-page.component.css'],
})
export class ElectiveModulesListsPageComponent {
  electiveModulesLists: ReadonlyArray<ElectiveModulesList> = [
    {
      title: 'WPF Liste',
      semester: 'SoSe 2021',
      studyProgram: 'Medieninformatik (Bachelor)',
      po: 'PO 6',
      germanDownloadLink: 'http://www.medieninformatik.th-koeln.de/download/modulbeschreibungen-bachelor-bpo4.pdf',
      englishDownloadLink: '',
    },
    {
      title: 'WPF Liste',
      semester: 'SoSe 2021',
      studyProgram: 'Wirtschaftsinformatik (Bachelor)',
      po: 'PO 6',
      germanDownloadLink: 'http://www.medieninformatik.th-koeln.de/download/modulbeschreibungen-bachelor-bpo4.pdf',
      englishDownloadLink: '',
    },
    {
      title: 'WPF Liste',
      semester: 'SoSe 2021',
      studyProgram: 'Allgemeine Informatik (Bachelor)',
      po: 'PO 6',
      germanDownloadLink: 'http://www.medieninformatik.th-koeln.de/download/modulbeschreibungen-bachelor-bpo4.pdf',
      englishDownloadLink: '',
    },
    {
      title: 'WPF Liste',
      semester: 'SoSe 2021',
      studyProgram: 'Allgemeine Informatik (Bachelor)',
      po: 'PO 5',
      germanDownloadLink: 'http://www.medieninformatik.th-koeln.de/download/modulbeschreibungen-bachelor-bpo4.pdf',
      englishDownloadLink: '',
    },
    {
      title: 'WPF Liste',
      semester: 'SoSe 2021',
      studyProgram: 'Allgemeine Informatik (Master)',
      po: 'PO 6',
      germanDownloadLink: 'http://www.medieninformatik.th-koeln.de/download/modulbeschreibungen-bachelor-bpo4.pdf',
      englishDownloadLink: '',
    },
  ]
}
