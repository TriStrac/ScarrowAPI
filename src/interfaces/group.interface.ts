export interface IGroup{    
    GroupID: string;
    GroupOwnerID: string;
    GroupName: string;
    GroupDescription: string;
    isDeleted?: boolean;
    DateCreated: Date;
    DateUpdated?: Date;
}

export interface IGroupMember {
    GroupID: string;
    UserID: string;
    DateJoined: Date;
    DateLeft?: Date;
}