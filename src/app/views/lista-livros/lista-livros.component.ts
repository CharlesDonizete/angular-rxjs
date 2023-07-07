import { FormControl } from '@angular/forms';
import { Item, Livro, LivrosResultado } from './../../models/interfaces';
import { Component } from '@angular/core';
import {
  EMPTY,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 500;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;
  listaLivros: Livro[];

  constructor(private service: LivroService) {}

  // totalDeLivros$ = this.campoBusca.valueChanges.pipe(
  //   debounceTime(PAUSA),
  //   filter((valorDigitado) => valorDigitado.length >= 3),
  //   tap(() => console.log('Fluxo inicial')),
  //   distinctUntilChanged(),
  //   switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //   map((resultado) => (this.livrosResultado = resultado)),
  //   catchError((erro) => {
  //     console.log(erro);
  //     return of();
  //   })
  // );

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    tap(() => console.log('Fluxo inicial')),
    filter((valorDigitado) => valorDigitado.length >= 3),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap((retornoAPI) => console.log(retornoAPI)),
    map((resultado) => (this.livrosResultado = resultado)),
    map((resultado) => resultado.items ?? []),
    map((items) => (this.listaLivros = this.livrosResultadoParaLivros(items))),
    catchError((erro) => {
      // this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação';
      // return EMPTY;
      console.log(erro);
      return throwError(
        () =>
          new Error(
            (this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação')
          )
      );
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
