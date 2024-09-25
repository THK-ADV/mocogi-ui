import { Component, OnInit } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { StudyProgram } from '../../types/module-compendium'
import { Role } from '../../types/approval'
import { MatTableDataSource } from '@angular/material/table'
import { Ordering } from '../../ops/ordering'
import { numberOrd, stringOrd } from '../../ops/ordering.instances'

interface StudyProgramPrivileges {
  studyProgram: StudyProgram
  roles: Role[]
}

@Component({
  selector: 'cops-module-catalog-preview-page',
  templateUrl: './module-catalog-preview-page.component.html',
  styleUrls: ['./module-catalog-preview-page.component.css'],
})
export class ModuleCatalogPreviewPageComponent implements OnInit {
  protected dataSource = new MatTableDataSource<StudyProgramPrivileges>()
  protected displayedColumns: string[] = ['study_program', 'po', 'action']

  protected poToPreview: string | undefined
  protected updateInProcess = false
  protected spinnerDiameter = 30

  private ord = Ordering.many<StudyProgramPrivileges>([
    Ordering.contraMap(stringOrd, (p) => p.studyProgram.id),
    Ordering.contraMap(stringOrd, (p) => p.studyProgram.degree.id),
    Ordering.contraMap(numberOrd, (p) => p.studyProgram.po.version),
  ])

  constructor(private readonly http: HttpService) {}

  ngOnInit() {
    this.http.getPersonalData().subscribe((res) => {
      if ('privileges' in res) {
        const data = res['privileges'] as StudyProgramPrivileges[]
        data.sort(this.ord)
        this.dataSource.data = data
      }
    })
  }

  getPoId(studyProgram: StudyProgram) {
    return studyProgram.specialization?.id ?? studyProgram.po.id
  }

  createPreview({ studyProgram }: StudyProgramPrivileges) {
    const studyProgramId = studyProgram.id
    const poId = this.getPoId(studyProgram)
    this.updateInProcess = true
    this.poToPreview = poId
    this.http.getPreview(studyProgramId, poId).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob)
        window.open(fileURL, '_blank')
      },
      error: () => {
        this.updateInProcess = false
        this.poToPreview = undefined
      },
      complete: () => {
        this.updateInProcess = false
        this.poToPreview = undefined
      },
    })
  }
}
