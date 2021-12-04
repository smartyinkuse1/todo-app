import { Injectable } from '@angular/core';
import { Task } from './home/home.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private firestore: AngularFirestore) { }

  addTask(value: Task) {
    return this.firestore.collection('task').add(value);
  }
  getTasks(): Observable<Task[]> {
    return this.firestore.collection<Task>('task').valueChanges()
  }
}
