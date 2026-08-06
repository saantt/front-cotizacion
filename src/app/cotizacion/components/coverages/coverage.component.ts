import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coverage } from '../../models/coverage.model';
import { CoverageService } from '../../services/coverage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})

export class CoverageComponent implements OnInit {

  /*==========================
    FORMULARIO Y VALIDACIONES
  ==========================*/
  showForm = false;
  form!: FormGroup;
  selectedRecord: Coverage | null = null;
  mode: 'view' | 'edit' | 'create' | null = null;

  closeForm() {
    this.showForm = false;
  }

  /*===========
    PAGINACIÓN
  ============*/
  pageSize = 7;
  currentPage = 1;
  paginatedCoverages: Coverage[] = [];
  pages: number[] = [];

  changePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedCoverages = this.coverages.slice(start, end);

    this.pages = Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.changePage();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.changePage();
    }
  }

  totalPages(): number {
    return Math.ceil(this.coverages.length / this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.changePage();
  }


  coverages: Coverage[] = [];

  constructor(
    private coverageService: CoverageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_cobertura: ['', Validators.required],
      nombre_cobertura: ['', Validators.required],
      tasa_publico: [null, [
        Validators.required,
        Validators.min(0.0000001)
      ]],
      tasa_particular: [null, [
        Validators.required,
        Validators.min(0.0000001)
      ]]
    });
    this.mode = 'create';
    this.listCoverages();
  }

  listCoverages(): void {
    this.coverageService.getAll().subscribe({
      next: (data: Coverage[]) => {
        this.coverages = data,
        this.changePage();
      },
      error: (err: any) => console.error('Error listing Coverages: ', err)
    });
  }

  newCoverage(): void {
    this.showForm = true;

    this.mode = 'create';
    this.selectedRecord = null;

    this.form.enable();
    this.form.get('id_cobertura')?.enable();

    this.form.reset({
      id_cobertura: '',
      tasa_publico: 0,
      tasa_particular: 0
    });
  }

  view(coverage: Coverage): void {
    this.showForm = true;
    this.mode = 'view';
    this.selectedRecord = coverage;
    this.form.patchValue(coverage);
    this.form.disable();
  }

  edit(coverage: Coverage): void {
    this.showForm = true;
    this.mode = 'edit';
    this.selectedRecord = coverage;
    this.form.enable();
    this.form.patchValue(coverage);
    this.form.get('id_cobertura')?.disable();
  }

  delete(coverage: Coverage): void {

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Desea eliminar la cobertura ${coverage.nombre_cobertura}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#6B7280'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coverageService.delete(coverage.id_cobertura).subscribe({
          next: () => {
            this.listCoverages();

            Swal.fire({
              title: 'Eliminado',
              text: 'La cobertura fue eliminada correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err: any) => {
            Swal.fire({
              title: 'Error',
              text: 'La cobertura no se elimino correctamente',
              icon: 'error',
              timer: 2000,
              showConfirmButton: false
            });
            console.error('Error deleting Coverage: ', err)
          }
        });
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.value;

    if (this.mode === 'create') {
      this.coverageService.create(request).subscribe({
        next: () => {
          this.listCoverages();
          this.clearForm();
          this.showForm = false;
          Swal.fire({
            title: 'Guardado',
            text: 'La cobertura fue guardada correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err: any) => console.error('Error creating Coverage: ', err)
      });
    } else if (this.mode === 'edit' && this.selectedRecord) {
      this.coverageService.update(this.selectedRecord.id_cobertura, request).subscribe({
        next: () => {
          this.listCoverages();
          this.clearForm();
          this.showForm = false;
          Swal.fire({
            title: 'Editado',
            text: 'La cobertura fue editada correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err: any) => console.error('Error updating Coverage: ', err)
      });
    }
  }

  clearForm(): void {
    this.form.reset({
      id_cobertura: '',
      nombre_cobertura: '',
      tasa_publico: 0,
      tasa_particular: 0
    });

    this.selectedRecord = null;

    this.form.get('id_cobertura')?.enable();
  }
}
