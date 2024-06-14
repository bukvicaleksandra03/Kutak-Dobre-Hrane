import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Layout } from 'src/app/models/layout';
import { Restaurant } from 'src/app/models/restaurant';
import * as lf from 'src/app/layoutFuncs';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
  selector: 'app-new-restaurant',
  templateUrl: './new-restaurant.component.html',
  styleUrls: ['./new-restaurant.component.css'],
})
export class NewRestaurantComponent {
  message: string = '';
  messageCanvas: string =
    'Choose which element to add to the canvas by clicking on buttons.';
  messageCanvasError: string = '';

  newRestaurant: Restaurant = new Restaurant();

  layoutEnteringType: string = 'canvas';
  currentlyAdding: string = '';
  myCanvas: HTMLCanvasElement;
  layoutCanvas: Layout = new Layout();
  layoutFile: File;
  layoutJson: Layout = new Layout();
  peopleAtTable: number = 0;

  @ViewChild('canvasElement') canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private router: Router, private servis: RestaurantsService) {}

  changeCurrentlyAdding(elemName: string) {
    if (elemName == 'kitchen') {
      this.currentlyAdding = 'kitchen';
      this.messageCanvas = 'Select where to place kitchen.';
    } else if (elemName == 'toilet') {
      this.currentlyAdding = 'toilet';
      this.messageCanvas = 'Select where to place toilet.';
    } else if (elemName == 'table') {
      this.currentlyAdding = 'table';
      this.messageCanvas = 'Select where to place table.';
    } else if (elemName == 'removing') {
      this.currentlyAdding = 'removing';
      this.messageCanvas =
        'Remove an element from the canvas by clicking on it.';
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    this.myCanvas = canvas;

    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    if (ctx) {
      lf.drawDrawingSpaceBorders(ctx);
      lf.writeRestaurantName(ctx, 'Restaurant');
    } else {
      console.error('Unable to get 2D context');
    }
  }

  handleMouseDown(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const ctx = this.myCanvas.getContext('2d');
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!(x <= 20 || x >= 580 || y <= 80 || y >= 340)) {
      lf.clearDrawingSpace(ctx);
      if (
        this.currentlyAdding == 'kitchen' &&
        lf.canAddKitchen(this.layoutCanvas, x, y)
      ) {
        lf.addKitchenToLayout(this.layoutCanvas, x, y);
      } else if (
        this.currentlyAdding == 'toilet' &&
        lf.canAddToilet(this.layoutCanvas, x, y)
      ) {
        lf.addToiletToLayout(this.layoutCanvas, x, y);
      } else if (
        this.currentlyAdding == 'table' &&
        lf.canAddTable(this.layoutCanvas, x, y)
      ) {
        lf.addTableToLayout(this.layoutCanvas, x, y, this.peopleAtTable);
      } else if (this.currentlyAdding == 'removing') {
        lf.removeElem(this.layoutCanvas, x, y);
      }

      lf.drawAll(this.layoutCanvas, ctx);
    } else {
      this.messageCanvasError = 'Clicked outside the allowed limits';
    }
  }

  handleMouseMove(event: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const ctx = this.myCanvas.getContext('2d');

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (lf.mouseInDrawingSpace(x, y)) {
      lf.clearMessageAboveDrawingSpace(ctx);

      if (this.currentlyAdding == 'kitchen') {
        if (lf.canAddKitchen(this.layoutCanvas, x, y)) {
          lf.writeMessageAboveDrawingSpace(
            ctx,
            'green',
            'Can add kitchen here'
          );
        } else {
          lf.writeMessageAboveDrawingSpace(
            ctx,
            'red',
            'Can not add kitchen here'
          );
        }
      } else if (this.currentlyAdding == 'toilet') {
        if (lf.canAddToilet(this.layoutCanvas, x, y)) {
          lf.writeMessageAboveDrawingSpace(ctx, 'green', 'Can add toilet here');
        } else {
          lf.writeMessageAboveDrawingSpace(
            ctx,
            'red',
            'Can not add toilet here'
          );
        }
      } else if (this.currentlyAdding == 'table') {
        if (lf.canAddTable(this.layoutCanvas, x, y)) {
          lf.writeMessageAboveDrawingSpace(ctx, 'green', 'Can add table here');
        } else {
          lf.writeMessageAboveDrawingSpace(
            ctx,
            'red',
            'Can not add table here'
          );
        }
      }
    }
  }

  addRestaurantToDB() {
    this.newRestaurant.average_rating = -1;
    if (this.layoutEnteringType === 'canvas') {
      if (this.layoutCanvas.kitchens.length === 0) {
        this.message = 'The restaurant must have at least one kitchen';
        return;
      } else if (this.layoutCanvas.toilets.length === 0) {
        this.message = 'The restaurant must have at least one toilet';
        return;
      } else if (this.layoutCanvas.tables.length < 3) {
        this.message = 'The restaurant must have at least three';
        return;
      } else {
        this.newRestaurant.layout = this.layoutCanvas;
      }
    } else if (this.layoutEnteringType === 'json') {
      if (this.layoutJson != null) {
        this.newRestaurant.layout = this.layoutJson;
        console.log(this.newRestaurant.layout);
      } else {
        this.message =
          'You must choose a json file to specify the layout of the restaurant';
      }
    } else {
      this.message = 'You must enter a layout for the restaurant.';
    }

    if (this.checkAllFields(this.newRestaurant) == false) return;
    if (this.checkContactPerson(this.newRestaurant.contact_person) == false)
      return;

    this.servis.addNew(this.newRestaurant).subscribe((resp) => {
      if (resp['message'] == 'ok') {
        alert('Successfully added restaurant.');
        this.router.navigate(['admin/all-restaurants']);
      } else alert(resp['message']);
    });
  }

  getFile(event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          try {
            const jsonContent = JSON.parse(result);
            this.layoutJson = jsonContent;
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          console.error('FileReader result is not a string.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid JSON file.');
    }
  }

  checkAllFields(restaurant: Restaurant) {
    if (restaurant.name == null || restaurant.name == '') {
      this.message = 'You must enter a name';
      return false;
    } else if (restaurant.type == null || restaurant.type == '') {
      this.message = 'You must enter a type';
      return false;
    } else if (restaurant.address == null || restaurant.address == '') {
      this.message = 'You must enter the restaurants address';
      return false;
    } else if (
      restaurant.short_description == null ||
      restaurant.short_description == ''
    ) {
      this.message = 'You must enter a short description';
      return false;
    } else if (
      restaurant.contact_person == null ||
      restaurant.contact_person == ''
    ) {
      this.message = 'You must enter a phone number of the contact person';
      return false;
    } else if (
      restaurant.working_time_start == null ||
      restaurant.working_time_start == ''
    ) {
      this.message = 'You must enter working hours';
      return false;
    } else if (
      restaurant.working_time_end == null ||
      restaurant.working_time_end == ''
    ) {
      this.message = 'You must enter working hours';
      return false;
    }

    return true;
  }

  checkContactPerson(phone: string) {
    let phone_regex = /^\+\d{7,14}$/;
    if (!phone_regex.test(phone)) {
      this.message = 'Enter phone number with area code. Example: +38163290175';
      return false;
    }
    return true;
  }
}
