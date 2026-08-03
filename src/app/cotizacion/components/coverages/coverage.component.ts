import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Coverage } from '../../models/coverage.model';
import { CoverageService } from '../../services/coverage.service';

@Component({
  selector: 'coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.css']
})

export class CoverageComponent implements OnInit {

  coverages: Coverage[] = [];
  form!: FormGroup;

  mode: 'view' | 'edit' | 'create' | null = null;
  selectedRecord: Coverage | null = null;

  constructor(
    private coverageService: CoverageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_cobertura: [''],
      nombre_cobertura: [''],
      tasa_publico: [0],
      tasa_particular: [0]
    });
    this.mode = 'create';
    this.listCoverages();
  }

  listCoverages(): void {
    this.coverageService.getAll().subscribe({
      next: (data: Coverage[]) => this.coverages = data,
      error: (err: any) => console.error('Error listing Coverages: ', err)
    });
  }

  newCoverage(): void {
    this.mode = 'create';
    this.selectedRecord = null;

    this.form.get('id_cobertura')?.enable();

    this.form.reset({
      id_cobertura: '',
      tasa_publico: 0,
      tasa_particular: 0
    });
  }

  view(coverage: Coverage): void {
    this.mode = 'view';
    this.selectedRecord = coverage;
    this.form.patchValue(coverage);
    this.form.disable();
  }

  edit(coverage: Coverage): void {
    this.mode = 'edit';
    this.selectedRecord = coverage;
    this.form.enable();
    this.form.patchValue(coverage);
    this.form.get('id_cobertura')?.disable();
  }

  delete(coverage: Coverage): void {
    this.coverageService.delete(coverage.id_cobertura).subscribe({
      next: () => {
        this.listCoverages();
        this.clearForm();
      },
      error: (err: any) => console.error('Error deleting Coverage: ', err)
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
        },
        error: (err: any) => console.error('Error creating Coverage: ', err)
      });
    } else if (this.mode === 'edit' && this.selectedRecord) {
      this.coverageService.update(this.selectedRecord.id_cobertura, request).subscribe({
        next: () => {
          this.listCoverages();
          this.clearForm();
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
