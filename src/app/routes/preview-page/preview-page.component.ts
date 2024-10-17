import { Component, OnInit } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { StudyProgram } from '../../types/module-compendium'
import { MatTableDataSource } from '@angular/material/table'
import { Ordering } from '../../ops/ordering'
import { numberOrd, stringOrd } from '../../ops/ordering.instances'

interface TableData {
  studyProgram: StudyProgram
  canPreviewModuleCatalog: boolean
  canPreviewExamLists: boolean
}

@Component({
  selector: 'cops-preview-page',
  templateUrl: './preview-page.component.html',
  styleUrls: ['./preview-page.component.css'],
})
export class PreviewPageComponent implements OnInit {
  protected dataSource = new MatTableDataSource<TableData>()
  protected displayedColumns: string[] = ['study_program', 'po', 'action']

  protected poToPreview: string | undefined
  protected moduleCatalogUpdateInProcess = false
  protected examListUpdateInProcess = false
  protected spinnerDiameter = 30

  private ord = Ordering.many<TableData>([
    Ordering.contraMap(stringOrd, (p) => p.studyProgram.id),
    Ordering.contraMap(stringOrd, (p) => p.studyProgram.degree.id),
    Ordering.contraMap(numberOrd, (p) => p.studyProgram.po.version),
  ])

  constructor(private readonly http: HttpService) {}

  ngOnInit() {
    this.http.getPersonalData().subscribe((res) => {
      const data: TableData[] = res.privileges.map((p) => ({
        studyProgram: p.studyProgram,
        canPreviewModuleCatalog: p.roles.some(
          (r) => r.id === 'sgl' || r.id === 'pav',
        ),
        canPreviewExamLists: p.roles.some((r) => r.id === 'pav'),
      }))
      data.sort(this.ord)
      this.dataSource.data = data
    })
  }

  getPoId(studyProgram: StudyProgram) {
    return studyProgram.specialization?.id ?? studyProgram.po.id
  }

  createModuleCatalogPreview({ studyProgram }: TableData) {
    const studyProgramId = studyProgram.id
    const poId = this.getPoId(studyProgram)
    this.moduleCatalogUpdateInProcess = true
    this.poToPreview = poId
    this.http.getModuleCatalogPreview(studyProgramId, poId).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob)
        window.open(fileURL, '_blank')
      },
      error: () => {
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
    this.http.getExamListsPreview(studyProgramId, poId).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob)
        window.open(fileURL, '_blank')
      },
      error: () => {
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
