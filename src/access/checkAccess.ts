import accessEnum from "@/access/accessEnum";

/**
 * 检查权限
 * @param loginUser
 * @param access
 */
const checkAccess = (loginUser: any, access: any) => {
  // 获取当前登录用户拥有的权限
  const loginUserAccess = loginUser?.userRole ?? accessEnum.NOT_LOGIN;

  if (access === accessEnum.NOT_LOGIN) {
    return true;
  }
  if (access === accessEnum.USER) {
    if (loginUserAccess === accessEnum.NOT_LOGIN) {
      return false;
    }
  }
  if (access === accessEnum.ADMIN) {
    if (loginUserAccess !== accessEnum.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
