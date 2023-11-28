export interface User {
    uid: string;
    email: string;
    nickname: string;
    rallyIds: [];
    vehicleIds: [];
}

export interface CheckoutLineItem {
    product_name: string;
    price: number; //$10 = 1000 | $10.99 = 1099
    ralli_id: string;
}

export interface Rally {
    ralliId: string;
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