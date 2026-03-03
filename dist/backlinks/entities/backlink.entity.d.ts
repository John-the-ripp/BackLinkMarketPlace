import { User } from '../../users/entities/user.entity.js';
export declare enum BacklinkStatus {
    AVAILABLE = "available",
    SOLD = "sold"
}
export declare class Backlink {
    id: number;
    url: string;
    anchorText: string;
    targetUrl: string;
    price: number;
    status: BacklinkStatus;
    seller: User;
    sellerId: number;
    buyer: User;
    buyerId: number;
    createdAt: Date;
    updatedAt: Date;
}
