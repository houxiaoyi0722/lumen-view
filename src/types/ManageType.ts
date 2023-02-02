
export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  roles: Role[];
  userGroup: UserGroup;
  userExt: UserExData;
}

export interface UserExData {
  id: string;
  name: string;
  gender: string;
  birthday: Date;
  avatar: Storage;
  intro: string;
  phone: string;
  mobilePhone: string;
  address: string;
  email: string;
  user: User;
}

export interface Storage {
  id: string;
  originalFileName: string;
  suffix: string;
  businessCode: string;
  businessType: string;
  downLoadUrl: string;
}

export interface Role {
  id: number;
  roleName: string;
  roleCode: string;
  comment: string;
  parentId: number;
  permissions: Permission[];
}

export interface UserGroup {
  id: number;
  groupName: string;
  groupCode: string;
  comment: string;
  parentId: number;
}

export interface Permission {
  id: number;
  code: string;
  name: string;
  comment: string;
}
