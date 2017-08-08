import { Observable } from 'rxjs/Observable'

export class ChecklistModel {

  checklist: any; //observable
  checklistObserver: any;
  dateTime: number = Date.now();
  progress: string = "0/0";

  constructor( public title: string, public items: any[]){

    this.checklist = Observable.create( Observer=> {

      this.checklistObserver = Observer;
    });
  }

  addItem( itemTitle ): void {

    this.items.push({
      title: itemTitle,
      checked: false,
      note: ""
    });

    this.checklistObserver.next(true);
  }

  removeItem( item ): void {

    let index = this.items.indexOf(item);

    if (index > -1) {

      this.items.splice(index, 1);
    }

    this.checklistObserver.next(true);
  }

  renameItem( item, title ): void {

    let index = this.items.indexOf( item );

    if( index > -1 ) {

      this.items[index].title = title;
    }

    this.checklistObserver.next(true);

  }

  setTitle( title ): void {

    this.title = title;

    this.checklistObserver.next(true);
  }

  toggleItem( item ): void {

    item.checked = !item.checked;

    this.checklistObserver.next(true);
  }

  checklistUpdates(): Observable<any> {

    return this.checklist;
  }

  setDateTime( dateTime ): void {

    this.dateTime = dateTime;
  }

  setProgress( progress ): void {

    this.progress = progress;
  }

  setNote( item, note ): void {

    let index = this.items.indexOf( item );

    if( index > -1 ) {

      this.items[index].note = note;
    }

    this.checklistObserver.next(true);

  }

}
