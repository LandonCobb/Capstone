import * as T from "@/types";
import { $http } from "@/axios";

export const getAllVehicles = async (): Promise<T.Vehicle[] | null> => {
    try {
      const response = await $http.get("/vehicle");
      return response.data || [];
    } catch {
      return null;
    }
  };

  export const getVehicleById = async (vehicleId: string): Promise<T.Vehicle | null> => {
    try {
      const response = await $http.get(`/vehicle/${vehicleId}`);
      return response.data || null;
    } catch {
      return null;
    }
  }; 
  
  export const createVehicle = async (
    vehicle: Partial<T.Vehicle>
  ): Promise<boolean> => {
    try {
      await $http.post("/vehicle", vehicle);
      return true;
    } catch {
      return false;
    }
  };
  
  export const deleteVehicleById = async (vehicleId: string): Promise<T.Vehicle | null> => {
    try {
      const response = await $http.delete(`/vehicle/${vehicleId}`);
      return response.data || null;
    } catch {
      return null;
    }
  }; 