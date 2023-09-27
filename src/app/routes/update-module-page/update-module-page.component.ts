import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'


@Component({
  selector: 'cops-update-module-page',
  templateUrl: './update-module-page.component.html',
  styleUrls: ['./update-module-page.component.css'],
})
export class UpdateModulePageComponent {
  id: string | null = null

  versions = [
    {title: 'Current changes', index: 6, status: 'draft'},
    {title: '22.06.2023', index: 5, status: 'currently published'},
    {title: '01.03.2023', index: 4, status: 'past'},
    {title: '11.02.2022', index: 3, status: 'past'},
    {title: '10.02.2021', index: 2, status: 'past'},
    {title: '03.03.2021', index: 1, status: 'past'},
  ]

  test = ['1', '2', '3']

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id')
  }
}
