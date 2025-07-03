export interface ServiceRequest {
    id: string;
    user: {
        id: number;
        name: string;
        email: string;
        password: string;
        role: string;
        phone?: string | null;
        address?: string | null;
        hashedRefreshToken?: string;
        createdAt: string;
        updatedAt: string;
    };
    mechanic: {
        id: number;
        name: string;
        email: string;
        phone: string;
        location: string;
        notes?: string | null;
        status: string;
        specialization: string;
        rejectionReason?: string | null;
        documents?: string | null;
        experience?: string | null;
        certifications?: string | null;
        isVerified: boolean;
        lastVerifiedAt?: string;
        createdAt: string;
        updatedAt: string;
    };
    service: {
        id: number;
        name: string;
        description: string;
        price: string;
        duration: number;
        isAvailable: boolean;
        createdAt: string;
        updatedAt: string;
        categoryId: number;
    };
    status: string;
    description: string;
    price: string;
    scheduledDate: string | null;
    location: string;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceRequestInput {
    mechanicId: number;
    serviceId: number;
    description: string;
    price: number;
    location: string;
}