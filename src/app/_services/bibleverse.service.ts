
import {environment} from '../../environments/environment';
import {Index, Redirect, Scripture} from "../_models";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class BibleService {
  constructor(private http: HttpClient) { }


  getVerse(verse:string) {

    return this.http.get<string>(`${environment.apiUrl}/fixes/verse/${verse}`)

  }


}
