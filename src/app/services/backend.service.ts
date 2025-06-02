import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map } from 'rxjs';

interface User {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
}

interface SalesData {
  parts: Array<{ name: string; quantity: number }>;
  sellers: Array<{ name: string; sales: number }>;
  monthlySales: Array<{ month: string; total: number }>;
}

interface ApiResponse {
  users: User[];
  sales: SalesData;
  salesRecords: SaleRecord[];
  categories: Category[];
  employees: Employee[]; // Add employees
}

export interface VehiclePart {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  location: string;
  concessionaire: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface SaleRecord {
  date: string;
  totalSales: number;
  concessionaire: string;
}

export interface Category {
  id: number;
  name: string;
  status: boolean;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  concessionaire: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly API_URL = 'users.json';

  constructor(private readonly http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.get<{ users: User[] }>(this.API_URL).pipe(
      delay(1000),
      map(data => {
        const user = data.users.find(u =>
          u.email === credentials.email &&
          u.password === credentials.password
        );

        return {
          success: !!user,
          message: user ? 'Login successful' : 'Invalid credentials'
        };
      })
    );
  }

  getSalesData(): Observable<SalesData> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      map(response => response.sales)
    );
  }

  getVehicleParts(): Observable<VehiclePart[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map(response => response.vehicleParts)
    );
  }

  addVehiclePart(part: Omit<VehiclePart, 'id'>): Observable<VehiclePart> {
    return this.http.get<any>(this.API_URL).pipe(
      map(data => {
        const newId = Math.max(...data.vehicleParts.map((p: VehiclePart) => p.id)) + 1;
        const newPart = { ...part, id: newId };
        data.vehicleParts.push(newPart);
        return newPart;
      })
    );
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map(response => response.customers)
    );
  }

  getSalesRecords(): Observable<SaleRecord[]> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      map(response => response.salesRecords)
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      map(response => response.categories)
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      map(response => response.employees)
    );
  }
}
