export interface IUser {
    userId?: string;
    addressId?: string;
    profileId?: string;
    isUserInGroup: boolean;
    isUserHead: boolean;
    email: string;
    password?: string;
    isDeleted: boolean;
}