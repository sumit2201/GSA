import { Component, OnInit, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  [x: string]: any;
    //  @Input() progress;
  selectedFile: File;

  private file: File | null = null;

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
  }

  onFileChanged(event) {
    const file = event.target.files[0]
  }

  // onUpload() {
  //   // this.http is the injected HttpClient
  //   const uploadData = new FormData();
  //   uploadData.append('myFile', this.selectedFile, this.selectedFile.name);
  //   this.http.post('my-backend.com/file-upload', uploadData, {
  //     reportProgress: true,
  //     observe: 'events'
  //   })
  //     .subscribe(event => {
  //       console.log(event); // handle event here
  //     });
  // }


  constructor(private host: ElementRef<HTMLInputElement>) { }

  ngOnInit() {

  }

}
