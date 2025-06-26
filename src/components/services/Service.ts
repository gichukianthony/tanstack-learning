
      export interface Service {
    id: number;
    name: string;
    description: string;
    price: string;
    duration: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
}
export interface CreateServiceInput {
    name: string;
    description: string;
    price: string;
    duration: number;
    isAvailable: boolean;
    categoryId: number;
}