import { Component,OnInit } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import { HttpClient } from '@angular/common/http';
import {Archivo} from 'src/app/models/archivo'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit{

  uploadFiles: File[] = [];

  archivos: string[] = [];
  constructor(private uploadService: UploadService, private http:HttpClient){

  }

  ngOnInit() {
    this.fetchFiles();
  }

  onUpload(){
    //console.log('Upload');
    let formData = new FormData();
    for(let i = 0; i < this.uploadFiles.length; i++){
      formData.append("uploads[]", this.uploadFiles[i], this.uploadFiles[i].name)
      console.log('Archivos seleccionados:', this.uploadFiles);
    }
    // Call Service Upload
    this.uploadService.uploadFile(formData).subscribe((res) => {
      console.log('Response:', res);
    });
  }//envia el archivo por el metodo post, 

  onFileChange(event: any){
    //console.log(e);
    console.log('Evento de cambio de archivo:', event);
    this.uploadFiles = event.target.files;
  }
  //destino de los archivos - target

  fetchFiles() {
    this.uploadService.getArchivos().subscribe(
      (data: any) => { // Modifica el tipo de datos esperados aquí
        this.archivos = data.map((item: any) => item.nombre_archivo);
        console.log('Archivos obtenidos:', this.archivos);
      },
      error => {
        console.error('Error al obtener archivos:', error);
      }
    );
  }
}
