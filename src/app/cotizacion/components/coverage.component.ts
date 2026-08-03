import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coverage } from '../models/coverage.model';
import { CoverageService } from '../services/coverage.service';

@Component({
  selector: 'coverage',
  templateUrl: './coverage.component.html'
})

export class CoverageComponent implements OnInit {

  coverages: Coverage[] = [];
  form!: FormGroup;

  mode: 'view' | 'edit' | 'create' | null = null;
  selectedRecord: Coverage | null = null;

  constructor(
    private fb: FormBuilder,
    private coverageService: CoverageService
  ) {}

  ngOnInit(): void {
    this.listCoverages();
  }

  listCoverages(): void {
    this.coverageService.getAll().subscribe({
      next: (data: Coverage[]) => this.coverage = data,
      error: (err: any) => console.error('Error listing Coverages: ', err)
    });
  }

  new(): void {
    this.mode = 'create';
    this.selectedRecord = null;
    this.form.reset({ tasa_publico: 0, tasa_particular: 0 });
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
  }

  delete(coverage: Coverage): void {
    this.coverageService.delete(coverage.id_coverage).subscribe({
      next: () => this.listCoverages(),
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
          this.cancel();
        },
        error: (err: any) => console.error('Error creating Coverage: ', err)
      });
    } else if (this.mode === 'edit' && this.selectedRecord) {
      this.deducibleService.update(this.selectedRecord.id_coverage, request).subscribe({
        next: () => {
          this.listCoverages();
          this.cancel();
        },
        error: (err: any) => console.error('Error updating Coverage: ', err)
      });
    }
  }

  cancel(): void {
    this.mode = null;
    this.selectedRecord = null;
    this.form.reset({ tasa_publico: 0, tasa_particular: 0 });
    this.form.enable();
  }
}