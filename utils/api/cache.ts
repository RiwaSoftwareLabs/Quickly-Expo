import AsyncStorage from "@react-native-async-storage/async-storage";

export const setCache = async (key: string, data: any) => {
  const value = JSON.stringify({
    data,
    timestamp: Date.now(),
  });
  await AsyncStorage.setItem(key, value);
};

export const getCache = async (key: string) => {
  const cachedItem = await AsyncStorage.getItem(key);
  if (!cachedItem) return null;

  const parsedItem = JSON.parse(cachedItem);
  return parsedItem.data;
};

export const isCacheValid = async (key: string, expiryTime = 5 * 60 * 1000) => {
  const cachedItem = await AsyncStorage.getItem(key);
  if (!cachedItem) return false;

  const parsedItem = JSON.parse(cachedItem);
  const isValid = Date.now() - parsedItem.timestamp < expiryTime;
  return isValid;
};

export const clearCache = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
