import { Component, effect, inject, OnInit } from '@angular/core'
import { StudyProgram } from '../../types/module-compendium'
import { MatTableDataSource } from '@angular/material/table'
import { PreviewStore } from './preview-store'
import { HttpService } from '../../http/http.service'

interface TableData {
  studyProgram: StudyProgram
  canPreviewModuleCatalog: boolean
  canPreviewExamLists: boolean
}

@Component({
  selector: 'cops-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.css'],
  providers: [PreviewStore],
  standalone: false,
})
export class PreviewPageComponent implements OnInit {
  protected readonly store = inject(PreviewStore)
  protected readonly dataSource = new MatTableDataSource<TableData>()
  protected readonly displayedColumns: string[] = [
    'study_program',
    'po',
    'action',
  ]
  protected readonly spinnerDiameter = 30

  protected poToPreview: string | undefined
  protected moduleCatalogUpdateInProcess = false
  protected examListUpdateInProcess = false

  constructor(private readonly http: HttpService) {
    effect(() => {
      const data = this.store.privileges()
      this.dataSource.data = data.map((d) => ({
        studyProgram: d.studyProgram,
        canPreviewModuleCatalog: d.roles.some(
          (r) => r.id === 'sgl' || r.id === 'pav',
        ),
        canPreviewExamLists: d.roles.some((r) => r.id === 'pav'),
      }))
    })
  }

  ngOnInit() {
    this.store.load()
  }

  getPoId(studyProgram: StudyProgram) {
    return studyProgram.specialization?.id ?? studyProgram.po.id
  }

  createModuleCatalogPreview({ studyProgram }: TableData) {
    const studyProgramId = studyProgram.id
    const poId = this.getPoId(studyProgram)
    this.moduleCatalogUpdateInProcess = true
    this.poToPreview = poId
    const tab = window.open()
    tab?.document.write($localize`Modulhandbuch wird geladen...`)

    this.http.getModuleCatalogPreview(studyProgramId, poId).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob)
        tab?.location?.assign(fileURL)
      },
      error: () => {
        tab?.close()
        this.moduleCatalogUpdateInProcess = false
        this.poToPreview = undefined
      },
      complete: () => {
        this.moduleCatalogUpdateInProcess = false
        this.poToPreview = undefined
      },
    })
  }

  createExamListPreview({ studyProgram }: TableData) {
    const studyProgramId = studyProgram.id
    const poId = this.getPoId(studyProgram)
    this.examListUpdateInProcess = true
    this.poToPreview = poId
    const tab = window.open()
    tab?.document.write($localize`Prüfungsliste wird geladen...`)

    this.http.getExamListsPreview(studyProgramId, poId).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob)
        tab?.location?.assign(fileURL)
      },
      error: () => {
        tab?.close()
        this.examListUpdateInProcess = false
        this.poToPreview = undefined
      },
      complete: () => {
        this.examListUpdateInProcess = false
        this.poToPreview = undefined
      },
    })
  }
}
