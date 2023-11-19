export interface User {
    uid: string;
    email: string;
    nickname: string;
}

export interface Rally {
    rallyId: string;
    name: string;
    vehicleType: string;
    isPrivate: boolean;
    regFee: string;
    startPoint: string;
    endPoint: string;
}

export interface Vehicle {
    vehicleId: string;
    make: string;
    model: string;
    year: string;
}