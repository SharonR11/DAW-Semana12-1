import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  urlApi = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  uploadFile(formData: any){
    return this.http.post(`${this.urlApi}/subir`, formData);
  }


  getArchivos() {
    return this.http.get(`${this.urlApi}/archivos`);
  }

}
