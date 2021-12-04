import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Task } from './home.model';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  backgroundFile: File = {} as File;
  imagePreview: any;
  statuses: string[] = ['pending', 'done'];
  imageUrl: string = '';
  tasks: Task[] = []
  constructor(
    private storage: AngularFireStorage,
    private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTasks().subscribe(res => {
      console.log(res);
      this.tasks = res
    })
  }

  onFileClicked(event: any) {
    const reader = new FileReader();
    this.backgroundFile = event.target?.files[0];
    console.log(event, "BackgroundFile", this.backgroundFile);
    if (!this.backgroundFile.type.includes('image')) {
      (<HTMLInputElement>document.getElementById('file')).value = ''
      return alert('Only images are required')
    }
    // Creating the path for our image;
    let filePath = `Tasks/${this.backgroundFile.name}`;
    // Declare file path for our firebase console
    let fireStoragePath = this.storage.ref(filePath);
    // Uploading the image
    let uploadObs = this.storage.upload(filePath, this.backgroundFile);
    uploadObs.snapshotChanges().pipe(
      finalize(() => {
        fireStoragePath.getDownloadURL().subscribe(url => {
          this.imageUrl = url;
          console.log(this.imageUrl);
        })
      })
    ).subscribe();

    reader.readAsDataURL(this.backgroundFile);
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
  }
  onSubmit(form: NgForm) {
    console.log(form.value);
    const value: Task = {
      ...form.value,
      imageUrl: this.imageUrl,
      createdAt: Date.now(),
      time: Date.parse(form.value.time)
    }
    this.todoService.addTask(value)
    .then((res) => {
      console.log(res);
    })
    .catch(err => {

    })

  }
}
