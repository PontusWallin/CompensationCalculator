import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  private redGradient = 'linear-gradient(90deg, #911812 0%, #E1261C 100%)'
  private greyGradient = 'linear-gradient(90deg, #D3DAE8 0%, #A7B7D8 100%)'

  @Input()
  public content = ""
  @Input()
  public listLevel = 1

  public dashColor = ''

  constructor() { }

  ngOnInit(): void {}

  public getDashColor() {

    if(this.listLevel == 1) {
      this.dashColor = this.redGradient
    } else {
      this.dashColor = this.greyGradient
    }
    return this.dashColor
  }

}
