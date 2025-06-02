import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, of, throwError } from 'rxjs'; // Added 'of' and 'throwError'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'; // Added isPlatformServer

// Import Node.js modules for server-side file access
// IMPORTANT: These imports are typically handled by Angular CLI's build process for SSR.
// You usually don't need direct 'import * as fs' in a service.
// Instead, Angular Universal provides a way to get node modules into the server bundle.
// The common approach is to use `require()` within the `isPlatformServer` block.
// We'll define `fs` and `path` conditionally.
let fs: any;
let path: any;

// Only import on the server side
if (isPlatformServer(PLATFORM_ID)) { // This check can't be done at the top level
                                    // if PLATFORM_ID is not available yet.
                                    // It's safer to do this inside the function where it's used.
                                    // However, for the purpose of demonstrating the fix, we'll
                                    // use a common pattern where `require` is inside the method.
}


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
  employees: Employee[];
  vehicleParts: VehiclePart[]; // Make sure this is part of your actual users.json structure
  customers: Customer[];     // Make sure this is part of your actual users.json structure
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
  private readonly API_URL = 'users.json'; // Relative path for browser

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) { }

  private getLocalData(): Observable<ApiResponse> {
    if (isPlatformBrowser(this.platformId)) {
      // Browser: Use HttpClient to fetch the static file
      return this.http.get<ApiResponse>(this.API_URL);
    } else {
      // Server (SSR/Prerendering): Read the file directly from the file system
      try {
        // Dynamically import Node.js modules to avoid bundling issues for browser build
        fs = require('node:fs');
        path = require('node:path');

        // Construct the absolute path to users.json
        // Angular's build process copies assets from 'public' to the 'browser' output directory.
        // So, `dist/concesionario/browser/users.json` is where the file will be.
        // The server-side bundle is typically executed from `dist/concesionario/server/main.js`.
        // Relative path from server bundle to browser assets: `../browser/users.json`
        const jsonPath = path.join(process.cwd(), 'browser', this.API_URL); // `this.API_URL` is 'users.json'

        if (!fs.existsSync(jsonPath)) {
          console.error(`[SSR] users.json not found at: ${jsonPath}`);
          throw new Error(`[SSR] users.json not found.`);
        }

        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        return of(JSON.parse(jsonData));
      } catch (e: any) {
        console.error(`[SSR] Error reading ${this.API_URL} on server:`, e);
        // Return an observable with an error or an empty object, depending on how you want to handle it
        return throwError(() => new Error(`Failed to load data during SSR: ${ e.message}`));
      }
    }
  }

  // --- Login ---
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.getLocalData().pipe( // Use the new getLocalData method
      delay(isPlatformBrowser(this.platformId) ? 1000 : 0), // Apply delay only in browser
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

  // --- Sales Data ---
  getSalesData(): Observable<SalesData> {
    return this.getLocalData().pipe( // Use the new getLocalData method
      map(response => response.sales)
    );
  }

  // --- Vehicle Parts ---
  getVehicleParts(): Observable<VehiclePart[]> {
    return this.getLocalData().pipe( // Use the new getLocalData method
      map(response => response.vehicleParts || []) // Add fallback in case vehicleParts is missing
    );
  }

  addVehiclePart(part: Omit<VehiclePart, 'id'>): Observable<VehiclePart> {
    // IMPORTANT: Adding data this way will only modify the in-memory data
    // during SSR. It will NOT modify the actual users.json file on disk.
    // For a real application, you'd need a backend API to persist data.
    return this.getLocalData().pipe( // Use the new getLocalData method
      map(data => {
        const currentParts = data.vehicleParts || [];
        const newId = currentParts.length > 0 ? Math.max(...currentParts.map((p: VehiclePart) => p.id)) + 1 : 1;
        const newPart = { ...part, id: newId };
        currentParts.push(newPart); // This modifies the in-memory 'data' object
        return newPart;
      })
    );
  }

  // --- Customers ---
  getCustomers(): Observable<Customer[]> {
    return this.getLocalData().pipe( // Use the new getLocalData method
      map(response => response.customers || []) // Add fallback
    );
  }

  // --- Sales Records ---
  getSalesRecords(): Observable<SaleRecord[]> {
    return this.getLocalData().pipe( // Use the new getLocalData method
      map(response => response.salesRecords || []) // Add fallback
    );
  }

  // --- Categories ---
  getCategories(): Observable<Category[]> {
    return this.getLocalData().pipe( // Use the new getLocalData method
      map(response => response.categories || []) // Add fallback
    );
  }

  // --- Employees ---
  getEmployees(): Observable<Employee[]> {
    return this.getLocalData().pipe( // Use the new getLocalData method
      map(response => response.employees || []) // Add fallback
    );
  }
}
