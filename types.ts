
export enum PovertyStatus {
  MISKIN = 'Miskin',
  RENTAN_MISKIN = 'Rentan Miskin',
  TIDAK_MISKIN = 'Tidak Miskin'
}

export interface Citizen {
  id: string;
  name: string;
  nik: string;
  gender: 'Laki-laki' | 'Perempuan';
  income: number;
  dependents: number;
  houseType: 'Permanen' | 'Semi-Permanen' | 'Kayu/Bambu';
  floorType: 'Ubin' | 'Semen' | 'Tanah';
  occupation: string;
  healthIssues: boolean;
  status: PovertyStatus;
  classificationReason: string;
  year: number;
}

export interface DashboardStats {
  totalCitizens: number;
  poorCount: number;
  nearPoorCount: number;
  nonPoorCount: number;
}
