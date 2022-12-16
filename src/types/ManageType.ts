export interface UserVo {
  id: string;
  name: string;
  username: string;
  password: string;
  roles: any[];
  userGroup: any;
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
  user: UserVo;
}

export interface Storage {
  id: string;
  originalFileName: string;
  suffix: string;
  businessCode: string;
  businessType: string;
  downLoadUrl: string;
}

export interface RoleVo {
  id: number;
  roleName: string;
  roleCode: string;
  comment: string;
  parentId: number;
}

export interface UserGroupVo {
  id: number;
  groupName: string;
  groupCode: string;
  comment: string;
  parentId: number;
}
