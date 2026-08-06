import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MarcaVehiculo } from '../models/marca-vehiculo.model';
import { PageResponse } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaVehiculoService {

  private readonly apiURL = 'http://localhost:9090/api/marcavehiculo';
  private marcasSubject = new BehaviorSubject<MarcaVehiculo[]>([]);
  marcas$ = this.marcasSubject.asObservable();

  constructor(private http: HttpClient) { }

  // =========================
  // CARGAR LISTA
  // =========================

  cargarMarcasVehiculo(): void {
    this.http.get<MarcaVehiculo[]>(this.apiURL)
      .subscribe({
        next: (lista) => this.marcasSubject.next(lista),
        error: err => console.error(err)
      });
  }

  // =========================
  // OBTENER POR ID
  // =========================

  obtenerMarcaVehiculoPorId(id_marca_vehiculo: number): Observable<MarcaVehiculo> {
    return this.http.get<MarcaVehiculo>(
      `${this.apiURL}/${id_marca_vehiculo}`
    );
  }

  // =========================
  // CREAR
  // =========================

  crearMarcaVehiculo(
    marca: MarcaVehiculo
  ): Observable<MarcaVehiculo> {
    return this.http.post<MarcaVehiculo>(
      this.apiURL,
      marca
    ).pipe(
      tap((nuevaMarca) => {
        const lista = this.marcasSubject.value;
        this.marcasSubject.next([
          ...lista,
          nuevaMarca
        ]);
      })
    );
  }

  // =========================
  // ACTUALIZAR
  // =========================

  actualizarMarcaVehiculo(
    id_marca_vehiculo: number,
    marca: MarcaVehiculo
  ): Observable<MarcaVehiculo> {
    return this.http.put<MarcaVehiculo>(
      `${this.apiURL}/${id_marca_vehiculo}`,
      marca
    ).pipe(
      tap((marcaActualizada) => {
        const lista = this.marcasSubject.value.map(item =>
          item.id_marca_vehiculo === id_marca_vehiculo
            ? marcaActualizada
            : item
        );
        this.marcasSubject.next(lista);
      })
    );
  }

  // =========================
  // ELIMINAR
  // =========================

  eliminarMarcaVehiculo(
    id_marca_vehiculo: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiURL}/${id_marca_vehiculo}`
    ).pipe(
      tap(() => {
        const lista = this.marcasSubject.value.filter(
          item => item.id_marca_vehiculo !== id_marca_vehiculo
        );
        this.marcasSubject.next(lista);
      })
    );
  }

  // =========================
  // BUSCAR POR NOMBRE
  // =========================

  obtenerMarcaPorNombre(nombre_marca_vehiculo: string): Observable<MarcaVehiculo> {
    return this.http.get<MarcaVehiculo>(
      `${this.apiURL}/nombre/${nombre_marca_vehiculo}`
    );
  }

  // =========================
  // BUSCAR POR PAÍS
  // =========================

  obtenerMarcasPorPais(
    pais_origen_vehiculo: string
  ): Observable<MarcaVehiculo[]> {
    return this.http.get<MarcaVehiculo[]>(
      `${this.apiURL}/pais/${pais_origen_vehiculo}`
    );
  }

  // =========================
  // BUSCAR POR ABREVIATURA
  // =========================

  obtenerMarcaPorAbreviatura(
    abreviatura_vehiculo: string
  ): Observable<MarcaVehiculo> {
    return this.http.get<MarcaVehiculo>(
      `${this.apiURL}/abreviatura/${abreviatura_vehiculo}`
    );
  }

  // =========================
  // VALIDAR EXISTENCIA
  // =========================

  validarExistenciaMarca(
    nombre_marca_vehiculo: string
  ): Observable<string> {
    return this.http.get(
      `${this.apiURL}/existe/${nombre_marca_vehiculo}`,
      {
        responseType: 'text'
      }
    );
  }

  obtenerPagina(
    page: number,
    size: number
  ): Observable<PageResponse<MarcaVehiculo>> {

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<MarcaVehiculo>>(
      `${this.apiURL}/page`,
      { params }
    );
  }

}