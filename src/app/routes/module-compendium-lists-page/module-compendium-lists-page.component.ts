import { Component } from '@angular/core'
import {  ModuleCompendiumList } from '../../components/modules/module-compendium-lists-list/module-compendium-lists-list.component'

@Component({
  selector: 'cops-module-compendium-lists-page',
  templateUrl: './module-compendium-lists-page.component.html',
  styleUrls: ['./module-compendium-lists-page.component.css'],
})
export class ModuleCompendiumListsPageComponent {
  moduleCompendiumLists: ReadonlyArray<ModuleCompendiumList> = [
    {
      title: 'Modulhandbuch',
      semester: 'SoSe 2021',
      studyProgram: 'Medieninformatik (Bachelor)',
      po: 'PO 6',
      germanDownloadLink: '',
      englishDownloadLink: '',
    },
    {
      title: 'Modulhandbuch',
      semester: 'SoSe 2021',
      studyProgram: 'Wirtschaftsinformatik (Bachelor)',
      po: 'PO 6',
      germanDownloadLink: '',
      englishDownloadLink: '',
    },
    {
      title: 'Modulhandbuch',
      semester: 'SoSe 2021',
      studyProgram: 'Allgemeine Informatik (Bachelor)',
      po: 'PO 6',
      germanDownloadLink: '',
      englishDownloadLink: '',
    },
    {
      title: 'Modulhandbuch',
      semester: 'SoSe 2021',
      studyProgram: 'Allgemeine Informatik (Bachelor)',
      po: 'PO 5',
      germanDownloadLink: '',
      englishDownloadLink: '',
    },
    {
      title: 'Modulhandbuch',
      semester: 'SoSe 2021',
      studyProgram: 'Allgemeine Informatik (Master)',
      po: 'PO 6',
      germanDownloadLink: '',
      englishDownloadLink: '',
    },
  ]
}
