export interface GalleryItem {
    _id: string;
    title: string;
    description?: string;
    category: string;
    imageUrl: string;
    publicId: string;
    tags: string[];
    isFeatured: boolean;
    views: number;
    createdAt: string;
}

export interface Service {
    _id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    startingPrice: number;
    priceRange?: string;
    estimatedDays?: string;
    features: string[];
    isActive: boolean;
    isFeatured: boolean;
}

export interface Frame {
    _id: string;
    name: string;
    size: string;
    style: string;
    material?: string;
    imageUrl: string;
    price: number;
    availableColors: string[];
    description?: string;
    isAvailable: boolean;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customerName: string;
    mobile: string;
    email: string;
    artworkType: string;
    frame?: Frame;
    size: string;
    instructions?: string;
    deliveryAddress: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
    };
    referenceImages: { url: string; publicId: string }[];
    status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Delivered' | 'Cancelled';
    totalAmount?: number;
    isPaid: boolean;
    createdAt: string;
}

export interface Contact {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
    subject?: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
    createdAt: string;
}

export interface DashboardStats {
    totalGallery: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalContacts: number;
    unreadContacts: number;
    totalServices: number;
    recentOrders: Order[];
    recentContacts: Contact[];
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    total?: number;
    page?: number;
    totalPages?: number;
}
