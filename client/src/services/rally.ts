import * as T from "@/types";
import { $http } from "@/axios";

export const getAllRallies = async (): Promise<T.Rally[] | null> => {
  try {
    const response = await $http.get("/rally");
    return response.data || [];
  } catch {
    return null;
  }
};

export const getRallyById = async (rallyId: string): Promise<T.Rally | null> => {
  try {
    const response = await $http.get(`/rally/${rallyId}`);
    return response.data || null;
  } catch {
    return null;
  }
}; 

export const createRally = async (
  rally: Partial<T.Rally>
): Promise<boolean> => {
  try {
    await $http.post("/rally", rally);
    return true;
  } catch {
    return false;
  }
};

export const deleteRallyById = async (rallyId: string): Promise<T.Rally | null> => {
  try {
    const response = await $http.delete(`/rally/${rallyId}`);
    return response.data || null;
  } catch {
    return null;
  }
}; 

/*
how to use in other files

const t_rally: T.Rally = {};

const res = await createRally(t_rally);

if (res) console.log("it worked");
else console.log("it failed");

*/