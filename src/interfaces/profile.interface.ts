export interface IProfile {
    profileId?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    birthDate: string; // store as ISO string
    phoneNumber: string;
}