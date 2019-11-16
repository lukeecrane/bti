import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ping',
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.css']
})
export class PingComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  public ping() {

    this.http.get('http://localhost:3000/api/v1/users/login')
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );
  }

}
