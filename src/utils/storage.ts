export const getItem = (name: any) => {
  const data = window.localStorage.getItem(name);
  try {
    return JSON.parse(<string>data);
  } catch (err) {
    return data;
  }
};

export const setItem = (name: any, value: any) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  window.localStorage.setItem(name, value);
};

export const removeItem = (name: any) => {
  window.localStorage.removeItem(name);
};
