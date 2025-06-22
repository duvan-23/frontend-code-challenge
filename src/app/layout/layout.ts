import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
