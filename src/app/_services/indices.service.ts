import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import {environment} from '../../environments/environment';
import {Index} from "../_models";
import {map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class IndicesService {
  constructor(private http: HttpClient) { }


  save(index:Index) {
    return this.http.post<any>(`${environment.apiUrl}/indices`, { index})
      .pipe(map(index => {



        return index;
      }));
  }
  update(index:Index) {
    return this.http.patch<any>(`${environment.apiUrl}/indices/${index._id}`, { index})
      .pipe(map(index => {
        console.log("*********INDEX***********"+index.title);

        return index;
      }));
  }
  delete(index:Index) {
    return this.http.delete<any>(`${environment.apiUrl}/indices/${index._id}`)
      .pipe(map(index => {
        console.log("*********DELETE THIS INDEX***********"+index.title);

        return index;
      }));
  }
  getAll() {
    return this.http.get<Index[]>(`${environment.apiUrl}/indices`);
  }

}
